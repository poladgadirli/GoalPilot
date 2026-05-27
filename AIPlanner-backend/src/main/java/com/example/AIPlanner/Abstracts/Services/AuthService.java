package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Auth.LoginRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.LogoutRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RefreshTokenRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RegisterRequest;
import com.example.AIPlanner.DTOs.Responses.Auth.AuthResponse;
import main.java.com.example.AIPlanner.DTOs.Requests.Auth.ChangePasswordRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(LogoutRequest request);

    void changePassword(ChangePasswordRequest request);
}