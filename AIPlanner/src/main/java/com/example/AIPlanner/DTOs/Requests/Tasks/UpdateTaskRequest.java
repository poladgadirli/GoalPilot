package com.example.AIPlanner.DTOs.Requests.Tasks;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateTaskRequest
{

    @NotBlank(message = "Title boş ola bilməz")
    @Size(max = 150, message = "Title maksimum 150 simvol ola bilər")
    private String title;

    @Size(max = 1000, message = "Description maksimum 1000 simvol ola bilər")
    private String description;

    private boolean completed;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}