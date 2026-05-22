package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.PlanTaskService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanTaskResponse;
import com.example.AIPlanner.Entities.PlanTask;
import com.example.AIPlanner.Mappers.PlanMapper;
import com.example.AIPlanner.Repositories.PlanTaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanTaskServiceImpl implements PlanTaskService {

    private final PlanTaskRepository planTaskRepository;
    private final CurrentUserService currentUserService;
    private final PlanMapper planMapper;

    public PlanTaskServiceImpl(
            PlanTaskRepository planTaskRepository,
            CurrentUserService currentUserService,
            PlanMapper planMapper
    ) {
        this.planTaskRepository = planTaskRepository;
        this.currentUserService = currentUserService;
        this.planMapper = planMapper;
    }

    @Override
    @Transactional
    public PlanTaskResponse completeTask(Long taskId) {
        Long userId = currentUserService.getCurrentUserId();

        PlanTask task = planTaskRepository.findByIdAndPlanDayPlanUserId(taskId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Plan task not found"));

        task.setCompleted(true);

        PlanTask updatedTask = planTaskRepository.save(task);

        return planMapper.toTaskResponse(updatedTask);
    }

    @Override
    @Transactional
    public PlanTaskResponse uncompleteTask(Long taskId) {
        Long userId = currentUserService.getCurrentUserId();

        PlanTask task = planTaskRepository.findByIdAndPlanDayPlanUserId(taskId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Plan task not found"));

        task.setCompleted(false);

        PlanTask updatedTask = planTaskRepository.save(task);

        return planMapper.toTaskResponse(updatedTask);
    }
}