package com.example.AIPlanner.Controller;

import com.example.AIPlanner.Abstracts.Services.ManualPlanGenerationService;
import com.example.AIPlanner.Abstracts.Services.PlanService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
public class PlanController {

    private final ManualPlanGenerationService manualPlanGenerationService;
    private final PlanService planService;

    public PlanController(
            ManualPlanGenerationService manualPlanGenerationService,
            PlanService planService
    ) {
        this.manualPlanGenerationService = manualPlanGenerationService;
        this.planService = planService;
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
}