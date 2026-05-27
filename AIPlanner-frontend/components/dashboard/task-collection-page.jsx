"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Plus } from "lucide-react";
import { fetchTasksWithParams } from "@/lib/api";

function isSameLocalDate(value, date) {
  if (!value) return false;
  const taskDate = new Date(value);
  return taskDate.getFullYear() === date.getFullYear()
    && taskDate.getMonth() === date.getMonth()
    && taskDate.getDate() === date.getDate();
}

function formatDate(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleString();
}

function TaskCollectionPage({ title, emptyMessage, filter = "all" }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadTasks() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const apiParams = { size: 100, sortBy: filter === "planned" ? "dueDate" : "createdAt", direction: filter === "planned" ? "asc" : "desc" };
        if (filter === "important") {
          apiParams.important = true;
        }
        const page = await fetchTasksWithParams(apiParams);
        const today = new Date();
        let loadedTasks = page.content ?? [];
        if (filter === "my-day") {
          loadedTasks = loadedTasks.filter((task) => isSameLocalDate(task.dueDate, today));
        }
        if (filter === "planned") {
          loadedTasks = loadedTasks.filter((task) => Boolean(task.dueDate));
        }
        if (filter === "important") {
          loadedTasks = loadedTasks.filter((task) => task.important);
        }
        if (!isMounted) return;
        setTasks(loadedTasks);
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
  }, [filter]);

  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-on-surface", children: title }),
      /* @__PURE__ */ jsxs(Link, { to: "/tasks/new", className: "flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        "New Task"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Loading tasks..." }) : null,
    errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : null,
    !isLoading && !errorMessage && tasks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: emptyMessage }) : null,
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tasks.map((task) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/tasks/${task.id}`,
        className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between gap-4 hover:border-primary/30 transition-all",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: `font-semibold truncate ${task.completed ? "text-outline line-through" : "text-on-surface"}`, children: task.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-1 text-xs text-on-surface-variant", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                formatDate(task.dueDate)
              ] }),
              task.category?.name ? /* @__PURE__ */ jsx("span", { children: task.category.name }) : null,
              task.estimatedMinutes ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                task.estimatedMinutes,
                " min"
              ] }) : null
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-surface-container text-on-surface-variant rounded text-xs font-medium", children: task.priority ?? "MEDIUM" }),
            /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-surface-container text-on-surface-variant rounded text-xs font-medium", children: task.status ?? "TODO" })
          ] })
        ]
      },
      task.id
    )) })
  ] });
}

export {
  TaskCollectionPage
};
