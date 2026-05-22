package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.PlanProgressService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanProgressResponse;
import com.example.AIPlanner.Entities.Plan;
import com.example.AIPlanner.Repositories.PlanDayRepository;
import com.example.AIPlanner.Repositories.PlanRepository;
import com.example.AIPlanner.Repositories.PlanTaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanProgressServiceImpl implements PlanProgressService {

    private final PlanRepository planRepository;
    private final PlanDayRepository planDayRepository;
    private final PlanTaskRepository planTaskRepository;
    private final CurrentUserService currentUserService;

    public PlanProgressServiceImpl(
            PlanRepository planRepository,
            PlanDayRepository planDayRepository,
            PlanTaskRepository planTaskRepository,
            CurrentUserService currentUserService
    ) {
        this.planRepository = planRepository;
        this.planDayRepository = planDayRepository;
        this.planTaskRepository = planTaskRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    @Transactional(readOnly = true)
    public PlanProgressResponse getPlanProgress(Long planId) {
        Long userId = currentUserService.getCurrentUserId();

        Plan plan = planRepository.findByIdAndUserId(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));

        int totalDays = (int) planDayRepository.countByPlanId(plan.getId());
        int totalTasks = (int) planTaskRepository.countByPlanDayPlanId(plan.getId());
        int completedTasks = (int) planTaskRepository.countByPlanDayPlanIdAndCompleted(plan.getId(), true);

        int completedDays = calculateCompletedDays(plan);

        double progressPercentage = calculateProgressPercentage(totalTasks, completedTasks);

        return new PlanProgressResponse(
                plan.getId(),
                totalDays,
                completedDays,
                totalTasks,
                completedTasks,
                progressPercentage
        );
    }

    private int calculateCompletedDays(Plan plan) {
        if (plan.getDays() == null || plan.getDays().isEmpty()) {
            return 0;
        }

        return (int) plan.getDays()
                .stream()
                .filter(day -> day.getTasks() != null && !day.getTasks().isEmpty())
                .filter(day -> day.getTasks()
                        .stream()
                        .allMatch(task -> Boolean.TRUE.equals(task.getCompleted())))
                .count();
    }

    private double calculateProgressPercentage(int totalTasks, int completedTasks) {
        if (totalTasks == 0) {
            return 0.0;
        }

        double percentage = ((double) completedTasks / totalTasks) * 100;

        return Math.round(percentage * 100.0) / 100.0;
    }
}