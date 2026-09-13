package com.hotelbooking.controller;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.dto.BookingResponse;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.security.UserPrincipal;
import com.hotelbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Bookings", description = "Endpoints for creating, viewing, and cancelling reservations")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create an atomic hotel room booking")
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody BookingRequest request) {
        if (currentUser == null) {
            throw new BadCredentialsException("Authentication required to make a reservation");
        }
        if (request == null) {
            throw new BadRequestException("Booking request body is required");
        }
        BookingResponse response = bookingService.createBooking(currentUser.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    @Operation(summary = "Get booking history for the currently logged-in user")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new BadCredentialsException("Authentication required to view your reservations");
        }
        List<BookingResponse> bookings = bookingService.getMyBookings(currentUser.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new BadCredentialsException("Authentication required to view this reservation");
        }
        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid booking ID");
        }
        boolean isAdmin = currentUser.getRole() == com.hotelbooking.entity.Role.ADMIN;
        BookingResponse booking = bookingService.getBookingById(id, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(booking);
    }

    @RequestMapping(value = "/{id}/cancel", method = {RequestMethod.PUT, RequestMethod.POST, RequestMethod.PATCH})
    @Operation(summary = "Cancel a booking and restore room availability")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new BadCredentialsException("Authentication required to cancel a reservation");
        }
        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid booking ID");
        }
        boolean isAdmin = currentUser.getRole() == com.hotelbooking.entity.Role.ADMIN;
        BookingResponse response = bookingService.cancelBooking(id, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a booking via standard DELETE endpoint")
    public ResponseEntity<BookingResponse> deleteBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return cancelBooking(id, currentUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all system bookings (Admin only)")
    public ResponseEntity<List<BookingResponse>> getAllBookingsAdmin() {
        List<BookingResponse> bookings = bookingService.getAllBookingsAdmin();
        return ResponseEntity.ok(bookings);
    }
}
