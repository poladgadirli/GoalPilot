package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetOtp(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("AI Planner Password Reset Code");
        message.setText("Your password reset code is: " + code + "\n\nThis code will expire in 10 minutes.");

        mailSender.send(message);
    }
}