package com.example.AIPlanner.DTOs.Responses.AI;

import java.util.List;

public class AiGeneratedPlanResponse {

    private String title;
    private String description;
    private List<AiGeneratedPlanDayResponse> days;

    public AiGeneratedPlanResponse() {
    }

    public AiGeneratedPlanResponse(
            String title,
            String description,
            List<AiGeneratedPlanDayResponse> days
    ) {
        this.title = title;
        this.description = description;
        this.days = days;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public List<AiGeneratedPlanDayResponse> getDays() {
        return days;
    }
}