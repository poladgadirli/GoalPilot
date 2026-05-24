package com.example.AIPlanner.DTOs.Responses.AI;

import java.time.LocalDate;
import java.util.List;

public class AiGeneratedPlanDayResponse {

    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String description;
    private Boolean restDay;
    private List<AiGeneratedPlanTaskResponse> tasks;

    public AiGeneratedPlanDayResponse() {
    }

    public AiGeneratedPlanDayResponse(
            Integer dayNumber,
            LocalDate date,
            String title,
            String description,
            Boolean restDay,
            List<AiGeneratedPlanTaskResponse> tasks
    ) {
        this.dayNumber = dayNumber;
        this.date = date;
        this.title = title;
        this.description = description;
        this.restDay = restDay;
        this.tasks = tasks;
    }

    public Integer getDayNumber() {
        return dayNumber;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getRestDay() {
        return restDay;
    }

    public List<AiGeneratedPlanTaskResponse> getTasks() {
        return tasks;
    }
}