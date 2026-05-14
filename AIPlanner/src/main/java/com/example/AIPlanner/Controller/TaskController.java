package com.example.AIPlanner.Controller;

import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Services.TaskServiceImpl;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskServiceImpl taskService;

    public TaskController(TaskServiceImpl taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ApiResponse<List<TaskResponse>> getAll() {
        List<TaskResponse> tasks = taskService.getAll();

        return ApiResponse.success("Tasks fetched successfully", tasks);
    }

    @GetMapping("/{id}")
    public ApiResponse<TaskResponse> getById(@PathVariable Long id) {
        TaskResponse task = taskService.getById(id);

        return ApiResponse.success("Task fetched successfully", task);
    }

    @PostMapping
    public ApiResponse<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse task = taskService.create(request);

        return ApiResponse.success("Task created successfully", task);
    }

    @PutMapping("/{id}")
    public ApiResponse<TaskResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        TaskResponse task = taskService.update(id, request);

        return ApiResponse.success("Task updated successfully", task);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        taskService.delete(id);

        return ApiResponse.success("Task deleted successfully", null);
    }
}