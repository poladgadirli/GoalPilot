package com.example.AIPlanner.DTOs.Responses.Goals;

import com.example.AIPlanner.Enums.GoalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class GoalResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private Integer durationDays;
    private LocalDate endDate;
    private Integer dailyAvailableMinutes;
    private Integer minimumRecommendedDays;
    private Integer minimumRecommendedMinutes;
    private GoalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GoalResponse() {
    }

    public GoalResponse(
            Long id,
            String title,
            String description,
            LocalDate startDate,
            Integer durationDays,
            LocalDate endDate,
            Integer dailyAvailableMinutes,
            Integer minimumRecommendedDays,
            Integer minimumRecommendedMinutes,
            GoalStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.durationDays = durationDays;
        this.endDate = endDate;
        this.dailyAvailableMinutes = dailyAvailableMinutes;
        this.minimumRecommendedDays = minimumRecommendedDays;
        this.minimumRecommendedMinutes = minimumRecommendedMinutes;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
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

    public LocalDate getEndDate() {
        return endDate;
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

    public GoalStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}