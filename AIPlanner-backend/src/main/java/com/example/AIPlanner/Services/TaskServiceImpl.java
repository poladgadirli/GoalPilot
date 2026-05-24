package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.Abstracts.Services.TaskService;
import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.TaskFilterRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Entities.Category;
import com.example.AIPlanner.Entities.Task;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Exceptions.CategoryNotFoundException;
import com.example.AIPlanner.Exceptions.TaskNotFoundException;
import com.example.AIPlanner.Mappers.TaskMapper;
import com.example.AIPlanner.Repositories.CategoryRepository;
import com.example.AIPlanner.Repositories.TaskRepository;
import com.example.AIPlanner.Specifications.TaskSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            TaskMapper taskMapper,
            CategoryRepository categoryRepository,
            CurrentUserService currentUserService
    ) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.categoryRepository = categoryRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public Page<TaskResponse> getAll(TaskFilterRequest filter, Pageable pageable) {
        User currentUser = currentUserService.getCurrentUser();

        Specification<Task> userSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user"), currentUser);

        Specification<Task> finalSpec = TaskSpecification.filter(filter).and(userSpec);

        return taskRepository.findAll(finalSpec, pageable)
                .map(taskMapper::toResponse);
    }

    @Override
    public TaskResponse getById(Long id) {
        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new TaskNotFoundException(id));

        return taskMapper.toResponse(task);
    }

    @Override
    public TaskResponse create(CreateTaskRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        Task task = taskMapper.toEntity(request);
        task.setUser(currentUser);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), currentUser)
                    .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));

            task.setCategory(category);
        }

        Task savedTask = taskRepository.save(task);

        return taskMapper.toResponse(savedTask);
    }

    @Override
    public List<TaskResponse> getByCategory(Long categoryId) {
        User currentUser = currentUserService.getCurrentUser();

        categoryRepository.findByIdAndUser(categoryId, currentUser)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));

        return taskRepository.findByCategoryIdAndUser(categoryId, currentUser)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    public TaskResponse update(Long id, UpdateTaskRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskMapper.updateEntity(task, request);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), currentUser)
                    .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));

            task.setCategory(category);
        }

        Task updatedTask = taskRepository.save(task);

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public TaskResponse updateImportant(Long id, boolean important) {
        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setImportant(important);

        Task updatedTask = taskRepository.save(task);

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public void delete(Long id) {
        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskRepository.delete(task);
    }
}
