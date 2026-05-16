package com.example.AIPlanner.Specifications;

import com.example.AIPlanner.DTOs.Requests.Tasks.TaskFilterRequest;
import com.example.AIPlanner.Entities.Task;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecification {

    public static Specification<Task> filter(TaskFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            var predicate = criteriaBuilder.conjunction();

            if (filter.getCategoryId() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("category").get("id"), filter.getCategoryId())
                );
            }

            if (filter.getStatus() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("status"), filter.getStatus())
                );
            }

            if (filter.getPriority() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("priority"), filter.getPriority())
                );
            }

            if (filter.getCompleted() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("completed"), filter.getCompleted())
                );
            }

            return predicate;
        };
    }
}