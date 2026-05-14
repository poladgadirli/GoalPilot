package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Enums.TaskPriority;
import com.example.AIPlanner.Enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {

    Page<TaskResponse> getAll(Pageable pageable);

    Page<TaskResponse> getFilteredTasks(
            TaskStatus status,
            TaskPriority priority,
            Boolean completed,
            Pageable pageable
    );

    TaskResponse getById(Long id);

    TaskResponse create(CreateTaskRequest request);

    TaskResponse update(Long id, UpdateTaskRequest request);

    void delete(Long id);

}