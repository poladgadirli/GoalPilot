package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.GoalRecommendationService;
import com.example.AIPlanner.DTOs.Requests.Goals.GoalRecommendationRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalRecommendationResponse;
import com.example.AIPlanner.Entities.GoalRecommendation;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Repositories.GoalRecommendationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GoalRecommendationServiceImpl implements GoalRecommendationService {

    private final GoalRecommendationRepository goalRecommendationRepository;
    private final CurrentUserService currentUserService;

    public GoalRecommendationServiceImpl(
            GoalRecommendationRepository goalRecommendationRepository,
            CurrentUserService currentUserService
    ) {
        this.goalRecommendationRepository = goalRecommendationRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    @Transactional
    public GoalRecommendationResponse generateRecommendation(GoalRecommendationRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        String title = request.getTitle().trim();
        String description = request.getDescription() == null
                ? ""
                : request.getDescription().trim();

        int complexityScore = calculateComplexityScore(title, description);

        int minimumRecommendedDays = calculateMinimumDays(complexityScore);
        int minimumRecommendedMinutes = minimumRecommendedDays * 120;

        String reason = buildReason(title, minimumRecommendedDays);

        GoalRecommendation recommendation = new GoalRecommendation(
                title,
                description,
                minimumRecommendedDays,
                minimumRecommendedMinutes,
                reason,
                currentUser
        );

        GoalRecommendation savedRecommendation =
                goalRecommendationRepository.save(recommendation);

        return new GoalRecommendationResponse(
                savedRecommendation.getId(),
                savedRecommendation.getGoalTitle(),
                savedRecommendation.getMinimumRecommendedDays(),
                savedRecommendation.getMinimumRecommendedMinutes(),
                savedRecommendation.getReason()
        );
    }

    private int calculateComplexityScore(String title, String description) {
        String text = (title + " " + description).toLowerCase();

        int score = 1;

        if (text.contains("spring") || text.contains("backend") || text.contains("database")) {
            score += 2;
        }

        if (text.contains("security") || text.contains("jwt") || text.contains("authentication")) {
            score += 2;
        }

        if (text.contains("ai") || text.contains("machine learning") || text.contains("integration")) {
            score += 2;
        }

        if (text.contains("project") || text.contains("portfolio") || text.contains("real world")) {
            score += 1;
        }

        if (description.length() > 300) {
            score += 1;
        }

        return score;
    }

    private int calculateMinimumDays(int complexityScore) {
        if (complexityScore <= 2) {
            return 7;
        }

        if (complexityScore <= 4) {
            return 14;
        }

        if (complexityScore <= 6) {
            return 21;
        }

        return 30;
    }

    private String buildReason(String title, int minimumRecommendedDays) {
        return "The goal '" + title + "' requires at least "
                + minimumRecommendedDays
                + " days because it includes learning, practice, repetition and project-based implementation.";
    }
}