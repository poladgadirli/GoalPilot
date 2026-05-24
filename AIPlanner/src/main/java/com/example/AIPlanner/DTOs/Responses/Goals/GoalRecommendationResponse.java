package com.example.AIPlanner.DTOs.Responses.Goals;

public class GoalRecommendationResponse {

    private Long recommendationId;
    private String goalTitle;
    private Integer minimumRecommendedDays;
    private Integer minimumRecommendedMinutes;
    private String reason;

    public GoalRecommendationResponse() {
    }

    public GoalRecommendationResponse(
            Long recommendationId,
            String goalTitle,
            Integer minimumRecommendedDays,
            Integer minimumRecommendedMinutes,
            String reason
    ) {
        this.recommendationId = recommendationId;
        this.goalTitle = goalTitle;
        this.minimumRecommendedDays = minimumRecommendedDays;
        this.minimumRecommendedMinutes = minimumRecommendedMinutes;
        this.reason = reason;
    }

    public Long getRecommendationId() {
        return recommendationId;
    }

    public String getGoalTitle() {
        return goalTitle;
    }

    public Integer getMinimumRecommendedDays() {
        return minimumRecommendedDays;
    }

    public Integer getMinimumRecommendedMinutes() {
        return minimumRecommendedMinutes;
    }

    public String getReason() {
        return reason;
    }
}