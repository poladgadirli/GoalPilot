package com.example.AIPlanner.DTOs.Responses.Plans;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PlanDayResponse {

    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String description;
    private Boolean restDay;
    private List<PlanTaskResponse> tasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PlanDayResponse() {
    }

    public PlanDayResponse(
            Long id,
            Integer dayNumber,
            LocalDate date,
            String title,
            String description,
            Boolean restDay,
            List<PlanTaskResponse> tasks,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.dayNumber = dayNumber;
        this.date = date;
        this.title = title;
        this.description = description;
        this.restDay = restDay;
        this.tasks = tasks;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
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

    public List<PlanTaskResponse> getTasks() {
        return tasks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}