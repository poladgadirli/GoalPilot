package com.example.AIPlanner.Controller;

import com.example.AIPlanner.Abstracts.Services.ManualPlanGenerationService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals/{goalId}/plans")
public class PlanController {

    private final ManualPlanGenerationService manualPlanGenerationService;

    public PlanController(ManualPlanGenerationService manualPlanGenerationService) {
        this.manualPlanGenerationService = manualPlanGenerationService;
    }

    @PostMapping("/generate-manual")
    public ApiResponse<PlanResponse> generateManualPlan(@PathVariable Long goalId) {
        PlanResponse plan = manualPlanGenerationService.generateManualPlan(goalId);

        return ApiResponse.success("Manual plan generated successfully", plan);
    }
}