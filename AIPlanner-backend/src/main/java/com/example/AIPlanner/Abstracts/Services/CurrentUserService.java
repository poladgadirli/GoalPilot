package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.Entities.User;

public interface CurrentUserService {

    User getCurrentUser();

    Long getCurrentUserId();
}