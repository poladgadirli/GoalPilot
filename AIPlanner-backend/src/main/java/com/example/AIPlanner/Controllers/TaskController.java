package com.example.AIPlanner.Controllers;

import com.example.AIPlanner.Abstracts.Services.TaskService;
import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.TaskFilterRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/tasks")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id",
            "title",
            "createdAt",
            "dueDate",
            "priority",
            "status",
            "completed",
            "estimatedMinutes"
    );

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
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy)
                ? sortBy
                : "createdAt";

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Sort sort = Sort.by(sortDirection, safeSortBy);

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