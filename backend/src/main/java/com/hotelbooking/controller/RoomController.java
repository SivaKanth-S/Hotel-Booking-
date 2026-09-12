package com.hotelbooking.controller;

import com.hotelbooking.dto.AvailabilityCheckResponse;
import com.hotelbooking.dto.RoomRequest;
import com.hotelbooking.dto.RoomResponse;
import com.hotelbooking.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Rooms & Availability", description = "Endpoints for room inventory and real-time availability checks")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/hotels/{hotelId}/rooms")
    @Operation(summary = "Get all rooms for a specific hotel")
    public ResponseEntity<List<RoomResponse>> getRoomsByHotel(@PathVariable Long hotelId) {
        List<RoomResponse> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/rooms/{id}")
    @Operation(summary = "Get room category details by ID")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        RoomResponse room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/rooms/{id}/availability")
    @Operation(summary = "Check live room availability for specific dates")
    public ResponseEntity<AvailabilityCheckResponse> checkAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        AvailabilityCheckResponse response = roomService.checkAvailability(id, checkIn, checkOut);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new room category (Admin only)")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        RoomResponse created = roomService.createRoom(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update room category details (Admin only)")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        RoomResponse updated = roomService.updateRoom(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a room category (Admin only)")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
