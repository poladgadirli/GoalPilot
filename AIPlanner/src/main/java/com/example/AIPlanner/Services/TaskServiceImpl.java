package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.TaskService;
import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.TaskFilterRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Entities.Category;
import com.example.AIPlanner.Entities.Task;
import com.example.AIPlanner.Exceptions.CategoryNotFoundException;
import com.example.AIPlanner.Exceptions.TaskNotFoundException;
import com.example.AIPlanner.Mappers.TaskMapper;
import com.example.AIPlanner.Repositories.CategoryRepository;
import com.example.AIPlanner.Repositories.TaskRepository;
import com.example.AIPlanner.Specifications.TaskSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final CategoryRepository categoryRepository;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Page<TaskResponse> getAll(TaskFilterRequest filter, Pageable pageable) {
        return taskRepository.findAll(TaskSpecification.filter(filter), pageable)
                .map(taskMapper::toResponse);
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

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));

            task.setCategory(category);
        }

        Task savedTask = taskRepository.save(task);

        return taskMapper.toResponse(savedTask);
    }

    @Override
    public List<TaskResponse> getByCategory(Long categoryId) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));

        return taskRepository.findByCategoryId(categoryId)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    public TaskResponse update(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskMapper.updateEntity(task, request);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));

            task.setCategory(category);
        }

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
