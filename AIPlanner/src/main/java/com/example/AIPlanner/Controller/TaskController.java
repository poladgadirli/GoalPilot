package com.example.AIPlanner.Controller;

import com.example.AIPlanner.Abstracts.Services.TaskService;
import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.TaskFilterRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ApiResponse<Page<TaskResponse>> getAll(
            @ParameterObject @ModelAttribute TaskFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TaskResponse> tasks = taskService.getAll(filter, pageable);

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

    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<TaskResponse>> getByCategory(@PathVariable Long categoryId) {
        List<TaskResponse> tasks = taskService.getByCategory(categoryId);

        return ApiResponse.success("Tasks fetched by category successfully", tasks);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        taskService.delete(id);

        return ApiResponse.success("Task deleted successfully", null);
    }
}