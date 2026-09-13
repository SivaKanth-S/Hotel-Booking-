package com.hotelbooking;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.dto.BookingResponse;
import com.hotelbooking.entity.*;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.PromotionRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.service.BookingService;
import com.hotelbooking.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

@SpringBootTest
public class BookingServiceTest {

    private static final String TEST_EMAIL = "customer@example.com";

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Prevents real SMTP connection attempts during testing
    @MockBean
    private EmailService emailService;

    private User testUser;
    private Hotel testHotel;
    private Room testRoom;

    @BeforeEach
    public void setUp() {
        doNothing().when(emailService).sendBookingConfirmationEmail(any(), any(), any());
        doNothing().when(emailService).sendBookingCancellationEmail(any(), any(), any());
        doNothing().when(emailService).sendWelcomeEmail(any(), any());

        testUser = userRepository.findByEmail(TEST_EMAIL).orElseGet(() -> {
            User user = new User("Test Customer", TEST_EMAIL, passwordEncoder.encode("Customer@123"), Role.CUSTOMER);
            return userRepository.save(user);
        });

        testHotel = hotelRepository.findAll().stream().findFirst().orElseGet(() -> {
            Hotel hotel = new Hotel(
                    "Grand Test Hotel",
                    "A luxury test hotel",
                    "123 Test Street",
                    "Chennai",
                    "India",
                    4.8,
                    "WiFi,Pool,Spa",
                    "https://example.com/hotel.jpg"
            );
            return hotelRepository.save(hotel);
        });

        testRoom = roomRepository.findByHotelId(testHotel.getId()).stream().findFirst().orElseGet(() -> {
            Room room = new Room(
                    testHotel,
                    "Deluxe",
                    5000.0,
                    2,
                    "AC,WiFi,TV",
                    10,
                    "https://example.com/room.jpg"
            );
            return roomRepository.save(room);
        });

        // Ensure promo code WELCOME10 exists for testing
        if (promotionRepository.findByCodeIgnoreCase("WELCOME10").isEmpty()) {
            Promotion promo = new Promotion(
                    "WELCOME10",
                    DiscountType.PERCENTAGE,
                    10.0,
                    LocalDate.now().minusDays(1),
                    LocalDate.now().plusMonths(6),
                    true
            );
            promotionRepository.save(promo);
        }
    }

    @Test
    @Transactional
    public void testCreateAndCancelBooking() {
        LocalDate checkIn = LocalDate.now().plusDays(10);
        LocalDate checkOut = LocalDate.now().plusDays(13);

        BookingRequest request = new BookingRequest();
        request.setRoomId(testRoom.getId());
        request.setCheckInDate(checkIn);
        request.setCheckOutDate(checkOut);
        request.setNumGuests(2);
        request.setPromotionCode("WELCOME10");

        BookingResponse response = bookingService.createBooking(testUser.getId(), request);

        assertNotNull(response);
        assertNotNull(response.getReservationNumber());
        assertTrue(response.getReservationNumber().startsWith("RES-"));
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());
        assertEquals(3L, response.getTotalNights());
        assertTrue(response.getTotalPrice() > 0);

        // Cancel the booking
        BookingResponse cancelled = bookingService.cancelBooking(response.getId(), testUser.getId(), false);
        assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());
    }

    @Test
    @Transactional
    public void testGetMyBookings() {
        LocalDate checkIn = LocalDate.now().plusDays(15);
        LocalDate checkOut = LocalDate.now().plusDays(17);

        BookingRequest request = new BookingRequest();
        request.setRoomId(testRoom.getId());
        request.setCheckInDate(checkIn);
        request.setCheckOutDate(checkOut);
        request.setNumGuests(1);

        bookingService.createBooking(testUser.getId(), request);

        var myBookings = bookingService.getMyBookings(testUser.getId());
        assertFalse(myBookings.isEmpty());
    }
}
