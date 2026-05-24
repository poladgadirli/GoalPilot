"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/dashboard/app-shell";
import { createCategory, fetchCategories, updateCategory } from "@/lib/api";

function CategoriesContent() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#64748B");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function loadCategories() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setCategories(await fetchCategories());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load categories.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setColor("#64748B");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (editingId) {
        await updateCategory(editingId, { name: name.trim(), color });
      } else {
        await createCategory({ name: name.trim(), color });
      }
      resetForm();
      await loadCategories();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Categories" }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Loading categories..." }) : null,
    errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : null,
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col md:flex-row gap-3", children: [
      /* @__PURE__ */ jsx("input", { value: name, onChange: (event) => setName(event.target.value), placeholder: "Category name", className: "flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 outline-none focus:border-primary" }),
      /* @__PURE__ */ jsx("input", { type: "color", value: color, onChange: (event) => setColor(event.target.value), className: "h-10 w-16 bg-surface-container-low border border-outline-variant rounded-lg p-1" }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting || !name.trim(), className: "bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50", children: editingId ? "Save" : "Create" }),
      editingId ? /* @__PURE__ */ jsx("button", { type: "button", onClick: resetForm, className: "bg-surface-container text-on-surface px-4 py-2 rounded-lg font-semibold text-sm", children: "Cancel" }) : null
    ] }),
    !isLoading && !errorMessage && categories.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "No categories yet." }) : null,
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: categories.map((category) => /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full flex-shrink-0 border border-outline-variant", style: { backgroundColor: category.color ?? "#64748B" } }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold truncate", children: category.name })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
        setEditingId(category.id);
        setName(category.name);
        setColor(category.color ?? "#64748B");
      }, className: "text-primary text-sm font-semibold hover:underline", children: "Edit" })
    ] }, category.id)) })
  ] });
}

function CategoriesPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "Categories", children: /* @__PURE__ */ jsx(CategoriesContent, {}) });
}

export default CategoriesPage;
