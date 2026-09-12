package com.hotelbooking.controller;

import com.hotelbooking.dto.PromotionRequest;
import com.hotelbooking.dto.PromotionValidateResponse;
import com.hotelbooking.entity.Promotion;
import com.hotelbooking.service.PromotionService;
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
@RequestMapping("/api/promotions")
@Tag(name = "Promotions", description = "Endpoints for discount promotion codes")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping("/validate")
    @Operation(summary = "Validate a promo code and retrieve discount parameters")
    public ResponseEntity<PromotionValidateResponse> validatePromoCode(@RequestParam String code) {
        PromotionValidateResponse response = promotionService.validatePromoCode(code);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all promo codes (Admin only)")
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        List<Promotion> promotions = promotionService.getAllPromotions();
        return ResponseEntity.ok(promotions);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new promotion code (Admin only)")
    public ResponseEntity<Promotion> createPromotion(@Valid @RequestBody PromotionRequest request) {
        Promotion created = promotionService.createPromotion(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
