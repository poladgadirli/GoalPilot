package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Auth.LoginRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.LogoutRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RefreshTokenRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RegisterRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.ResetPasswordRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.VerifyResetOtpRequest;
import com.example.AIPlanner.DTOs.Responses.Auth.AuthResponse;
import com.example.AIPlanner.DTOs.Requests.Auth.ChangePasswordRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.ForgotPasswordRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(LogoutRequest request);

    void changePassword(ChangePasswordRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void verifyResetOtp(VerifyResetOtpRequest request);

    void resetPassword(ResetPasswordRequest request);
}
