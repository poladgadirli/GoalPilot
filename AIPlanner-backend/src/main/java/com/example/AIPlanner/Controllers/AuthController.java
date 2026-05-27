package com.example.AIPlanner.Controllers;

import com.example.AIPlanner.Abstracts.Services.AuthService;
import com.example.AIPlanner.DTOs.Requests.Auth.ForgotPasswordRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.LoginRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.LogoutRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RefreshTokenRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RegisterRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.ResetPasswordRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.VerifyResetOtpRequest;
import com.example.AIPlanner.DTOs.Responses.Auth.AuthResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        return ApiResponse.success("Registered successfully", response);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        return ApiResponse.success("Logged in successfully", response);
    }

    @PostMapping("/refresh-token")
    public ApiResponse<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);

        return ApiResponse.success("Token refreshed successfully", response);
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);

        return ApiResponse.success("Logged out successfully", null);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);

        return ApiResponse.success("Password reset code sent successfully", null);
    }

    @PostMapping("/verify-reset-otp")
    public ApiResponse<Void> verifyResetOtp(@Valid @RequestBody VerifyResetOtpRequest request) {
        authService.verifyResetOtp(request);

        return ApiResponse.success("Reset code verified successfully", null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);

        return ApiResponse.success("Password reset successfully", null);
    }
}
