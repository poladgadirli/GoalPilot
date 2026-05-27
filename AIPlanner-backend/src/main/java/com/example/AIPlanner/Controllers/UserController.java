package com.example.AIPlanner.Controllers;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.DTOs.Requests.Users.UpdateUserProfileRequest;
import com.example.AIPlanner.DTOs.Responses.Auth.UserResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    public UserController(CurrentUserService currentUserService, UserRepository userRepository) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentProfile() {
        return ApiResponse.success("Profile loaded successfully", toUserResponse(currentUserService.getCurrentUser()));
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponse> updateCurrentProfile(
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        User currentUser = currentUserService.getCurrentUser();
        String name = request.getName().trim();
        String username = request.getUsername().trim();

        if (name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (username.isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }

        if (username.length() < 3 || username.length() > 30) {
            throw new IllegalArgumentException("Username must be between 3 and 30 characters");
        }

        userRepository.findByUsername(username)
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Username already exists");
                });

        currentUser.setName(name);
        currentUser.setUsername(username);

        User savedUser = userRepository.save(currentUser);

        return ApiResponse.success("Profile updated successfully", toUserResponse(savedUser));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
