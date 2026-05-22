package com.example.AIPlanner.DTOs.Responses.Plans;

import com.example.AIPlanner.Enums.PlanGenerationType;
import com.example.AIPlanner.Enums.PlanStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PlanResponse {

    private Long id;
    private Long goalId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private PlanGenerationType generationType;
    private PlanStatus status;
    private List<PlanDayResponse> days;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PlanResponse() {
    }

    public PlanResponse(
            Long id,
            Long goalId,
            String title,
            String description,
            LocalDate startDate,
            LocalDate endDate,
            Integer totalDays,
            PlanGenerationType generationType,
            PlanStatus status,
            List<PlanDayResponse> days,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.goalId = goalId;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalDays = totalDays;
        this.generationType = generationType;
        this.status = status;
        this.days = days;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getGoalId() {
        return goalId;
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

    public LocalDate getEndDate() {
        return endDate;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public PlanGenerationType getGenerationType() {
        return generationType;
    }

    public PlanStatus getStatus() {
        return status;
    }

    public List<PlanDayResponse> getDays() {
        return days;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}