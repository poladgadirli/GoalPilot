"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";
import { AppShell } from "@/components/dashboard/app-shell";
import { useTranslation } from "@/i18n";
import { createCategory, deleteCategory, fetchCategories, fetchTasksWithParams, updateCategory } from "@/lib/api";

const defaultColor = "#64748B";

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ");
}

function CategoriesContent() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [name, setName] = useState("");
  const [color, setColor] = useState(defaultColor);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(defaultColor);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formError, setFormError] = useState(null);

  async function loadCategories() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [categoryList, tasksPage] = await Promise.all([
        fetchCategories(),
        fetchTasksWithParams({ size: 200 })
      ]);
      const counts = {};
      for (const task of tasksPage.content ?? []) {
        const categoryId = task.category?.id;
        if (!categoryId) continue;
        counts[categoryId] = (counts[categoryId] ?? 0) + 1;
      }
      setCategories(categoryList);
      setTaskCounts(counts);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load categories.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const resetCreateForm = () => {
    setName("");
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditColor(defaultColor);
    setFormError(null);
  };

  const beginEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color ?? defaultColor);
    setFormError(null);
  };

  const validateName = (value, currentId = null) => {
    const normalized = normalizeName(value);
    if (!normalized) return "Category name is required.";
    const duplicate = categories.some(
      (category) => category.id !== currentId && category.name.trim().toLowerCase() === normalized.toLowerCase()
    );
    if (duplicate) return "A category with this name already exists.";
    return null;
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const normalized = normalizeName(name);
    const validationError = validateName(name);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setFormError(null);
    try {
      const createdCategory = await createCategory({ name: normalized, color });
      setCategories((items) => [...items, createdCategory]);
      resetCreateForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (categoryId) => {
    const normalized = normalizeName(editName);
    const validationError = validateName(editName, categoryId);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setSavingId(categoryId);
    setErrorMessage(null);
    setFormError(null);
    try {
      const updatedCategory = await updateCategory(categoryId, { name: normalized, color: editColor });
      setCategories((items) => items.map((category) => category.id === categoryId ? updatedCategory : category));
      cancelEdit();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to update category.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (category) => {
    const taskCount = taskCounts[category.id] ?? 0;
    const message = taskCount > 0
      ? `Delete "${category.name}"? It is used by ${taskCount} task${taskCount === 1 ? "" : "s"}.`
      : `Delete "${category.name}"?`;
    if (!window.confirm(message)) return;
    setDeletingId(category.id);
    setErrorMessage(null);
    setFormError(null);
    try {
      await deleteCategory(category.id);
      setCategories((items) => items.filter((item) => item.id !== category.id));
      if (editingId === category.id) cancelEdit();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title={t("categories")}
        subtitle={t("categoriesSubtitle")}
        action={(
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-sm">
            <span className="font-semibold text-on-surface">{categories.length}</span>
            <span className="ml-1 text-on-surface-variant">{t("categories").toLowerCase()}</span>
          </div>
        )}
      />

      <form onSubmit={handleCreate} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-on-surface-variant">{t("categoryName")}</span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="e.g. Work, Study, Personal"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 outline-none focus:border-primary"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-on-surface-variant">Color</span>
            <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2">
              <span className="h-5 w-5 rounded-full border border-outline-variant" style={{ backgroundColor: color }} />
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0"
                aria-label="Category color"
              />
            </div>
          </label>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="self-end bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
          >
            {isSubmitting ? `${t("create")}...` : t("create")}
          </button>
        </div>
        {formError ? <p className="text-sm text-error">{formError}</p> : null}
      </form>

      {isLoading ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
          {t("loading")}...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error flex items-center justify-between gap-3">
          <span>{errorMessage}</span>
          <button type="button" onClick={loadCategories} className="text-xs font-semibold text-on-surface hover:underline">
            {t("retry")}
          </button>
        </div>
      ) : null}

      {!isLoading && !errorMessage && categories.length === 0 ? (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
          <h3 className="text-lg font-semibold text-on-surface">{t("noCategoriesYet")}</h3>
          <p className="mt-2 text-sm text-on-surface-variant">{t("createCategoriesHelp")}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category) => {
          const isEditing = editingId === category.id;
          const taskCount = taskCounts[category.id] ?? 0;
          return (
            <div key={category.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    value={editName}
                    onChange={(event) => {
                      setEditName(event.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 outline-none focus:border-primary"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="h-5 w-5 rounded-full border border-outline-variant" style={{ backgroundColor: editColor }} />
                    <input
                      type="color"
                      value={editColor}
                      onChange={(event) => setEditColor(event.target.value)}
                      className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0"
                      aria-label="Edit category color"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(category.id)}
                      disabled={savingId === category.id || !editName.trim()}
                      className="ml-auto bg-primary text-on-primary px-3 py-2 rounded-lg font-semibold text-xs disabled:opacity-50"
                    >
                      {savingId === category.id ? `${t("save")}...` : t("save")}
                    </button>
                    <button type="button" onClick={cancelEdit} className="bg-surface-container text-on-surface px-3 py-2 rounded-lg font-semibold text-xs">
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <Link to={`/tasks?categoryId=${category.id}`} className="flex items-center gap-3 min-w-0">
                    <span className="w-4 h-4 rounded-full flex-shrink-0 border border-outline-variant" style={{ backgroundColor: category.color ?? defaultColor }} />
                    <span className="font-semibold truncate text-on-surface">{category.name}</span>
                  </Link>
                  <span className="flex-shrink-0 rounded bg-surface-container px-2 py-1 text-xs text-on-surface-variant">
                    {taskCount} {taskCount === 1 ? "task" : "tasks"}
                  </span>
                </div>
              )}

              {!isEditing ? (
                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => beginEdit(category)} className="bg-surface-container text-on-surface px-3 py-2 rounded-lg font-semibold text-xs">
                    {t("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={deletingId === category.id}
                    className="bg-error-container/40 text-error px-3 py-2 rounded-lg font-semibold text-xs disabled:opacity-50"
                  >
                    {deletingId === category.id ? `${t("delete")}...` : t("delete")}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CategoriesPage() {
  return (
    <AppShell title="Categories">
      <CategoriesContent />
    </AppShell>
  );
}

export default CategoriesPage;
