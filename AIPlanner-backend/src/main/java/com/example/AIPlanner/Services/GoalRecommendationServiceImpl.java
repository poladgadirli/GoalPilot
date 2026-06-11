package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Clients.AiPlanClient;
import com.example.AIPlanner.Abstracts.Services.GoalRecommendationService;
import com.example.AIPlanner.DTOs.Requests.Goals.GoalRecommendationRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalRecommendationResponse;
import org.springframework.stereotype.Service;

@Service
public class GoalRecommendationServiceImpl implements GoalRecommendationService {

    private final AiPlanClient aiPlanClient;

    public GoalRecommendationServiceImpl(AiPlanClient aiPlanClient) {
        this.aiPlanClient = aiPlanClient;
    }

    @Override
    public GoalRecommendationResponse generateRecommendation(GoalRecommendationRequest request) {
        GoalRecommendationResponse recommendation = aiPlanClient.getGoalRecommendation(request);
        if (recommendation == null) {
            throw new IllegalArgumentException("AI recommendation response is empty");
        }
        if (recommendation.getGoalTitle() == null || recommendation.getGoalTitle().trim().isBlank()) {
            throw new IllegalArgumentException("AI recommendation goal title is invalid");
        }
        if (recommendation.getMinimumRecommendedDays() == null
                || recommendation.getMinimumRecommendedDays() < 1) {
            throw new IllegalArgumentException("AI recommendation minimum days must be at least 1");
        }
        if (recommendation.getMinimumRecommendedMinutes() == null
                || recommendation.getMinimumRecommendedMinutes() <= 0) {
            throw new IllegalArgumentException("AI recommendation minimum minutes must be greater than 0");
        }
        if (recommendation.getReason() == null || recommendation.getReason().trim().isBlank()) {
            throw new IllegalArgumentException("AI recommendation reason is required");
        }
        return new GoalRecommendationResponse(
                request.getTitle().trim(),
                recommendation.getMinimumRecommendedDays(),
                recommendation.getMinimumRecommendedMinutes(),
                recommendation.getReason().trim()
        );
    }
}
