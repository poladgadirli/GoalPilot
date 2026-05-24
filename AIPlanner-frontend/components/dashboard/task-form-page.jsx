"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask, fetchCategories } from "@/lib/api";

function toLocalDateTime(value) {
  return value ? `${value}:00` : null;
}

function TaskFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchCategories();
        if (!isMounted) return;
        setCategories(data);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load categories.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
        categoryId: categoryId ? Number(categoryId) : null,
        dueDate: toLocalDateTime(dueDate),
        priority
      });
      navigate("/tasks");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold", children: "New Task" }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Loading form..." }) : null,
    errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : null,
    !isLoading ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Title" }),
        /* @__PURE__ */ jsx("input", { value: title, onChange: (event) => setTitle(event.target.value), className: "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary", required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Description" }),
        /* @__PURE__ */ jsx("textarea", { value: description, onChange: (event) => setDescription(event.target.value), rows: 4, className: "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary resize-none" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Category" }),
          /* @__PURE__ */ jsxs("select", { value: categoryId, onChange: (event) => setCategoryId(event.target.value), className: "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "No category" }),
            categories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Due date" }),
          /* @__PURE__ */ jsx("input", { type: "datetime-local", value: dueDate, onChange: (event) => setDueDate(event.target.value), className: "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Priority" }),
          /* @__PURE__ */ jsx("select", { value: priority, onChange: (event) => setPriority(event.target.value), className: "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary", children: ["LOW", "MEDIUM", "HIGH"].map((value) => /* @__PURE__ */ jsx("option", { value, children: value }, value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate("/tasks"), className: "px-5 py-2 rounded-lg bg-surface-container text-on-surface font-semibold text-sm", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting || !title.trim(), className: "px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm disabled:opacity-50", children: isSubmitting ? "Saving..." : "Create Task" })
      ] })
    ] }) : null
  ] });
}

export {
  TaskFormPage
};
