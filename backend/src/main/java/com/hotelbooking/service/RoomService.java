package com.hotelbooking.service;

import com.hotelbooking.dto.AvailabilityCheckResponse;
import com.hotelbooking.dto.RoomRequest;
import com.hotelbooking.dto.RoomResponse;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.entity.Room;
import com.hotelbooking.entity.RoomAvailability;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomAvailabilityRepository;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomAvailabilityRepository roomAvailabilityRepository;

    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByHotelId(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + hotelId);
        }
        return roomRepository.findByHotelId(hotelId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return mapToResponse(room);
    }

    @Transactional(readOnly = true)
    public AvailabilityCheckResponse checkAvailability(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        int minAvailable = room.getTotalUnits();

        LocalDate curr = checkIn;
        while (curr.isBefore(checkOut)) {
            Optional<RoomAvailability> availOpt = roomAvailabilityRepository.findByRoomIdAndDate(roomId, curr);
            int available = availOpt.map(RoomAvailability::getUnitsAvailable).orElse(room.getTotalUnits());
            if (available < minAvailable) {
                minAvailable = available;
            }
            curr = curr.plusDays(1);
        }

        boolean isAvailable = minAvailable > 0;
        double estimatedTotal = room.getPricePerNight() * nights;

        return new AvailabilityCheckResponse(
                roomId,
                checkIn,
                checkOut,
                isAvailable,
                minAvailable,
                room.getPricePerNight(),
                nights,
                estimatedTotal
        );
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + request.getHotelId()));

        Room room = new Room(
                hotel,
                request.getCategory(),
                request.getPricePerNight(),
                request.getCapacity(),
                request.getAmenities() != null ? String.join(",", request.getAmenities()) : "",
                request.getTotalUnits(),
                request.getImages() != null ? String.join(",", request.getImages()) : ""
        );

        Room saved = roomRepository.save(room);
        return mapToResponse(saved);
    }

    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        room.setCategory(request.getCategory());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setTotalUnits(request.getTotalUnits());
        if (request.getAmenities() != null) room.setAmenities(String.join(",", request.getAmenities()));
        if (request.getImages() != null) room.setImages(String.join(",", request.getImages()));

        Room updated = roomRepository.save(room);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    private RoomResponse mapToResponse(Room room) {
        RoomResponse res = new RoomResponse();
        res.setId(room.getId());
        res.setHotelId(room.getHotel().getId());
        res.setCategory(room.getCategory());
        res.setPricePerNight(room.getPricePerNight());
        res.setCapacity(room.getCapacity());
        res.setTotalUnits(room.getTotalUnits());

        if (room.getAmenities() != null && !room.getAmenities().trim().isEmpty()) {
            res.setAmenities(Arrays.asList(room.getAmenities().split("\\s*,\\s*")));
        } else {
            res.setAmenities(Collections.emptyList());
        }

        if (room.getImages() != null && !room.getImages().trim().isEmpty()) {
            res.setImages(Arrays.asList(room.getImages().split("\\s*,\\s*")));
        } else {
            res.setImages(Collections.emptyList());
        }

        return res;
    }
}
