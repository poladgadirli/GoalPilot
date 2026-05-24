package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.GoalRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoalRecommendationRepository extends JpaRepository<GoalRecommendation, Long> {

    Optional<GoalRecommendation> findByIdAndUserId(Long id, Long userId);
}