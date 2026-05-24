package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.Task;
import com.example.AIPlanner.Entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    Page<Task> findByUser(User user, Pageable pageable);

    Optional<Task> findByIdAndUser(Long id, User user);

    List<Task> findByCategoryIdAndUser(Long categoryId, User user);
}