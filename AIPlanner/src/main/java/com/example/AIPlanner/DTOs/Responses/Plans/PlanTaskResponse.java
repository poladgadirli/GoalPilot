package com.example.AIPlanner.DTOs.Responses.Plans;

import java.time.LocalDateTime;

public class PlanTaskResponse {

    private Long id;
    private String title;
    private String description;
    private Integer estimatedMinutes;
    private Integer orderIndex;
    private Boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PlanTaskResponse() {
    }

    public PlanTaskResponse(
            Long id,
            String title,
            String description,
            Integer estimatedMinutes,
            Integer orderIndex,
            Boolean completed,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.estimatedMinutes = estimatedMinutes;
        this.orderIndex = orderIndex;
        this.completed = completed;
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

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}