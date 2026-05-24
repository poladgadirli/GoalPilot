package com.example.AIPlanner.Controllers;

import com.example.AIPlanner.Abstracts.Services.GoalService;
import com.example.AIPlanner.DTOs.Requests.Goals.CreateGoalRequest;
import com.example.AIPlanner.DTOs.Requests.Goals.UpdateGoalRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ApiResponse<List<GoalResponse>> getAllGoals() {
        List<GoalResponse> goals = goalService.getAllGoals();

        return ApiResponse.success("Goals fetched successfully", goals);
    }

    @GetMapping("/{id}")
    public ApiResponse<GoalResponse> getGoalById(@PathVariable Long id) {
        GoalResponse goal = goalService.getGoalById(id);

        return ApiResponse.success("Goal fetched successfully", goal);
    }

    @PostMapping
    public ApiResponse<GoalResponse> createGoal(@Valid @RequestBody CreateGoalRequest request) {
        GoalResponse goal = goalService.createGoal(request);

        return ApiResponse.success("Goal created successfully", goal);
    }

    @PutMapping("/{id}")
    public ApiResponse<GoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGoalRequest request
    ) {
        GoalResponse goal = goalService.updateGoal(id, request);

        return ApiResponse.success("Goal updated successfully", goal);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);

        return ApiResponse.success("Goal deleted successfully", null);
    }
}