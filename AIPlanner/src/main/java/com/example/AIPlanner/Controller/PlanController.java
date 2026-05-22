package com.example.AIPlanner.Controller;

import com.example.AIPlanner.Abstracts.Services.ManualPlanGenerationService;
import com.example.AIPlanner.Abstracts.Services.PlanService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import org.springframework.web.bind.annotation.*;
import com.example.AIPlanner.Abstracts.Services.PlanProgressService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanProgressResponse;

@RestController
public class PlanController {

    private final ManualPlanGenerationService manualPlanGenerationService;
    private final PlanService planService;
    private final PlanProgressService planProgressService;

    public PlanController(
            ManualPlanGenerationService manualPlanGenerationService,
            PlanService planService,
            PlanProgressService planProgressService
    ) {
        this.manualPlanGenerationService = manualPlanGenerationService;
        this.planService = planService;
        this.planProgressService = planProgressService;
    }

    @PostMapping("/api/goals/{goalId}/plans/generate-manual")
    public ApiResponse<PlanResponse> generateManualPlan(@PathVariable Long goalId) {
        PlanResponse plan = manualPlanGenerationService.generateManualPlan(goalId);

        return ApiResponse.success("Manual plan generated successfully", plan);
    }

    @GetMapping("/api/goals/{goalId}/plans")
    public ApiResponse<PlanResponse> getPlanByGoalId(@PathVariable Long goalId) {
        PlanResponse plan = planService.getPlanByGoalId(goalId);

        return ApiResponse.success("Plan fetched successfully", plan);
    }

    @GetMapping("/api/plans/{planId}")
    public ApiResponse<PlanResponse> getPlanById(@PathVariable Long planId) {
        PlanResponse plan = planService.getPlanById(planId);

        return ApiResponse.success("Plan fetched successfully", plan);
    }

    @GetMapping("/api/plans/{planId}/progress")
    public ApiResponse<PlanProgressResponse> getPlanProgress(@PathVariable Long planId) {
        PlanProgressResponse progress = planProgressService.getPlanProgress(planId);

        return ApiResponse.success("Plan progress fetched successfully", progress);
    }
}