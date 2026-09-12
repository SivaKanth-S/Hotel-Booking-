package com.hotelbooking.dto;

import com.hotelbooking.entity.DiscountType;

public class PromotionValidateResponse {

    private Boolean valid;
    private String code;
    private DiscountType discountType;
    private Double discountValue;
    private String message;

    public PromotionValidateResponse() {
    }

    public PromotionValidateResponse(Boolean valid, String code, DiscountType discountType, Double discountValue, String message) {
        this.valid = valid;
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.message = message;
    }

    public Boolean getValid() {
        return valid;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public Double getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(Double discountValue) {
        this.discountValue = discountValue;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
