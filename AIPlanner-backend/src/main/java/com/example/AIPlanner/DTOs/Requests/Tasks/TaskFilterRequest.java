package com.example.AIPlanner.DTOs.Requests.Tasks;

import com.example.AIPlanner.Enums.TaskPriority;
import com.example.AIPlanner.Enums.TaskStatus;

public class TaskFilterRequest {

    private Long categoryId;
    private TaskStatus status;
    private TaskPriority priority;
    private Boolean completed;
    private String keyword;

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
}