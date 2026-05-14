package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}