package com.example.AIPlanner.DTOs.Responses.Tasks;

import com.example.AIPlanner.DTOs.Responses.Categories.CategorySummaryResponse;
import com.example.AIPlanner.Enums.TaskPriority;
import com.example.AIPlanner.Enums.TaskStatus;

import java.time.LocalDateTime;

public class TaskResponse
{

    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private boolean important;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private TaskPriority priority;
    private TaskStatus status;
    private Integer estimatedMinutes;
    private CategorySummaryResponse category;

    public TaskResponse(
            Long id,
            String title,
            String description,
            boolean completed,
            boolean important,
            LocalDateTime createdAt,
            LocalDateTime dueDate,
            TaskPriority priority,
            TaskStatus status,
            Integer estimatedMinutes,
            CategorySummaryResponse category
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.important = important;
        this.createdAt = createdAt;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.estimatedMinutes = estimatedMinutes;
        this.category = category;
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

    public boolean isCompleted() {
        return completed;
    }

    public boolean isImportant() {
        return important;
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

    public CategorySummaryResponse getCategory()
    {
        return category;
    }

    public void setCategory(CategorySummaryResponse category)
    {
        this.category = category;
    }
}
