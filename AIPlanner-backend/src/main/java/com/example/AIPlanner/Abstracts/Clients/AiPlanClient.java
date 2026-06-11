package com.example.AIPlanner.Abstracts.Clients;

import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanResponse;
import com.example.AIPlanner.DTOs.Requests.Goals.GoalRecommendationRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalRecommendationResponse;
import com.example.AIPlanner.Entities.Goal;

public interface AiPlanClient {

    GoalRecommendationResponse getGoalRecommendation(GoalRecommendationRequest request);

    AiGeneratedPlanResponse generatePlan(Goal goal);
}
