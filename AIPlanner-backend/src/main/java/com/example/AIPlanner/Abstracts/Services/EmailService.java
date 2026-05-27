package com.example.AIPlanner.Abstracts.Services;

public interface EmailService {

    void sendPasswordResetOtp(String toEmail, String code);
}