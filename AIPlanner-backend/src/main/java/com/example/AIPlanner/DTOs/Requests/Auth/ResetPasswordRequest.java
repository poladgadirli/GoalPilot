package com.example.AIPlanner.DTOs.Requests.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "\\d{6}", message = "OTP must be 6 digits")
    @NotBlank(message = "OTP is required")
    private String code;

    @Size(min = 6, message = "New password must be at least 6 characters")
    @NotBlank(message = "New password is required")
    private String newPassword;

    @NotBlank(message = "Confirm new password is required")
    private String confirmNewPassword;

    public String getEmail() {
        return email;
    }

    public String getCode() {
        return code;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public String getConfirmNewPassword() {
        return confirmNewPassword;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public void setConfirmNewPassword(String confirmNewPassword) {
        this.confirmNewPassword = confirmNewPassword;
    }
}
