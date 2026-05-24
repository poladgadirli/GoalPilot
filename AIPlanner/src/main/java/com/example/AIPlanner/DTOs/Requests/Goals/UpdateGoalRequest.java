package com.example.AIPlanner.DTOs.Requests.Goals;

import com.example.AIPlanner.Enums.GoalStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdateGoalRequest {

    @Size(max = 150, message = "Goal title must be at most 150 characters")
    private String title;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

    @Min(value = 1, message = "Duration days must be at least 1")
    private Integer durationDays;

    @Min(value = 15, message = "Daily available minutes must be at least 15")
    private Integer dailyAvailableMinutes;

    private GoalStatus status;

    public UpdateGoalRequest() {
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


    public GoalStatus getStatus() {
        return status;
    }
}