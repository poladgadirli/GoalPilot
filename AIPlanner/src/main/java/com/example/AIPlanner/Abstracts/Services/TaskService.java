package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.TaskFilterRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Enums.TaskPriority;
import com.example.AIPlanner.Enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {

    Page<TaskResponse> getAll(TaskFilterRequest filter, Pageable pageable);

    Page<TaskResponse> getFilteredTasks(
            TaskStatus status,
            TaskPriority priority,
            Boolean completed,
            String keyword,
            Pageable pageable
    );

    TaskResponse getById(Long id);

    TaskResponse create(CreateTaskRequest request);

    List<TaskResponse> getByCategory(Long categoryId);

    TaskResponse update(Long id, UpdateTaskRequest request);

    void delete(Long id);

}