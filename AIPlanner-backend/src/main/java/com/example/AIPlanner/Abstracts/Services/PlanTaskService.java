package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Responses.Plans.PlanTaskResponse;

public interface PlanTaskService {

    PlanTaskResponse completeTask(Long taskId);

    PlanTaskResponse uncompleteTask(Long taskId);

    PlanTaskResponse updateCompletion(Long taskId, Boolean completed);
}
