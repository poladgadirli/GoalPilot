package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.ManualPlanGenerationService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;
import com.example.AIPlanner.Entities.Goal;
import com.example.AIPlanner.Entities.Plan;
import com.example.AIPlanner.Entities.PlanDay;
import com.example.AIPlanner.Entities.PlanTask;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Enums.PlanGenerationType;
import com.example.AIPlanner.Mappers.PlanMapper;
import com.example.AIPlanner.Repositories.GoalRepository;
import com.example.AIPlanner.Repositories.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class ManualPlanGenerationServiceImpl implements ManualPlanGenerationService {

    private final GoalRepository goalRepository;
    private final PlanRepository planRepository;
    private final CurrentUserService currentUserService;
    private final PlanMapper planMapper;

    public ManualPlanGenerationServiceImpl(
            GoalRepository goalRepository,
            PlanRepository planRepository,
            CurrentUserService currentUserService,
            PlanMapper planMapper
    ) {
        this.goalRepository = goalRepository;
        this.planRepository = planRepository;
        this.currentUserService = currentUserService;
        this.planMapper = planMapper;
    }

    @Override
    @Transactional
    public PlanResponse generateManualPlan(Long goalId) {
        User currentUser = currentUserService.getCurrentUser();
        Long userId = currentUser.getId();

        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        if (planRepository.existsByGoalIdAndUserId(goalId, userId)) {
            throw new IllegalArgumentException("Plan already exists for this goal");
        }

        Plan plan = createPlan(goal, currentUser);

        generatePlanDaysAndTasks(plan, goal);

        Plan savedPlan = planRepository.save(plan);

        return planMapper.toResponse(savedPlan);
    }

    private Plan createPlan(Goal goal, User user) {
        LocalDate startDate = goal.getStartDate();
        LocalDate endDate = goal.getEndDate();

        String title = goal.getTitle() + " Plan";

        String description = "Manual plan generated for goal: " + goal.getTitle();

        return new Plan(
                title,
                description,
                startDate,
                endDate,
                goal.getDurationDays(),
                PlanGenerationType.MANUAL,
                goal,
                user
        );
    }

    private void generatePlanDaysAndTasks(Plan plan, Goal goal) {
        LocalDate startDate = goal.getStartDate();
        int durationDays = goal.getDurationDays();
        int dailyAvailableMinutes = goal.getDailyAvailableMinutes();

        for (int i = 1; i <= durationDays; i++) {
            LocalDate date = startDate.plusDays(i - 1L);

            PlanDay planDay = new PlanDay(
                    i,
                    date,
                    "Day " + i,
                    "Manual plan day " + i + " for " + goal.getTitle(),
                    false,
                    plan
            );

            addDefaultTasks(planDay, goal, dailyAvailableMinutes);

            plan.addDay(planDay);
        }
    }

    private void addDefaultTasks(PlanDay planDay, Goal goal, int dailyAvailableMinutes) {
        int firstTaskMinutes = Math.max(15, dailyAvailableMinutes / 2);
        int secondTaskMinutes = Math.max(15, dailyAvailableMinutes - firstTaskMinutes);

        PlanTask studyTask = new PlanTask(
                "Study: " + goal.getTitle(),
                "Focus on the main learning material for this goal.",
                firstTaskMinutes,
                1,
                false,
                planDay
        );

        PlanTask practiceTask = new PlanTask(
                "Practice: " + goal.getTitle(),
                "Apply what you learned with exercises or project work.",
                secondTaskMinutes,
                2,
                false,
                planDay
        );

        planDay.addTask(studyTask);
        planDay.addTask(practiceTask);
    }
}