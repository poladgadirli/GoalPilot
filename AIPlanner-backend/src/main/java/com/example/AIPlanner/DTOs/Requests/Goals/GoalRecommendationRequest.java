package com.example.AIPlanner.DTOs.Requests.Goals;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.FutureOrPresent;

import java.time.LocalDate;

public class GoalRecommendationRequest {

    @NotBlank(message = "Goal title is required")
    @Size(max = 150, message = "Goal title must be at most 150 characters")
    private String title;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @NotNull(message = "Daily available minutes is required")
    @Positive(message = "Daily available minutes must be greater than 0")
    private Integer dailyAvailableMinutes;

    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

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

    public Integer getDailyAvailableMinutes() {
        return dailyAvailableMinutes;
    }

    public LocalDate getStartDate() {
        return startDate;
    }
}
