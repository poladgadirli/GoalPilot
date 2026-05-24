package com.example.AIPlanner.Mappers;

import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Categories.CategorySummaryResponse;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Entities.Category;
import com.example.AIPlanner.Entities.Task;
import com.example.AIPlanner.Enums.TaskStatus;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(CreateTaskRequest request) {
        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        return task;
    }

    public void updateEntity(Task task, UpdateTaskRequest request) {
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            task.setCompleted(request.getStatus() == TaskStatus.DONE);
        }

        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());

            if (request.getStatus() == null) {
                task.setStatus(request.getCompleted() ? TaskStatus.DONE : TaskStatus.TODO);
            }
        }

        if (request.getImportant() != null) {
            task.setImportant(request.getImportant());
        }
    }

    public TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.isCompleted(),
                task.isImportant(),
                task.getCreatedAt(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus(),
                task.getEstimatedMinutes(),
                toCategorySummary(task.getCategory())
        );
    }

    private CategorySummaryResponse toCategorySummary(Category category) {
        if (category == null) {
            return null;
        }

        return new CategorySummaryResponse(
                category.getId(),
                category.getName(),
                category.getColor()
        );
    }
}
