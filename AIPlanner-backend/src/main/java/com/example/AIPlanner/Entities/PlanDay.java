package com.example.AIPlanner.Entities;

import com.example.AIPlanner.Entities.Common.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "plan_days",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"plan_id", "day_number"})
        }
)
public class PlanDay extends BaseEntity<Long> {

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Boolean restDay = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @OneToMany(mappedBy = "planDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<PlanTask> tasks = new ArrayList<>();

    public PlanDay() {
    }

    public PlanDay(
            Integer dayNumber,
            LocalDate date,
            String title,
            String description,
            Boolean restDay,
            Plan plan
    ) {
        this.dayNumber = dayNumber;
        this.date = date;
        this.title = title;
        this.description = description;
        this.restDay = restDay != null ? restDay : false;
        this.plan = plan;
    }

    public Integer getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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

    public Boolean getRestDay() {
        return restDay;
    }

    public void setRestDay(Boolean restDay) {
        this.restDay = restDay;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public List<PlanTask> getTasks() {
        return tasks;
    }

    public void setTasks(List<PlanTask> tasks) {
        this.tasks = tasks;
    }

    public void addTask(PlanTask task) {
        tasks.add(task);
        task.setPlanDay(this);
    }

    public void removeTask(PlanTask task) {
        tasks.remove(task);
        task.setPlanDay(null);
    }
}