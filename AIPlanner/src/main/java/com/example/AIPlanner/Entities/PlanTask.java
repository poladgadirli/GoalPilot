package com.example.AIPlanner.Entities;

import com.example.AIPlanner.Entities.Common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "plan_tasks")
public class PlanTask extends BaseEntity<Long> {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer estimatedMinutes;

    @Column(nullable = false)
    private Integer orderIndex;

    @Column(nullable = false)
    private Boolean completed = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_day_id", nullable = false)
    private PlanDay planDay;

    public PlanTask() {
    }

    public PlanTask(
            String title,
            String description,
            Integer estimatedMinutes,
            Integer orderIndex,
            Boolean completed,
            PlanDay planDay
    ) {
        this.title = title;
        this.description = description;
        this.estimatedMinutes = estimatedMinutes;
        this.orderIndex = orderIndex;
        this.completed = completed != null ? completed : false;
        this.planDay = planDay;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public PlanDay getPlanDay() {
        return planDay;
    }

    public void setPlanDay(PlanDay planDay) {
        this.planDay = planDay;
    }
}