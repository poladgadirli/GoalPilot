package com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.Task;
import com.example.AIPlanner.Entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    @Query("""
    SELECT t FROM Task t
    WHERE (:status IS NULL OR t.status = :status)
      AND (:priority IS NULL OR t.priority = :priority)
      AND (
          :completed IS NULL
          OR (:completed = true AND t.status = com.example.AIPlanner.Enums.TaskStatus.DONE)
          OR (:completed = false AND t.status <> com.example.AIPlanner.Enums.TaskStatus.DONE)
      )
      AND (
          :keyword = ''
          OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR LOWER(COALESCE(t.description, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
      )
    """)

    List<Task> findByCategoryId(Long categoryId);

    Page<Task> findByUser(User user, Pageable pageable);

    Optional<Task> findByIdAndUser(Long id, User user);
}
