package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.PlanTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlanTaskRepository extends JpaRepository<PlanTask, Long> {

    List<PlanTask> findAllByPlanDayIdOrderByOrderIndexAsc(Long planDayId);

    Optional<PlanTask> findByIdAndPlanDayId(Long id, Long planDayId);

    void deleteAllByPlanDayId(Long planDayId);

    Optional<PlanTask> findByIdAndPlanDayPlanUserId(Long id, Long userId);
}