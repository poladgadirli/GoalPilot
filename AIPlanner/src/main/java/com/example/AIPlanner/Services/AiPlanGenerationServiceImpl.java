package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Clients.AiPlanClient;
import com.example.AIPlanner.Abstracts.Services.AiPlanGenerationService;
import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanDayResponse;
import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanResponse;
import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanTaskResponse;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;
import com.example.AIPlanner.Entities.Goal;
import com.example.AIPlanner.Entities.Plan;
import com.example.AIPlanner.Entities.PlanDay;
import com.example.AIPlanner.Entities.PlanTask;
import com.example.AIPlanner.Enums.PlanGenerationType;
import com.example.AIPlanner.Mappers.PlanMapper;
import com.example.AIPlanner.Repositories.GoalRepository;
import com.example.AIPlanner.Repositories.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiPlanGenerationServiceImpl implements AiPlanGenerationService {

    private final GoalRepository goalRepository;
    private final PlanRepository planRepository;
    private final CurrentUserService currentUserService;
    private final AiPlanClient aiPlanClient;
    private final PlanMapper planMapper;

    public AiPlanGenerationServiceImpl(
            GoalRepository goalRepository,
            PlanRepository planRepository,
            CurrentUserService currentUserService,
            AiPlanClient aiPlanClient,
            PlanMapper planMapper
    ) {
        this.goalRepository = goalRepository;
        this.planRepository = planRepository;
        this.currentUserService = currentUserService;
        this.aiPlanClient = aiPlanClient;
        this.planMapper = planMapper;
    }

    @Override
    @Transactional
    public PlanResponse generateAiPlan(Long goalId) {
        Long userId = currentUserService.getCurrentUserId();

        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        if (planRepository.existsByGoalIdAndUserId(goalId, userId)) {
            throw new IllegalArgumentException("Plan already exists for this goal");
        }

        AiGeneratedPlanResponse aiPlan = aiPlanClient.generatePlan(goal);

        validateAiPlan(aiPlan, goal);

        Plan plan = mapAiPlanToEntity(aiPlan, goal);

        Plan savedPlan = planRepository.save(plan);

        return planMapper.toResponse(savedPlan);
    }

    private Plan mapAiPlanToEntity(AiGeneratedPlanResponse aiPlan, Goal goal) {
        Plan plan = new Plan(
                aiPlan.getTitle(),
                aiPlan.getDescription(),
                goal.getStartDate(),
                goal.getEndDate(),
                goal.getDurationDays(),
                PlanGenerationType.AI,
                goal,
                goal.getUser()
        );

        for (AiGeneratedPlanDayResponse aiDay : aiPlan.getDays()) {
            PlanDay planDay = new PlanDay(
                    aiDay.getDayNumber(),
                    aiDay.getDate(),
                    aiDay.getTitle(),
                    aiDay.getDescription(),
                    aiDay.getRestDay(),
                    plan
            );

            if (aiDay.getTasks() != null) {
                for (AiGeneratedPlanTaskResponse aiTask : aiDay.getTasks()) {
                    PlanTask planTask = new PlanTask(
                            aiTask.getTitle(),
                            aiTask.getDescription(),
                            aiTask.getEstimatedMinutes(),
                            aiTask.getOrderIndex(),
                            false,
                            planDay
                    );

                    planDay.addTask(planTask);
                }
            }

            plan.addDay(planDay);
        }

        return plan;
    }

    private void validateAiPlan(AiGeneratedPlanResponse aiPlan, Goal goal) {
        if (aiPlan == null) {
            throw new IllegalArgumentException("AI plan response is empty");
        }

        if (aiPlan.getTitle() == null || aiPlan.getTitle().trim().isBlank()) {
            throw new IllegalArgumentException("AI plan title is required");
        }

        if (aiPlan.getDays() == null || aiPlan.getDays().isEmpty()) {
            throw new IllegalArgumentException("AI plan days are required");
        }

        if (aiPlan.getDays().size() != goal.getDurationDays()) {
            throw new IllegalArgumentException("AI plan day count must match goal duration days");
        }

        for (AiGeneratedPlanDayResponse day : aiPlan.getDays()) {
            if (day.getDayNumber() == null || day.getDayNumber() < 1) {
                throw new IllegalArgumentException("AI plan day number is invalid");
            }

            if (day.getDate() == null) {
                throw new IllegalArgumentException("AI plan day date is required");
            }

            if (day.getTitle() == null || day.getTitle().trim().isBlank()) {
                throw new IllegalArgumentException("AI plan day title is required");
            }

            if (Boolean.FALSE.equals(day.getRestDay())
                    && (day.getTasks() == null || day.getTasks().isEmpty())) {
                throw new IllegalArgumentException("Non-rest AI plan day must contain tasks");
            }
        }
    }
}