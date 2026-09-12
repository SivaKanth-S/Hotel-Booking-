package com.hotelbooking;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.dto.BookingResponse;
import com.hotelbooking.entity.BookingStatus;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.entity.Room;
import com.hotelbooking.entity.User;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BookingServiceTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Test
    @Transactional
    public void testCreateAndCancelBooking() {
        User user = userRepository.findByEmail("customer@example.com").orElseThrow();
        List<Hotel> hotels = hotelRepository.findAll();
        assertFalse(hotels.isEmpty());
        List<Room> rooms = roomRepository.findByHotelId(hotels.get(0).getId());
        assertFalse(rooms.isEmpty());
        Room room = rooms.get(0);

        LocalDate checkIn = LocalDate.now().plusDays(20);
        LocalDate checkOut = LocalDate.now().plusDays(23);

        BookingRequest request = new BookingRequest();
        request.setRoomId(room.getId());
        request.setCheckInDate(checkIn);
        request.setCheckOutDate(checkOut);
        request.setNumGuests(2);
        request.setPromotionCode("WELCOME10");

        BookingResponse response = bookingService.createBooking(user.getId(), request);

        assertNotNull(response);
        assertNotNull(response.getReservationNumber());
        assertTrue(response.getReservationNumber().startsWith("RES-"));
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());
        assertEquals(3L, response.getTotalNights());
        assertTrue(response.getTotalPrice() > 0);

        // Cancel the booking
        BookingResponse cancelled = bookingService.cancelBooking(response.getId(), user.getId(), false);
        assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());
    }
}
