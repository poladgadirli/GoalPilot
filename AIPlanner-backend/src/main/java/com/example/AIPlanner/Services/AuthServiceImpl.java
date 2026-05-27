package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.AuthService;
import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.EmailService;
import com.example.AIPlanner.Abstracts.Services.RefreshTokenService;
import com.example.AIPlanner.DTOs.Requests.Auth.ChangePasswordRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.ForgotPasswordRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.LoginRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.LogoutRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RefreshTokenRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.RegisterRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.ResetPasswordRequest;
import com.example.AIPlanner.DTOs.Requests.Auth.VerifyResetOtpRequest;
import com.example.AIPlanner.DTOs.Responses.Auth.AuthResponse;
import com.example.AIPlanner.DTOs.Responses.Auth.UserResponse;
import com.example.AIPlanner.Entities.Category;
import com.example.AIPlanner.Entities.PasswordResetOtp;
import com.example.AIPlanner.Entities.RefreshToken;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Repositories.CategoryRepository;
import com.example.AIPlanner.Repositories.PasswordResetOtpRepository;
import com.example.AIPlanner.Repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AuthServiceImpl implements AuthService {

    private static final String[][] DEFAULT_CATEGORIES = {
            {"Work", "#2563EB"},
            {"Study", "#7C3AED"},
            {"Personal", "#16A34A"},
            {"Health", "#DC2626"},
            {"Other", "#64748B"}
    };

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final CurrentUserService currentUserService;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final EmailService emailService;

    public AuthServiceImpl(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            CurrentUserService currentUserService,
            PasswordResetOtpRepository passwordResetOtpRepository,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.currentUserService = currentUserService;
        this.passwordResetOtpRepository = passwordResetOtpRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String name = request.getName().trim();
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

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
        createDefaultCategories(savedUser);

        String accessToken = jwtService.generateAccessToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser);

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
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

        refreshTokenService.revokeAllUserRefreshTokens(user);

        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                toUserResponse(user)
        );
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.validateRefreshToken(
                request.getRefreshToken()
        );

        User user = refreshToken.getUser();

        String newAccessToken = jwtService.generateAccessToken(user);

        return new AuthResponse(
                newAccessToken,
                refreshToken.getToken(),
                toUserResponse(user)
        );
    }

    @Override
    public void logout(LogoutRequest request) {
        refreshTokenService.revokeRefreshToken(request.getRefreshToken());
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail()
        );
    }

    private void createDefaultCategories(User user) {
        for (String[] defaultCategory : DEFAULT_CATEGORIES) {
            String name = defaultCategory[0];

            if (categoryRepository.existsByNameIgnoreCaseAndUser(name, user)) {
                continue;
            }

            Category category = new Category();
            category.setUser(user);
            category.setName(name);
            category.setColor(defaultCategory[1]);

            categoryRepository.save(category);
        }
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUserService.getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (!userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with this email does not exist");
        }

        String code = String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
        PasswordResetOtp otp = new PasswordResetOtp(email, code, LocalDateTime.now().plusMinutes(10));

        passwordResetOtpRepository.deleteByEmailAndUsedFalse(email);
        passwordResetOtpRepository.save(otp);
        emailService.sendPasswordResetOtp(email, code);
    }

    @Override
    public void verifyResetOtp(VerifyResetOtpRequest request) {
        getValidPasswordResetOtp(request.getEmail(), request.getCode());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        PasswordResetOtp otp = getValidPasswordResetOtp(request.getEmail(), request.getCode());
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User with this email does not exist"));

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otp.markAsUsed();
        passwordResetOtpRepository.save(otp);
    }

    private PasswordResetOtp getValidPasswordResetOtp(String email, String code) {
        PasswordResetOtp otp = passwordResetOtpRepository
                .findTopByEmailAndCodeAndUsedFalseOrderByCreatedAtDesc(email.trim().toLowerCase(), code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset code"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid or expired reset code");
        }

        return otp;
    }
}
