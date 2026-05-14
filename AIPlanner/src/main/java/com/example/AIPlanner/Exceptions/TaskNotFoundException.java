package com.example.AIPlanner.Exceptions;

public class TaskNotFoundException extends RuntimeException
{

    public TaskNotFoundException(Long id) {
        super("Task tapılmadı. Id: " + id);
    }
}