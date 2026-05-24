package com.example.AIPlanner.Mappers;

import com.example.AIPlanner.DTOs.Requests.Goals.CreateGoalRequest;
import com.example.AIPlanner.DTOs.Requests.Goals.UpdateGoalRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalResponse;
import com.example.AIPlanner.Entities.Goal;
import com.example.AIPlanner.Entities.GoalRecommendation;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Enums.GoalStatus;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    public Goal toEntity(CreateGoalRequest request, GoalRecommendation recommendation, User user) {
        Goal goal = new Goal();

        goal.setTitle(recommendation.getGoalTitle());

        if (recommendation.getGoalDescription() != null) {
            goal.setDescription(recommendation.getGoalDescription());
        }

        goal.setStartDate(request.getStartDate());
        goal.setDurationDays(request.getDurationDays());
        goal.setDailyAvailableMinutes(request.getDailyAvailableMinutes());
        goal.setMinimumRecommendedDays(recommendation.getMinimumRecommendedDays());
        goal.setMinimumRecommendedMinutes(recommendation.getMinimumRecommendedMinutes());
        goal.setStatus(GoalStatus.ACTIVE);
        goal.setUser(user);

        return goal;
    }

    public void updateEntity(Goal goal, UpdateGoalRequest request) {
        if (request.getTitle() != null) {
            String trimmedTitle = request.getTitle().trim();

            if (trimmedTitle.isBlank()) {
                throw new IllegalArgumentException("Goal title must not be blank");
            }

            goal.setTitle(trimmedTitle);
        }

        if (request.getDescription() != null) {
            goal.setDescription(request.getDescription().trim());
        }

        if (request.getStartDate() != null) {
            goal.setStartDate(request.getStartDate());
        }

        if (request.getDurationDays() != null) {
            goal.setDurationDays(request.getDurationDays());
        }

        if (request.getDailyAvailableMinutes() != null) {
            goal.setDailyAvailableMinutes(request.getDailyAvailableMinutes());
        }

        if (request.getStatus() != null) {
            goal.setStatus(request.getStatus());
        }
    }

    public GoalResponse toResponse(Goal goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getStartDate(),
                goal.getDurationDays(),
                goal.getEndDate(),
                goal.getDailyAvailableMinutes(),
                goal.getMinimumRecommendedDays(),
                goal.getMinimumRecommendedMinutes(),
                goal.getStatus(),
                goal.getCreatedAt(),
                goal.getUpdatedAt()
        );
    }
}