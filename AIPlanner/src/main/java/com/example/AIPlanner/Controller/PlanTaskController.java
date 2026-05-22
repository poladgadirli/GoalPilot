package com.example.AIPlanner.Controller;

import com.example.AIPlanner.Abstracts.Services.PlanTaskService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanTaskResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plan-tasks")
public class PlanTaskController {

    private final PlanTaskService planTaskService;

    public PlanTaskController(PlanTaskService planTaskService) {
        this.planTaskService = planTaskService;
    }

    @PatchMapping("/{taskId}/complete")
    public ApiResponse<PlanTaskResponse> completeTask(@PathVariable Long taskId) {
        PlanTaskResponse task = planTaskService.completeTask(taskId);

        return ApiResponse.success("Plan task completed successfully", task);
    }

    @PatchMapping("/{taskId}/uncomplete")
    public ApiResponse<PlanTaskResponse> uncompleteTask(@PathVariable Long taskId) {
        PlanTaskResponse task = planTaskService.uncompleteTask(taskId);

        return ApiResponse.success("Plan task marked as incomplete successfully", task);
    }
}