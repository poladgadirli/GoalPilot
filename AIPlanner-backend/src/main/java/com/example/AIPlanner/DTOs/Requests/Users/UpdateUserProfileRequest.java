package com.example.AIPlanner.DTOs.Requests.Users;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateUserProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "Name must be 50 characters or less")
    private String name;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    public UpdateUserProfileRequest() {
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }
}
