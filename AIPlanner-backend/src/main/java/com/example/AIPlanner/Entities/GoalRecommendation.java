package com.example.AIPlanner.Entities;

import com.example.AIPlanner.Entities.Common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "goal_recommendations")
public class GoalRecommendation extends BaseEntity<Long> {

    @Column(nullable = false, length = 150)
    private String goalTitle;

    @Column(length = 1000)
    private String goalDescription;

    @Column(nullable = false)
    private Integer minimumRecommendedDays;

    @Column(nullable = false)
    private Integer minimumRecommendedMinutes;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column(nullable = false)
    private Boolean used = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public GoalRecommendation() {
    }

    public GoalRecommendation(
            String goalTitle,
            String goalDescription,
            Integer minimumRecommendedDays,
            Integer minimumRecommendedMinutes,
            String reason,
            User user
    ) {
        this.goalTitle = goalTitle;
        this.goalDescription = goalDescription;
        this.minimumRecommendedDays = minimumRecommendedDays;
        this.minimumRecommendedMinutes = minimumRecommendedMinutes;
        this.reason = reason;
        this.used = false;
        this.user = user;
    }

    public String getGoalTitle() {
        return goalTitle;
    }

    public void setGoalTitle(String goalTitle) {
        this.goalTitle = goalTitle;
    }

    public String getGoalDescription() {
        return goalDescription;
    }

    public void setGoalDescription(String goalDescription) {
        this.goalDescription = goalDescription;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}