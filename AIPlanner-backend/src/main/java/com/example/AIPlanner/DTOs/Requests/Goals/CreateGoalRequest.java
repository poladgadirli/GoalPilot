package com.example.AIPlanner.DTOs.Requests.Goals;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreateGoalRequest {

    @NotBlank(message = "Goal title is required")
    @Size(max = 150, message = "Goal title must be at most 150 characters")
    private String title;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

    @NotNull(message = "Duration days is required")
    @Min(value = 1, message = "Duration days must be at least 1")
    private Integer durationDays;

    @NotNull(message = "Daily available minutes is required")
    @Positive(message = "Daily available minutes must be greater than 0")
    private Integer dailyAvailableMinutes;

    @NotNull(message = "Minimum recommended days is required")
    @Min(value = 1, message = "Minimum recommended days must be at least 1")
    private Integer minimumRecommendedDays;

    @NotNull(message = "Minimum recommended minutes is required")
    @Positive(message = "Minimum recommended minutes must be greater than 0")
    private Integer minimumRecommendedMinutes;

    public CreateGoalRequest() {
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
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

    public Integer getMinimumRecommendedDays() {
        return minimumRecommendedDays;
    }

    public Integer getMinimumRecommendedMinutes() {
        return minimumRecommendedMinutes;
    }
}
