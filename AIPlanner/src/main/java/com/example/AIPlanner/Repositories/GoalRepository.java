package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.Goal;
import com.example.AIPlanner.Enums.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findAllByUserId(Long userId);

    List<Goal> findAllByUserIdAndStatus(Long userId, GoalStatus status);

    Optional<Goal> findByIdAndUserId(Long id, Long userId);

    boolean existsByTitleIgnoreCaseAndUserId(String title, Long userId);
}