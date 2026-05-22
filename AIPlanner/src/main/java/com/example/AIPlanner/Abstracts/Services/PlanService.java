package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;

public interface PlanService {

    PlanResponse getPlanByGoalId(Long goalId);

    PlanResponse getPlanById(Long planId);
}