package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.PlanTaskService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanTaskResponse;
import com.example.AIPlanner.Entities.PlanTask;
import com.example.AIPlanner.Mappers.PlanMapper;
import com.example.AIPlanner.Repositories.PlanTaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.AIPlanner.Enums.GoalStatus;
import com.example.AIPlanner.Repositories.GoalRepository;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PlanTaskServiceImpl implements PlanTaskService {

    private final PlanTaskRepository planTaskRepository;
    private final CurrentUserService currentUserService;
    private final PlanMapper planMapper;
    private final GoalRepository goalRepository;

    public PlanTaskServiceImpl(
            PlanTaskRepository planTaskRepository,
            CurrentUserService currentUserService,
            PlanMapper planMapper, GoalRepository goalRepository
    ) {
        this.planTaskRepository = planTaskRepository;
        this.currentUserService = currentUserService;
        this.planMapper = planMapper;
        this.goalRepository = goalRepository;
    }

    @Override
    @Transactional
    public PlanTaskResponse completeTask(Long taskId) {
        return updateCompletion(taskId, true);
    }

    @Override
    @Transactional
    public PlanTaskResponse uncompleteTask(Long taskId) {
        return updateCompletion(taskId, false);
    }

    @Override
    @Transactional
    public PlanTaskResponse updateCompletion(Long taskId, Boolean completed) {
        Long userId = currentUserService.getCurrentUserId();

        PlanTask task = planTaskRepository.findByIdAndPlanDayPlanUserId(taskId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan task not found"));

        task.setCompleted(Boolean.TRUE.equals(completed));

        PlanTask updatedTask = planTaskRepository.save(task);

        updateGoalStatusByTask(updatedTask);

        return planMapper.toTaskResponse(updatedTask);
    }

    private void updateGoalStatusByTask(PlanTask task) {
        var plan = task.getPlanDay().getPlan();
        var goal = plan.getGoal();

        long totalTasks = planTaskRepository.countByPlanDayPlanId(plan.getId());

        if (totalTasks == 0) {
            return;
        }

        long completedTasks = planTaskRepository.countByPlanDayPlanIdAndCompleted(plan.getId(), true);

        if (totalTasks == completedTasks) {
            goal.setStatus(GoalStatus.COMPLETED);
        } else if (goal.getStatus() == GoalStatus.COMPLETED) {
            goal.setStatus(GoalStatus.ACTIVE);
        }

        goalRepository.save(goal);
    }
}
