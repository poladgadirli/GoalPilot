package com.example.AIPlanner.Entities;

import com.example.AIPlanner.Entities.Common.BaseEntity;
import com.example.AIPlanner.Enums.GoalStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "goals")
public class Goal extends BaseEntity<Long> {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private Integer durationDays;

    @Column(nullable = false)
    private Integer dailyAvailableMinutes;

    private Integer minimumRecommendedDays;

    private Integer minimumRecommendedMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GoalStatus status = GoalStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Goal() {
    }

    public Goal(
            String title,
            String description,
            LocalDate startDate,
            Integer durationDays,
            Integer dailyAvailableMinutes,
            Integer minimumRecommendedDays,
            Integer minimumRecommendedMinutes,
            User user
    ) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.durationDays = durationDays;
        this.dailyAvailableMinutes = dailyAvailableMinutes;
        this.minimumRecommendedDays = minimumRecommendedDays;
        this.minimumRecommendedMinutes = minimumRecommendedMinutes;
        this.user = user;
        this.status = GoalStatus.ACTIVE;
    }

    public LocalDate getEndDate() {
        if (startDate == null || durationDays == null) {
            return null;
        }

        return startDate.plusDays(durationDays - 1L);
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

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Integer getDailyAvailableMinutes() {
        return dailyAvailableMinutes;
    }

    public void setDailyAvailableMinutes(Integer dailyAvailableMinutes) {
        this.dailyAvailableMinutes = dailyAvailableMinutes;
    }

    public Integer getMinimumRecommendedDays() {
        return minimumRecommendedDays;
    }

    public void setMinimumRecommendedDays(Integer minimumRecommendedDays) {
        this.minimumRecommendedDays = minimumRecommendedDays;
    }

    public Integer getMinimumRecommendedMinutes() {
        return minimumRecommendedMinutes;
    }

    public void setMinimumRecommendedMinutes(Integer minimumRecommendedMinutes) {
        this.minimumRecommendedMinutes = minimumRecommendedMinutes;
    }

    public GoalStatus getStatus() {
        return status;
    }

    public void setStatus(GoalStatus status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}