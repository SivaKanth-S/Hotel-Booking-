package com.hotelbooking.controller;

import com.hotelbooking.dto.HotelRequest;
import com.hotelbooking.dto.HotelResponse;
import com.hotelbooking.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@Tag(name = "Hotels", description = "Endpoints for searching and managing hotels & resorts")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping
    @Operation(summary = "Search and list hotels with multi-facet filters")
    public ResponseEntity<List<HotelResponse>> getAllHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String amenities) {
        List<HotelResponse> hotels = hotelService.getAllHotels(city, minRating, minPrice, maxPrice, amenities);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hotel details by ID")
    public ResponseEntity<HotelResponse> getHotelById(@PathVariable Long id) {
        HotelResponse hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(hotel);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new hotel property (Admin only)")
    public ResponseEntity<HotelResponse> createHotel(@Valid @RequestBody HotelRequest request) {
        HotelResponse created = hotelService.createHotel(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing hotel property (Admin only)")
    public ResponseEntity<HotelResponse> updateHotel(@PathVariable Long id, @Valid @RequestBody HotelRequest request) {
        HotelResponse updated = hotelService.updateHotel(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a hotel property (Admin only)")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }
}
