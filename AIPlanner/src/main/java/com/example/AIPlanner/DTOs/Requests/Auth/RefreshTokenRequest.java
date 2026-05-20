package com.example.AIPlanner.DTOs.Requests.Auth;

import jakarta.validation.constraints.NotBlank;

public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;

    public RefreshTokenRequest() {
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}