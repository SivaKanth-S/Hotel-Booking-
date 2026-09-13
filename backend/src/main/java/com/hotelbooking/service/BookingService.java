package com.hotelbooking.service;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.dto.BookingResponse;
import com.hotelbooking.entity.*;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ConflictException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.PromotionRepository;
import com.hotelbooking.repository.RoomAvailabilityRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomAvailabilityRepository roomAvailabilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private EmailService emailService;

    private static final String ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    // -----------------------------------------------------------------------
    // CREATE BOOKING
    // -----------------------------------------------------------------------
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getRoomId() == null) {
            throw new BadRequestException("Room ID is required");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        // --- Input validation ---
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }
        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date must be today or a future date");
        }
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }
        if (request.getNumGuests() == null || request.getNumGuests() <= 0) {
            throw new BadRequestException("Number of guests must be at least 1");
        }
        int maxCapacity = room.getCapacity() != null ? room.getCapacity() : 4;
        if (request.getNumGuests() > maxCapacity) {
            throw new BadRequestException("Guest count exceeds maximum room capacity of " + maxCapacity);
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            throw new BadRequestException("Booking duration must be at least 1 night");
        }

        int totalUnits = room.getTotalUnits() != null ? room.getTotalUnits() : 1;

        // --- Atomic availability check & decrement (one row per date, pessimistic lock) ---
        LocalDate curr = request.getCheckInDate();
        while (curr.isBefore(request.getCheckOutDate())) {
            Optional<RoomAvailability> availOpt =
                    roomAvailabilityRepository.findByRoomIdAndDateWithLock(room.getId(), curr);

            RoomAvailability availability;
            if (availOpt.isPresent()) {
                availability = availOpt.get();
                int availableUnits = availability.getUnitsAvailable() != null ? availability.getUnitsAvailable() : 0;
                if (availableUnits <= 0) {
                    throw new ConflictException("No rooms available for date: " + curr);
                }
                availability.setUnitsAvailable(availableUnits - 1);
            } else {
                // First booking ever for this date — lazy-create the record
                if (totalUnits <= 0) {
                    throw new ConflictException("No rooms available for date: " + curr);
                }
                availability = new RoomAvailability(room, curr, totalUnits - 1);
            }
            roomAvailabilityRepository.save(availability);
            curr = curr.plusDays(1);
        }

        // --- Pricing & promotion ---
        double pricePerNight = room.getPricePerNight() != null ? room.getPricePerNight() : 0.0;
        double baseTotal = pricePerNight * nights;
        double discountAmount = 0.0;
        Promotion appliedPromo = null;

        if (request.getPromotionCode() != null && !request.getPromotionCode().trim().isEmpty()) {
            Optional<Promotion> promoOpt =
                    promotionRepository.findByCodeIgnoreCase(request.getPromotionCode().trim());
            if (promoOpt.isPresent() && promoOpt.get().isValidForDate(request.getCheckInDate())) {
                appliedPromo = promoOpt.get();
                if (appliedPromo.getDiscountType() == DiscountType.PERCENTAGE) {
                    discountAmount = (baseTotal * appliedPromo.getDiscountValue()) / 100.0;
                } else {
                    discountAmount = appliedPromo.getDiscountValue();
                }
            }
        }

        double finalTotal = Math.round(Math.max(0.0, baseTotal - discountAmount) * 100.0) / 100.0;

        // --- Persist booking ---
        String resCode = generateReservationCode();
        Booking booking = new Booking(
                resCode,
                user,
                room,
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getNumGuests(),
                finalTotal,
                BookingStatus.CONFIRMED,
                appliedPromo
        );

        Booking saved = bookingRepository.save(booking);
        BookingResponse response = mapToResponse(saved, discountAmount);

        // --- Send booking confirmation email asynchronously ---
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            emailService.sendBookingConfirmationEmail(user.getEmail(), user.getName(), response);
        }

        return response;
    }

    // -----------------------------------------------------------------------
    // GET MY BOOKINGS
    // -----------------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(b -> mapToResponse(b, 0.0))
                .collect(Collectors.toList());
    }

    // -----------------------------------------------------------------------
    // GET BOOKING BY ID
    // -----------------------------------------------------------------------
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, Long currentUserId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User bookingUser = booking.getUser();
        if (!isAdmin && (bookingUser == null || !bookingUser.getId().equals(currentUserId))) {
            throw new AccessDeniedException("You are not authorized to view this booking");
        }

        return mapToResponse(booking, 0.0);
    }

    // -----------------------------------------------------------------------
    // CANCEL BOOKING
    // -----------------------------------------------------------------------
    @Transactional
    public BookingResponse cancelBooking(Long id, Long currentUserId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User bookingUser = booking.getUser();
        if (!isAdmin && (bookingUser == null || !bookingUser.getId().equals(currentUserId))) {
            throw new AccessDeniedException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        // --- Restore room availability for the full date range ---
        Room room = booking.getRoom();
        if (room != null) {
            int totalUnits = room.getTotalUnits() != null ? room.getTotalUnits() : 1;
            LocalDate curr = booking.getCheckInDate();
            while (curr != null && booking.getCheckOutDate() != null && curr.isBefore(booking.getCheckOutDate())) {
                Optional<RoomAvailability> availOpt =
                        roomAvailabilityRepository.findByRoomIdAndDateWithLock(room.getId(), curr);

                if (availOpt.isPresent()) {
                    RoomAvailability avail = availOpt.get();
                    int currentUnits = avail.getUnitsAvailable() != null ? avail.getUnitsAvailable() : 0;
                    avail.setUnitsAvailable(Math.min(totalUnits, currentUnits + 1));
                    roomAvailabilityRepository.save(avail);
                } else {
                    RoomAvailability avail = new RoomAvailability(room, curr, totalUnits);
                    roomAvailabilityRepository.save(avail);
                }
                curr = curr.plusDays(1);
            }
        }

        Booking updated = bookingRepository.save(booking);
        BookingResponse response = mapToResponse(updated, 0.0);

        // --- Send cancellation email asynchronously ---
        if (bookingUser != null && bookingUser.getEmail() != null && !bookingUser.getEmail().trim().isEmpty()) {
            emailService.sendBookingCancellationEmail(bookingUser.getEmail(), bookingUser.getName(), response);
        }

        return response;
    }

    // -----------------------------------------------------------------------
    // GET ALL BOOKINGS (admin)
    // -----------------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsAdmin() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(b -> mapToResponse(b, 0.0))
                .collect(Collectors.toList());
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------
    private String generateReservationCode() {
        String yearMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        StringBuilder sb = new StringBuilder("RES-").append(yearMonth).append("-");
        for (int i = 0; i < 6; i++) {
            sb.append(ALPHANUM.charAt(RANDOM.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }

    private BookingResponse mapToResponse(Booking booking, double discountAmount) {
        BookingResponse res = new BookingResponse();
        res.setId(booking.getId());
        res.setReservationNumber(booking.getReservationNumber());
        if (booking.getUser() != null) {
            res.setUserId(booking.getUser().getId());
            res.setUserName(booking.getUser().getName());
            res.setUserEmail(booking.getUser().getEmail());
        }
        if (booking.getRoom() != null) {
            res.setRoomId(booking.getRoom().getId());
            res.setRoomCategory(booking.getRoom().getCategory());
            res.setPricePerNight(booking.getRoom().getPricePerNight());
            if (booking.getRoom().getHotel() != null) {
                res.setHotelId(booking.getRoom().getHotel().getId());
                res.setHotelName(booking.getRoom().getHotel().getName());
                res.setHotelCity(booking.getRoom().getHotel().getCity());
            }
        }
        res.setCheckInDate(booking.getCheckInDate());
        res.setCheckOutDate(booking.getCheckOutDate());
        res.setNumGuests(booking.getNumGuests());

        if (booking.getCheckInDate() != null && booking.getCheckOutDate() != null) {
            long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
            res.setTotalNights(nights);
        }
        double discount = discountAmount;
        if (discount == 0.0 && booking.getPromotion() != null && booking.getRoom() != null && res.getTotalNights() != null) {
            double pricePerNight = booking.getRoom().getPricePerNight() != null ? booking.getRoom().getPricePerNight() : 0.0;
            double base = pricePerNight * res.getTotalNights();
            if (booking.getPromotion().getDiscountType() == DiscountType.PERCENTAGE) {
                discount = (base * booking.getPromotion().getDiscountValue()) / 100.0;
            } else {
                discount = booking.getPromotion().getDiscountValue();
            }
        }
        res.setDiscountAmount(discount);
        res.setTotalPrice(booking.getTotalPrice());
        res.setStatus(booking.getStatus());
        res.setCreatedAt(booking.getCreatedAt());

        return res;
    }
}
