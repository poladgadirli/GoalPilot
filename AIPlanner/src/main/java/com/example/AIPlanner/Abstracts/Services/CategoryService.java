package com.example.AIPlanner.Abstracts.Services;

import com.example.AIPlanner.DTOs.Requests.Categories.CreateCategoryRequest;
import com.example.AIPlanner.DTOs.Requests.Categories.UpdateCategoryRequest;
import com.example.AIPlanner.DTOs.Responses.Categories.CategoryResponse;

import java.util.List;

public interface CategoryService
{
    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CreateCategoryRequest request);

    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);

    void deleteCategory(Long id);
}