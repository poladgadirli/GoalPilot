package com.example.AIPlanner.Controllers;

import com.example.AIPlanner.Abstracts.Services.GoalRecommendationService;
import com.example.AIPlanner.DTOs.Requests.Goals.GoalRecommendationRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalRecommendationResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goal-recommendations")
public class GoalRecommendationController {

    private final GoalRecommendationService goalRecommendationService;

    public GoalRecommendationController(GoalRecommendationService goalRecommendationService) {
        this.goalRecommendationService = goalRecommendationService;
    }

    @PostMapping
    public ApiResponse<GoalRecommendationResponse> generateRecommendation(
            @Valid @RequestBody GoalRecommendationRequest request
    ) {
        GoalRecommendationResponse response =
                goalRecommendationService.generateRecommendation(request);

        return ApiResponse.success(
                "Goal recommendation generated successfully",
                response
        );
    }
}