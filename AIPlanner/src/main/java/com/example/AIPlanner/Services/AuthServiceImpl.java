package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.AuthService;
import com.example.AIPlanner.DTOs.Requests.Auth.LoginRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RegisterRequest;
import com.example.AIPlanner.DTOs.Responses.Auth.AuthResponse;
import com.example.AIPlanner.DTOs.Responses.Auth.UserResponse;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String name = request.getName().trim();
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User(
                name,
                username,
                email,
                passwordEncoder.encode(password)
        );

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                toUserResponse(savedUser)
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        String password = request.getPassword();

        User user = userRepository
                .findByEmailOrUsername(identifier.toLowerCase(), identifier)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email/username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email/username or password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                toUserResponse(user)
        );
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