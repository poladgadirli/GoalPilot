package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.PlanDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlanDayRepository extends JpaRepository<PlanDay, Long> {

    List<PlanDay> findAllByPlanIdOrderByDayNumberAsc(Long planId);

    Optional<PlanDay> findByIdAndPlanId(Long id, Long planId);

    boolean existsByPlanIdAndDayNumber(Long planId, Integer dayNumber);

    void deleteAllByPlanId(Long planId);

    long countByPlanId(Long planId);

}