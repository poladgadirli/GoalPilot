package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.GoalService;
import com.example.AIPlanner.DTOs.Requests.Goals.CreateGoalRequest;
import com.example.AIPlanner.DTOs.Requests.Goals.UpdateGoalRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalResponse;
import com.example.AIPlanner.Entities.Goal;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Mappers.GoalMapper;
import com.example.AIPlanner.Repositories.GoalRepository;
import org.springframework.stereotype.Service;
import com.example.AIPlanner.Entities.GoalRecommendation;
import com.example.AIPlanner.Repositories.GoalRecommendationRepository;
import java.util.List;

@Service
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final GoalMapper goalMapper;
    private final CurrentUserService currentUserService;
    private final GoalRecommendationRepository goalRecommendationRepository;

    public GoalServiceImpl(
            GoalRepository goalRepository,
            GoalMapper goalMapper,
            CurrentUserService currentUserService, GoalRecommendationRepository goalRecommendationRepository
    ) {
        this.goalRepository = goalRepository;
        this.goalMapper = goalMapper;
        this.currentUserService = currentUserService;
        this.goalRecommendationRepository = goalRecommendationRepository;
    }

    @Override
    public List<GoalResponse> getAllGoals() {
        Long userId = currentUserService.getCurrentUserId();

        return goalRepository.findAllByUserId(userId)
                .stream()
                .map(goalMapper::toResponse)
                .toList();
    }

    @Override
    public GoalResponse getGoalById(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        Goal goal = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        return goalMapper.toResponse(goal);
    }

    @Override
    public GoalResponse createGoal(CreateGoalRequest request) {
        User currentUser = currentUserService.getCurrentUser();
        Long userId = currentUser.getId();

        GoalRecommendation recommendation = goalRecommendationRepository
                .findByIdAndUserId(request.getRecommendationId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Goal recommendation not found"));

        validateCreateRequest(request, recommendation, userId);

        Goal goal = goalMapper.toEntity(request, recommendation, currentUser);

        Goal savedGoal = goalRepository.save(goal);

        recommendation.setUsed(true);
        goalRecommendationRepository.save(recommendation);

        return goalMapper.toResponse(savedGoal);
    }

    @Override
    public GoalResponse updateGoal(Long id, UpdateGoalRequest request) {
        Long userId = currentUserService.getCurrentUserId();

        Goal goal = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        validateUpdateRequest(goal, request, userId);

        goalMapper.updateEntity(goal, request);

        Goal updatedGoal = goalRepository.save(goal);

        return goalMapper.toResponse(updatedGoal);
    }

    @Override
    public void deleteGoal(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        Goal goal = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        goalRepository.delete(goal);
    }

    private void validateCreateRequest(
            CreateGoalRequest request,
            GoalRecommendation recommendation,
            Long userId
    ) {
        if (Boolean.TRUE.equals(recommendation.getUsed())) {
            throw new IllegalArgumentException("Goal recommendation has already been used");
        }

        if (request.getDurationDays() < recommendation.getMinimumRecommendedDays()) {
            throw new IllegalArgumentException("Duration days cannot be less than minimum recommended days");
        }

        if (goalRepository.existsByTitleIgnoreCaseAndUserId(recommendation.getGoalTitle().trim(), userId)) {
            throw new IllegalArgumentException("Goal with this title already exists");
        }
    }

    private void validateUpdateRequest(Goal goal, UpdateGoalRequest request, Long userId) {
        if (request.getTitle() != null) {
            String trimmedTitle = request.getTitle().trim();

            if (trimmedTitle.isBlank()) {
                throw new IllegalArgumentException("Goal title must not be blank");
            }

            boolean titleChanged = !goal.getTitle().equalsIgnoreCase(trimmedTitle);

            if (titleChanged && goalRepository.existsByTitleIgnoreCaseAndUserId(trimmedTitle, userId)) {
                throw new IllegalArgumentException("Goal with this title already exists");
            }
        }

        Integer finalDurationDays = request.getDurationDays() != null
                ? request.getDurationDays()
                : goal.getDurationDays();

        Integer finalMinimumRecommendedDays = goal.getMinimumRecommendedDays();

        if (finalDurationDays < finalMinimumRecommendedDays) {
            throw new IllegalArgumentException("Duration days cannot be less than minimum recommended days");
        }
    }
}