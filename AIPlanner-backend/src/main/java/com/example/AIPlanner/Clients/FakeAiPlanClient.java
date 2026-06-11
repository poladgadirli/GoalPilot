package com.example.AIPlanner.Clients;

import com.example.AIPlanner.Abstracts.Clients.AiPlanClient;
import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanDayResponse;
import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanResponse;
import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanTaskResponse;
import com.example.AIPlanner.DTOs.Requests.Goals.GoalRecommendationRequest;
import com.example.AIPlanner.DTOs.Responses.Goals.GoalRecommendationResponse;
import com.example.AIPlanner.Entities.Goal;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "fake", matchIfMissing = true)
public class FakeAiPlanClient implements AiPlanClient {

    @Override
    public GoalRecommendationResponse getGoalRecommendation(GoalRecommendationRequest request) {
        int minimumDays = 7;
        int minimumMinutes = minimumDays * request.getDailyAvailableMinutes();
        return new GoalRecommendationResponse(
                request.getTitle().trim(),
                minimumDays,
                minimumMinutes,
                "This gives enough time to learn, practice, and apply the goal consistently."
        );
    }

    @Override
    public AiGeneratedPlanResponse generatePlan(Goal goal) {
        List<AiGeneratedPlanDayResponse> days = new ArrayList<>();

        LocalDate startDate = goal.getStartDate();
        int durationDays = goal.getDurationDays();
        int dailyMinutes = goal.getDailyAvailableMinutes();

        for (int i = 1; i <= durationDays; i++) {
            LocalDate date = startDate.plusDays(i - 1L);

            List<AiGeneratedPlanTaskResponse> tasks = createTasksForDay(goal, i, dailyMinutes);

            AiGeneratedPlanDayResponse day = new AiGeneratedPlanDayResponse(
                    i,
                    date,
                    "AI Day " + i,
                    "AI-generated learning plan for day " + i,
                    false,
                    tasks
            );

            days.add(day);
        }

        return new AiGeneratedPlanResponse(
                "AI Plan for " + goal.getTitle(),
                "AI-generated plan based on the goal target, duration and daily available time.",
                days
        );
    }

    private List<AiGeneratedPlanTaskResponse> createTasksForDay(
            Goal goal,
            int dayNumber,
            int dailyMinutes
    ) {
        int firstTaskMinutes = Math.max(15, dailyMinutes / 3);
        int secondTaskMinutes = Math.max(15, dailyMinutes / 3);
        int thirdTaskMinutes = Math.max(15, dailyMinutes - firstTaskMinutes - secondTaskMinutes);

        List<AiGeneratedPlanTaskResponse> tasks = new ArrayList<>();

        tasks.add(new AiGeneratedPlanTaskResponse(
                "Learn core concept for " + goal.getTitle(),
                "Study the main concept planned for day " + dayNumber + ".",
                firstTaskMinutes,
                1
        ));

        tasks.add(new AiGeneratedPlanTaskResponse(
                "Practice with examples",
                "Apply the concept using small practical examples.",
                secondTaskMinutes,
                2
        ));

        tasks.add(new AiGeneratedPlanTaskResponse(
                "Build project part",
                "Use what you learned in a real project-related task.",
                thirdTaskMinutes,
                3
        ));

        return tasks;
    }
}
