package com.example.AIPlanner.DTOs.Requests.Goals;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GoalRecommendationRequest {

    @NotBlank(message = "Goal title is required")
    @Size(max = 150, message = "Goal title must be at most 150 characters")
    private String title;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    public GoalRecommendationRequest() {
    }

    public GoalRecommendationRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }
}