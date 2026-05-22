package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Goals.CreateGoalRequest;
import com.example.AIPlanner.DTOs.Requests.Goals.UpdateGoalRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalResponse;

import java.util.List;

public interface GoalService {

    List<GoalResponse> getAllGoals();

    GoalResponse getGoalById(Long id);

    GoalResponse createGoal(CreateGoalRequest request);

    GoalResponse updateGoal(Long id, UpdateGoalRequest request);

    void deleteGoal(Long id);
}