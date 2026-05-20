package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.RefreshTokenService;
import com.example.AIPlanner.Entities.RefreshToken;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Repositories.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public RefreshToken createRefreshToken(User user) {
        String token = UUID.randomUUID().toString();

        LocalDateTime expiryDate = LocalDateTime.now()
                .plusSeconds(refreshExpiration / 1000);

        RefreshToken refreshToken = new RefreshToken(
                token,
                user,
                expiryDate
        );

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken validateRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenAndRevokedFalse(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);

            throw new IllegalArgumentException("Refresh token expired");
        }

        return refreshToken;
    }

    @Override
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenAndRevokedFalse(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    @Override
    public void revokeAllUserRefreshTokens(User user) {
        List<RefreshToken> activeTokens = refreshTokenRepository.findByUserAndRevokedFalse(user);

        for (RefreshToken token : activeTokens) {
            token.setRevoked(true);
        }

        refreshTokenRepository.saveAll(activeTokens);
    }
}