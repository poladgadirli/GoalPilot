package com.example.AIPlanner.DTOs.Requests.Tasks;

import com.example.AIPlanner.Enums.TaskPriority;
import com.example.AIPlanner.Enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class UpdateTaskRequest {

    @NotBlank(message = "Title boş ola bilməz")
    @Size(max = 150, message = "Title maksimum 150 simvol ola bilər")
    private String title;

    @Size(max = 1000, message = "Description maksimum 1000 simvol ola bilər")
    private String description;

    private LocalDateTime dueDate;

    private TaskPriority priority;

    private TaskStatus status;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
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
}