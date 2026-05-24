package com.example.AIPlanner.DTOs.Requests.Goals;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CreateGoalRequest {

    @NotNull(message = "Recommendation id is required")
    private Long recommendationId;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

    @NotNull(message = "Duration days is required")
    @Min(value = 1, message = "Duration days must be at least 1")
    private Integer durationDays;

    @NotNull(message = "Daily available minutes is required")
    @Min(value = 15, message = "Daily available minutes must be at least 15")
    private Integer dailyAvailableMinutes;

    public CreateGoalRequest() {
    }

    public Long getRecommendationId() {
        return recommendationId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public Integer getDailyAvailableMinutes() {
        return dailyAvailableMinutes;
    }
}