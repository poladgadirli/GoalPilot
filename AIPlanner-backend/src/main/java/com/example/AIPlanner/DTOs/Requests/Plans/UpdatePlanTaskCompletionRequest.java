package com.example.AIPlanner.DTOs.Requests.Plans;

import jakarta.validation.constraints.NotNull;

public class UpdatePlanTaskCompletionRequest {

    @NotNull(message = "Completed is required")
    private Boolean completed;

    public UpdatePlanTaskCompletionRequest() {
    }

    public Boolean getCompleted() {
        return completed;
    }
}
