package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Goals.GoalRecommendationRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalRecommendationResponse;

public interface GoalRecommendationService {

    GoalRecommendationResponse generateRecommendation(GoalRecommendationRequest request);
}