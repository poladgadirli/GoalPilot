package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.Plan;
import com.example.AIPlanner.Enums.PlanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlanRepository extends JpaRepository<Plan, Long> {

    List<Plan> findAllByUserId(Long userId);

    List<Plan> findAllByUserIdAndStatus(Long userId, PlanStatus status);

    Optional<Plan> findByIdAndUserId(Long id, Long userId);

    Optional<Plan> findByGoalIdAndUserId(Long goalId, Long userId);

    boolean existsByGoalIdAndUserId(Long goalId, Long userId);
}