"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createTask, fetchCategories } from "@/lib/api";
function CreateTaskModal({ isOpen, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState();
  const [priority, setPriority] = useState("MEDIUM");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (!isMounted) return;
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch {
        if (!isMounted) return;
        setCategories([]);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await createTask({
        title: title.trim(),
        ...categoryId ? { categoryId } : {},
        priority
      });
      setTitle("");
      setPriority("MEDIUM");
      onSaved?.();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-transform duration-300",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-outline-variant flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-serif font-semibold", children: "Create New Task" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "p-2 hover:bg-surface-container rounded-full transition-all",
                  children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Task Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "e.g. Design review session",
                    className: "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base focus:border-primary focus:ring-0 transition-all outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Category" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: categoryId ?? "",
                      onChange: (e) => setCategoryId(e.target.value ? Number(e.target.value) : void 0),
                      className: "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base focus:border-primary focus:ring-0 outline-none",
                      children: categories.length === 0 ? /* @__PURE__ */ jsx("option", { value: "", children: "No category" }) : categories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-on-surface-variant", children: "Priority" }),
                  /* @__PURE__ */ jsx("div", { className: "flex gap-2 h-full pt-1", children: ["HIGH", "MEDIUM", "LOW"].map((p) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setPriority(p),
                      className: `flex-1 py-2 border rounded-xl text-xs font-medium transition-all ${priority === p ? p === "HIGH" ? "border-error bg-error-container/10 text-error" : "border-primary bg-primary/10 text-primary" : "border-outline-variant hover:border-primary"}`,
                      children: p === "HIGH" ? "High" : p === "MEDIUM" ? "Med" : "Low"
                    },
                    p
                  )) })
                ] })
              ] }),
              errorMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-error", children: errorMessage }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 bg-surface-container-low flex justify-end gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  disabled: isSubmitting,
                  className: "px-6 py-2 font-semibold text-sm hover:bg-surface-container-highest rounded-lg transition-all",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleSave,
                  disabled: isSubmitting || !title.trim(),
                  className: "px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm shadow-lg shadow-primary/10 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50",
                  children: isSubmitting ? "Saving..." : "Save Task"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
export {
  CreateTaskModal
};
