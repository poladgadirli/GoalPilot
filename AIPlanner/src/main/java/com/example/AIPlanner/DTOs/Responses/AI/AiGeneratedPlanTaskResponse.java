package com.example.AIPlanner.DTOs.Responses.AI;

public class AiGeneratedPlanTaskResponse {

    private String title;
    private String description;
    private Integer estimatedMinutes;
    private Integer orderIndex;

    public AiGeneratedPlanTaskResponse() {
    }

    public AiGeneratedPlanTaskResponse(
            String title,
            String description,
            Integer estimatedMinutes,
            Integer orderIndex
    ) {
        this.title = title;
        this.description = description;
        this.estimatedMinutes = estimatedMinutes;
        this.orderIndex = orderIndex;
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
}