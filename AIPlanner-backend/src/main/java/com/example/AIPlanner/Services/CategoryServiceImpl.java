package com.example.AIPlanner.Services;

import com.example.AIPlanner.Abstracts.Services.CategoryService;
import com.example.AIPlanner.Abstracts.Services.CurrentUserService;
import com.example.AIPlanner.DTOs.Requests.Categories.CreateCategoryRequest;
import com.example.AIPlanner.DTOs.Requests.Categories.UpdateCategoryRequest;
import com.example.AIPlanner.DTOs.Responses.Categories.CategoryResponse;
import com.example.AIPlanner.Entities.Category;
import com.example.AIPlanner.Entities.User;
import com.example.AIPlanner.Exceptions.CategoryNotFoundException;
import com.example.AIPlanner.Mappers.CategoryMapper;
import com.example.AIPlanner.Repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final CurrentUserService currentUserService;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            CategoryMapper categoryMapper,
            CurrentUserService currentUserService
    ) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.currentUserService = currentUserService;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        User currentUser = currentUserService.getCurrentUser();

        return categoryRepository.findByUser(currentUser)
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = getCategoryOrThrow(id);

        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        String trimmedName = request.getName().trim();

        if (trimmedName.isBlank()) {
            throw new IllegalArgumentException("Category name must not be blank");
        }

        if (categoryRepository.existsByNameIgnoreCaseAndUser(trimmedName, currentUser)) {
            throw new IllegalArgumentException("Category with this name already exists");
        }

        request.setName(trimmedName);

        Category category = categoryMapper.toEntity(request);
        category.setUser(currentUser);

        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        Category category = categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        if (request.getName() != null) {
            String trimmedName = request.getName().trim();

            if (trimmedName.isBlank()) {
                throw new IllegalArgumentException("Category name must not be blank");
            }

            if (!category.getName().equalsIgnoreCase(trimmedName)
                    && categoryRepository.existsByNameIgnoreCaseAndUser(trimmedName, currentUser)) {
                throw new IllegalArgumentException("Category with this name already exists");
            }

            request.setName(trimmedName);
        }

        categoryMapper.updateEntity(category, request);

        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.toResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryOrThrow(id);

        categoryRepository.delete(category);
    }

    private Category getCategoryOrThrow(Long id) {
        User currentUser = currentUserService.getCurrentUser();

        return categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }
}