package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.Entities.RefreshToken;
import com.example.AIPlanner.Entities.User;

import java.util.List;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(User user);

    RefreshToken validateRefreshToken(String token);

    void revokeRefreshToken(String token);

}