package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;

import java.util.List;

public interface TaskService {

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(Long id);

    TaskResponse createTask(CreateTaskRequest request);

    TaskResponse updateTask(Long id, UpdateTaskRequest request);

    void deleteTask(Long id);
}