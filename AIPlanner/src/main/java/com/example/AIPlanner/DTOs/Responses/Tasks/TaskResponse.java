package com.example.AIPlanner.DTOs.Responses.Tasks;

import com.example.AIPlanner.Enums.TaskPriority;
import com.example.AIPlanner.Enums.TaskStatus;

import java.time.LocalDateTime;

public class TaskResponse
{

    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private TaskPriority priority;
    private TaskStatus status;
    private Integer estimatedMinutes;

    public TaskResponse(
            Long id,
            String title,
            String description,
            boolean completed,
            LocalDateTime createdAt,
            LocalDateTime dueDate,
            TaskPriority priority,
            TaskStatus status,
            Integer estimatedMinutes
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.estimatedMinutes = estimatedMinutes;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }
}
