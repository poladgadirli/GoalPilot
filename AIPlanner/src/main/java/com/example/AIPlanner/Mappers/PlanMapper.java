package com.example.AIPlanner.Mappers;

import com.example.AIPlanner.DTOs.Responses.Plans.PlanDayResponse;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanResponse;
import com.example.AIPlanner.DTOs.Responses.Plans.PlanTaskResponse;
import com.example.AIPlanner.Entities.Plan;
import com.example.AIPlanner.Entities.PlanDay;
import com.example.AIPlanner.Entities.PlanTask;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class PlanMapper {

    public PlanResponse toResponse(Plan plan) {
        List<PlanDayResponse> dayResponses = plan.getDays() == null
                ? List.of()
                : plan.getDays()
                .stream()
                .sorted(Comparator.comparing(PlanDay::getDayNumber))
                .map(this::toDayResponse)
                .toList();

        return new PlanResponse(
                plan.getId(),
                plan.getGoal().getId(),
                plan.getTitle(),
                plan.getDescription(),
                plan.getStartDate(),
                plan.getEndDate(),
                plan.getTotalDays(),
                plan.getGenerationType(),
                plan.getStatus(),
                dayResponses,
                plan.getCreatedAt(),
                plan.getUpdatedAt()
        );
    }

    private PlanDayResponse toDayResponse(PlanDay planDay) {
        List<PlanTaskResponse> taskResponses = planDay.getTasks() == null
                ? List.of()
                : planDay.getTasks()
                .stream()
                .sorted(Comparator.comparing(PlanTask::getOrderIndex))
                .map(this::toTaskResponse)
                .toList();

        return new PlanDayResponse(
                planDay.getId(),
                planDay.getDayNumber(),
                planDay.getDate(),
                planDay.getTitle(),
                planDay.getDescription(),
                planDay.getRestDay(),
                taskResponses,
                planDay.getCreatedAt(),
                planDay.getUpdatedAt()
        );
    }

    private PlanTaskResponse toTaskResponse(PlanTask planTask) {
        return new PlanTaskResponse(
                planTask.getId(),
                planTask.getTitle(),
                planTask.getDescription(),
                planTask.getEstimatedMinutes(),
                planTask.getOrderIndex(),
                planTask.getCompleted(),
                planTask.getCreatedAt(),
                planTask.getUpdatedAt()
        );
    }
}