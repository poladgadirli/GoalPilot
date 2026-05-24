"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Clock, Check, Plus } from "lucide-react";
import { fetchTasks, updateTask } from "@/lib/api";
import { CreateTaskModal } from "./create-task-modal";
function RecentManualTasks({ refreshKey = 0, onDataChange }) {
  const [recentManualTasks, setRecentManualTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updatingTaskIds, setUpdatingTaskIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    let isMounted = true;
    async function loadTasks() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const page = await fetchTasks();
        if (!isMounted) return;
        setRecentManualTasks(
          (page.content ?? []).map((task) => ({
            id: task.id.toString(),
            title: task.title,
            time: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Recently",
            category: task.category?.name ?? "Uncategorized",
            completed: task.completed
          }))
        );
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load tasks.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTasks();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  const handleTaskSaved = () => {
    onDataChange?.();
  };
  const handleToggleTask = async (task) => {
    const nextCompleted = !task.completed;
    setUpdatingTaskIds((ids) => [...ids, task.id]);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTask(task.id, {
        completed: nextCompleted,
        status: nextCompleted ? "DONE" : "TODO"
      });
      setRecentManualTasks((tasks) => tasks.map((entry) => entry.id === task.id ? {
        ...entry,
        completed: updatedTask.completed
      } : entry));
      onDataChange?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update task.");
    } finally {
      setUpdatingTaskIds((ids) => ids.filter((id) => id !== task.id));
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-on-surface", children: "Recent Manual Tasks" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsModalOpen(true),
          className: "flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            "New Task"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-3 rounded-lg border border-outline-variant text-sm text-on-surface-variant", children: "Loading tasks..." }) : errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-3 rounded-lg border border-outline-variant text-sm text-error", children: errorMessage }) : recentManualTasks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-3 rounded-lg border border-outline-variant text-sm text-on-surface-variant", children: "No tasks yet." }) : null,
      recentManualTasks.map((task) => {
        const isUpdating = updatingTaskIds.includes(task.id);
        return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-surface-container-lowest p-3 rounded-lg border border-outline-variant flex items-center gap-3 group hover:border-primary/20 transition-all",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleToggleTask(task),
                disabled: isUpdating,
                className: `flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${task.completed ? "bg-primary border-primary" : "border-outline-variant group-hover:border-primary"}`,
                "aria-label": task.completed ? "Mark task as incomplete" : "Mark task as complete",
                children: task.completed && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-on-primary" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: `text-sm font-medium truncate ${task.completed ? "text-outline line-through" : "text-on-surface"}`,
                  children: task.title
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                task.time
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-xs font-medium flex-shrink-0", children: task.category })
          ]
        },
        task.id
      );
      })
    ] }),
    /* @__PURE__ */ jsx(
      CreateTaskModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        onSaved: handleTaskSaved
      }
    )
  ] });
}
export {
  RecentManualTasks
};
