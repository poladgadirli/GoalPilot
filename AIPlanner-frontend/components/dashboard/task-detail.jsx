"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Check, Clock, Sparkles, Star } from "lucide-react";
import { fetchTaskById, updateTask, updateTaskImportant } from "@/lib/api";

function formatDate(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleString();
}

function TaskDetail({ taskId, onBack, onTaskUpdated }) {
  const params = useParams();
  const resolvedTaskId = taskId ?? params.taskId;
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingImportant, setIsUpdatingImportant] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadTask() {
      if (!resolvedTaskId) {
        setErrorMessage("No task selected.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const loadedTask = await fetchTaskById(resolvedTaskId);
        if (!isMounted) return;
        setTask(loadedTask);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load task.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTask();
    return () => {
      isMounted = false;
    };
  }, [resolvedTaskId]);

  const handleToggleComplete = async () => {
    if (!task) return;
    const nextCompleted = !task.completed;
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTask(task.id, {
        completed: nextCompleted,
        status: nextCompleted ? "DONE" : "TODO"
      });
      setTask(updatedTask);
      onTaskUpdated?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update task.");
    } finally {
      setIsUpdating(false);
    }
  };
  const handleToggleImportant = async () => {
    if (!task) return;
    setIsUpdatingImportant(true);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTaskImportant(task.id, !task.important);
      setTask(updatedTask);
      onTaskUpdated?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update task importance.");
    } finally {
      setIsUpdatingImportant(false);
    }
  };

  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onBack,
          className: "p-2 hover:bg-surface-container rounded-full transition-all",
          children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold", children: isLoading ? "Loading task..." : task?.title ?? "Task Details" })
    ] }),
    errorMessage && /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant text-on-surface-variant", children: "Loading task details..." }) : task && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-6", children: [
        /* @__PURE__ */ jsxs("section", { className: "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleToggleComplete,
                  disabled: isUpdating,
                  className: `w-8 h-8 rounded-md border-2 flex items-center justify-center transition-colors ${task.completed ? "bg-primary border-primary" : "border-outline-variant hover:border-primary"}`,
                  "aria-label": task.completed ? "Mark task as incomplete" : "Mark task as complete",
                  children: task.completed && /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-on-primary" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleToggleImportant,
                  disabled: isUpdatingImportant,
                  className: `w-8 h-8 rounded-md flex items-center justify-center transition-colors ${task.important ? "text-primary" : "text-on-surface-variant hover:text-primary"} disabled:cursor-not-allowed disabled:opacity-60`,
                  "aria-label": task.important ? "Remove from important" : "Mark as important",
                  children: /* @__PURE__ */ jsx(Star, { className: "w-5 h-5", style: { fill: task.important ? "currentColor" : "none" } })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-base font-semibold", children: task.completed ? "Completed" : "Mark as completed" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap justify-end", children: [
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-sm font-bold", children: task.priority ?? "No Priority" }),
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-sm", children: task.category?.name ?? "Uncategorized" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2", children: "Description" }),
              /* @__PURE__ */ jsx("p", { className: "text-base text-on-surface leading-relaxed", children: task.description || "No description added." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2", children: "Status" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant", children: task.status ?? "TODO" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-outline", children: "DUE DATE" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-surface-container-low rounded-xl", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-primary" }),
              /* @__PURE__ */ jsx("span", { className: "text-base font-semibold", children: formatDate(task.dueDate) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-outline", children: "CREATED" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-surface-container-low rounded-xl", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-on-surface-variant" }),
              /* @__PURE__ */ jsx("span", { className: "text-base", children: formatDate(task.createdAt) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-ai p-6 rounded-2xl border border-outline-variant flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "AI Insight" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm italic", children: "Task details are loaded from your planner data." })
        ] })
      ] })
    ] })
  ] });
}
export {
  TaskDetail
};
