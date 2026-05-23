package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;

public interface AiPlanGenerationService {

    PlanResponse generateAiPlan(Long goalId);
}