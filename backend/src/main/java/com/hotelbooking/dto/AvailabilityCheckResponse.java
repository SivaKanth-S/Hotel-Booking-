package com.hotelbooking.dto;

import java.time.LocalDate;

public class AvailabilityCheckResponse {

    private Long roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Boolean isAvailable;
    private Integer unitsRemaining;
    private Double pricePerNight;
    private Long totalNights;
    private Double estimatedTotal;

    public AvailabilityCheckResponse() {
    }

    public AvailabilityCheckResponse(Long roomId, LocalDate checkIn, LocalDate checkOut, Boolean isAvailable, Integer unitsRemaining, Double pricePerNight, Long totalNights, Double estimatedTotal) {
        this.roomId = roomId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.isAvailable = isAvailable;
        this.unitsRemaining = unitsRemaining;
        this.pricePerNight = pricePerNight;
        this.totalNights = totalNights;
        this.estimatedTotal = estimatedTotal;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Integer getUnitsRemaining() {
        return unitsRemaining;
    }

    public void setUnitsRemaining(Integer unitsRemaining) {
        this.unitsRemaining = unitsRemaining;
    }

    public Double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(Double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Long getTotalNights() {
        return totalNights;
    }

    public void setTotalNights(Long totalNights) {
        this.totalNights = totalNights;
    }

    public Double getEstimatedTotal() {
        return estimatedTotal;
    }

    public void setEstimatedTotal(Double estimatedTotal) {
        this.estimatedTotal = estimatedTotal;
    }
}
