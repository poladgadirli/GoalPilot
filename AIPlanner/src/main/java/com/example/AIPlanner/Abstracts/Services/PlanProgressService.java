package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Responses.Plans.PlanProgressResponse;

public interface PlanProgressService {

    PlanProgressResponse getPlanProgress(Long planId);

    boolean isPlanCompleted(Long planId);
}