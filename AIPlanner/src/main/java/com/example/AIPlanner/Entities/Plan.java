package com.example.AIPlanner.Entities;

import com.example.AIPlanner.Entities.Common.BaseEntity;
import com.example.AIPlanner.Enums.PlanGenerationType;
import com.example.AIPlanner.Enums.PlanStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "plans")
public class Plan extends BaseEntity<Long> {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Integer totalDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PlanGenerationType generationType = PlanGenerationType.MANUAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PlanStatus status = PlanStatus.ACTIVE;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "goal_id", nullable = false, unique = true)
    private Goal goal;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Plan() {
    }

    public Plan(
            String title,
            String description,
            LocalDate startDate,
            LocalDate endDate,
            Integer totalDays,
            PlanGenerationType generationType,
            Goal goal,
            User user
    ) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalDays = totalDays;
        this.generationType = generationType;
        this.status = PlanStatus.ACTIVE;
        this.goal = goal;
        this.user = user;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }

    public PlanGenerationType getGenerationType() {
        return generationType;
    }

    public void setGenerationType(PlanGenerationType generationType) {
        this.generationType = generationType;
    }

    public PlanStatus getStatus() {
        return status;
    }

    public void setStatus(PlanStatus status) {
        this.status = status;
    }

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}