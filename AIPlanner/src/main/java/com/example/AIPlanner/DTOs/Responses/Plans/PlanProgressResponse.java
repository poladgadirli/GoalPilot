package com.example.AIPlanner.DTOs.Responses.Plans;

public class PlanProgressResponse {

    private Long planId;
    private Integer totalDays;
    private Integer completedDays;
    private Integer totalTasks;
    private Integer completedTasks;
    private Double progressPercentage;

    public PlanProgressResponse() {
    }

    public PlanProgressResponse(
            Long planId,
            Integer totalDays,
            Integer completedDays,
            Integer totalTasks,
            Integer completedTasks,
            Double progressPercentage
    ) {
        this.planId = planId;
        this.totalDays = totalDays;
        this.completedDays = completedDays;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.progressPercentage = progressPercentage;
    }

    public Long getPlanId() {
        return planId;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public Integer getCompletedDays() {
        return completedDays;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public Integer getCompletedTasks() {
        return completedTasks;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }
}