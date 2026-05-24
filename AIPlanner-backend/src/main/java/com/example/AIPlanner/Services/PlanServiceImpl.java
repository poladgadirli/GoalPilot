package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.PlanService;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;
import com.example.AIPlanner.Entities.Plan;
import com.example.AIPlanner.Mappers.PlanMapper;
import com.example.AIPlanner.Repositories.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;
    private final PlanMapper planMapper;
    private final CurrentUserService currentUserService;

    public PlanServiceImpl(
            PlanRepository planRepository,
            PlanMapper planMapper,
            CurrentUserService currentUserService
    ) {
        this.planRepository = planRepository;
        this.planMapper = planMapper;
        this.currentUserService = currentUserService;
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponse getPlanByGoalId(Long goalId) {
        Long userId = currentUserService.getCurrentUserId();

        Plan plan = planRepository.findByGoalIdAndUserId(goalId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found for this goal"));

        return planMapper.toResponse(plan);
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponse getPlanById(Long planId) {
        Long userId = currentUserService.getCurrentUserId();

        Plan plan = planRepository.findByIdAndUserId(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));

        return planMapper.toResponse(plan);
    }
}