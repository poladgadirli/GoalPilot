package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.RefreshToken;
import com.example.AIPlanner.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);

    void deleteByUser(User user);
}