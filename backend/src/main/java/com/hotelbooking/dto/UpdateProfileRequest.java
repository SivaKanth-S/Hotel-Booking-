package com.hotelbooking.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    private String name;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String name, String newPassword) {
        this.name = name;
        this.newPassword = newPassword;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
