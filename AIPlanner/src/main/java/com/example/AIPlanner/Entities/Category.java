package com.example.AIPlanner.Entities;

import com.example.AIPlanner.Entities.Common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class Category extends BaseEntity<Long> {

    @Column(nullable = false, length = 100, unique = true)
    private String name;

    @Column(length = 20)
    private String color;

    public Category() {
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setColor(String color) {
        this.color = color;
    }
}