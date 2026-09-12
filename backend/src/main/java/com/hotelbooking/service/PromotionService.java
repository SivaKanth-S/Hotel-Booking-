package com.hotelbooking.service;

import com.hotelbooking.dto.PromotionRequest;
import com.hotelbooking.dto.PromotionValidateResponse;
import com.hotelbooking.entity.Promotion;
import com.hotelbooking.exception.ConflictException;
import com.hotelbooking.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Transactional(readOnly = true)
    public PromotionValidateResponse validatePromoCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return new PromotionValidateResponse(false, null, null, 0.0, "Promotion code cannot be empty");
        }

        Optional<Promotion> promoOpt = promotionRepository.findByCodeIgnoreCase(code.trim());
        if (promoOpt.isEmpty()) {
            return new PromotionValidateResponse(false, code, null, 0.0, "Promotion code not found");
        }

        Promotion promo = promoOpt.get();
        LocalDate today = LocalDate.now();

        if (!promo.isValidForDate(today)) {
            return new PromotionValidateResponse(false, promo.getCode(), promo.getDiscountType(), promo.getDiscountValue(), "Promotion code is expired or inactive");
        }

        return new PromotionValidateResponse(
                true,
                promo.getCode(),
                promo.getDiscountType(),
                promo.getDiscountValue(),
                "Valid promotion code (" + (promo.getDiscountType() == com.hotelbooking.entity.DiscountType.PERCENTAGE ? promo.getDiscountValue() + "% off" : "$" + promo.getDiscountValue() + " off") + ")"
        );
    }

    @Transactional(readOnly = true)
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    @Transactional
    public Promotion createPromotion(PromotionRequest request) {
        if (promotionRepository.findByCodeIgnoreCase(request.getCode()).isPresent()) {
            throw new ConflictException("Promotion code already exists: " + request.getCode());
        }

        Promotion promo = new Promotion(
                request.getCode().toUpperCase().trim(),
                request.getDiscountType(),
                request.getDiscountValue(),
                request.getValidFrom(),
                request.getValidTo(),
                request.getActive() != null ? request.getActive() : true
        );

        return promotionRepository.save(promo);
    }
}
