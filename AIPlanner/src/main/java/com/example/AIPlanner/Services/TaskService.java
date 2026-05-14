package com.example.AIPlanner.Services;

import com.example.AIPlanner.DTOs.Requests.Tasks.CreateTaskRequest;
import com.example.AIPlanner.DTOs.Requests.Tasks.UpdateTaskRequest;
import com.example.AIPlanner.DTOs.Responses.Tasks.TaskResponse;
import com.example.AIPlanner.Entities.Task;
import com.example.AIPlanner.Exceptions.TaskNotFoundException;
import com.example.AIPlanner.Repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponse> getAll() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TaskResponse getById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        return mapToResponse(task);
    }

    public TaskResponse create(CreateTaskRequest request) {
        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        Task savedTask = taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    public TaskResponse update(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(request.isCompleted());

        Task updatedTask = taskRepository.save(task);

        return mapToResponse(updatedTask);
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }

        taskRepository.deleteById(id);
    }

    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.isCompleted(),
                task.getCreatedAt()
        );
    }
}