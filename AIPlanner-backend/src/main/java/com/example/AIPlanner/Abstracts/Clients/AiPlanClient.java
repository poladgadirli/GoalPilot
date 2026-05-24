package com.example.AIPlanner.Abstracts.Clients;

import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanResponse;
import com.example.AIPlanner.Entities.Goal;

public interface AiPlanClient {

    AiGeneratedPlanResponse generatePlan(Goal goal);
}