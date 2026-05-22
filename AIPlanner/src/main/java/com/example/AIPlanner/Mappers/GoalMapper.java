package com.example.AIPlanner.Mappers;

import com.example.AIPlanner.DTOs.Requests.Goals.CreateGoalRequest;
import com.example.AIPlanner.DTOs.Requests.Goals.UpdateGoalRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalResponse;
import com.example.AIPlanner.Entities.Goal;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Enums.GoalStatus;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    public Goal toEntity(CreateGoalRequest request, User user) {
        Goal goal = new Goal();

        goal.setTitle(request.getTitle().trim());

        if (request.getDescription() != null) {
            goal.setDescription(request.getDescription().trim());
        }

        goal.setStartDate(request.getStartDate());
        goal.setDurationDays(request.getDurationDays());
        goal.setDailyAvailableMinutes(request.getDailyAvailableMinutes());
        goal.setMinimumRecommendedDays(request.getMinimumRecommendedDays());
        goal.setMinimumRecommendedMinutes(request.getMinimumRecommendedMinutes());
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

        if (request.getMinimumRecommendedDays() != null) {
            goal.setMinimumRecommendedDays(request.getMinimumRecommendedDays());
        }

        if (request.getMinimumRecommendedMinutes() != null) {
            goal.setMinimumRecommendedMinutes(request.getMinimumRecommendedMinutes());
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