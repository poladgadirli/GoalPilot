package com.example.AIPlanner.Controller;

import com.example.AIPlanner.Abstracts.Services.CategoryService;
import com.example.AIPlanner.DTOs.Requests.Categories.CreateCategoryRequest;
import com.example.AIPlanner.DTOs.Requests.Categories.UpdateCategoryRequest;
import com.example.AIPlanner.DTOs.Responses.Categories.CategoryResponse;
import com.example.AIPlanner.DTOs.Responses.Common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();

        return ApiResponse.success("Categories fetched successfully", categories);
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);

        return ApiResponse.success("Category fetched successfully", category);
    }

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        CategoryResponse category = categoryService.createCategory(request);

        return ApiResponse.success("Category created successfully", category);
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        CategoryResponse category = categoryService.updateCategory(id, request);

        return ApiResponse.success("Category updated successfully", category);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);

        return ApiResponse.success("Category deleted successfully", null);
    }
}