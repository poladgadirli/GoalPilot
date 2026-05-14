package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.TaskService;
import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Entities.Task;
import com.example.AIPlanner.Enums.TaskPriority;
import com.example.AIPlanner.Enums.TaskStatus;
import com.example.AIPlanner.Exceptions.TaskNotFoundException;
import com.example.AIPlanner.Mappers.TaskMapper;
import com.example.AIPlanner.Repositories.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public Page<TaskResponse> getAll(Pageable pageable) {
        return taskRepository.findAll(pageable)
                .map(taskMapper::toResponse);
    }

    @Override
    public Page<TaskResponse> getFilteredTasks(
            TaskStatus status,
            TaskPriority priority,
            Boolean completed,
            String keyword,
            Pageable pageable
    ) {
        String searchKeyword = (keyword == null || keyword.trim().isEmpty())
                ? null
                : keyword.trim();

        Page<Task> tasks = taskRepository.findFilteredTasks(
                status,
                priority,
                completed,
                searchKeyword,
                pageable
        );

        return tasks.map(taskMapper::toResponse);
    }

    @Override
    public TaskResponse getById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        return taskMapper.toResponse(task);
    }

    @Override
    public TaskResponse create(CreateTaskRequest request) {
        Task task = taskMapper.toEntity(request);

        Task savedTask = taskRepository.save(task);

        return taskMapper.toResponse(savedTask);
    }

    @Override
    public TaskResponse update(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskMapper.updateEntity(task, request);

        Task updatedTask = taskRepository.save(task);

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }

        taskRepository.deleteById(id);
    }
}