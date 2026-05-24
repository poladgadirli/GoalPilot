package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.TaskFilterRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {

    Page<TaskResponse> getAll(TaskFilterRequest filter, Pageable pageable);

    TaskResponse getById(Long id);

    TaskResponse create(CreateTaskRequest request);

    List<TaskResponse> getByCategory(Long categoryId);

    TaskResponse update(Long id, UpdateTaskRequest request);

    TaskResponse updateImportant(Long id, boolean important);

    void delete(Long id);
}
