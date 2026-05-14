package com.example.AIPlanner.Mappers;

import com.example.AIPlanner.DTOs.Requests.Categories.CreateCategoryRequest;
import com.example.AIPlanner.DTOs.Requests.Categories.UpdateCategoryRequest;
import com.example.AIPlanner.DTOs.Responses.Categories.CategoryResponse;
import com.example.AIPlanner.Entities.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CreateCategoryRequest request) {
        Category category = new Category();

        category.setName(request.getName());
        category.setColor(request.getColor());

        return category;
    }

    public CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getColor(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }

    public void updateEntity(Category category, UpdateCategoryRequest request) {
        category.setName(request.getName());
        category.setColor(request.getColor());
    }
}