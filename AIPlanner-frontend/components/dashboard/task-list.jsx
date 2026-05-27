"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Plus, Clock, Check } from "lucide-react";
import { CreateTaskModal } from "./create-task-modal";
const initialTasks = [
  {
    id: "1",
    title: "Quarterly report synthesis",
    time: "10:00 AM",
    priority: "High",
    category: "Work",
    completed: false
  },
  {
    id: "2",
    title: "Review design system updates",
    time: "Done",
    priority: "Med",
    category: "Work",
    completed: true
  }
];
function TaskList({ onTaskSelect }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleTask = (id) => {
    setTasks(
      (prev) => prev.map(
        (task) => task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  const addTask = (title, category, priority) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      time: "Soon",
      priority,
      category,
      completed: false
    };
    setTasks((prev) => [newTask, ...prev]);
  };
  const getPriorityStyles = (priority, completed) => {
    if (completed) return "bg-tertiary-container/10 text-on-tertiary-container";
    switch (priority) {
      case "High":
        return "bg-error-container/10 text-error";
      case "Med":
        return "bg-tertiary-container/10 text-on-tertiary-container";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "lg:col-span-8 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-on-surface", children: "Today's Tasks" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsModalOpen(true),
          className: "flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 duration-200",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            "Create Task"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tasks.map((task) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4 group hover:border-primary/20 transition-all cursor-pointer",
        onClick: () => !task.completed && onTaskSelect?.(task.title),
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                toggleTask(task.id);
              },
              className: `flex items-center justify-center w-6 h-6 border-2 rounded-md cursor-pointer transition-colors ${task.completed ? "border-primary bg-primary" : "border-outline-variant group-hover:border-primary"}`,
              children: task.completed && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-on-primary" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: `text-base font-semibold ${task.completed ? "text-outline line-through" : "text-on-surface"}`,
                children: task.title
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-outline flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                " ",
                task.time
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-0.5 font-medium rounded-full text-xs ${getPriorityStyles(
                    task.priority,
                    task.completed
                  )}`,
                  children: task.priority
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-xs", children: task.category })
            ] })
          ] })
        ]
      },
      task.id
    )) }),
    /* @__PURE__ */ jsx(
      CreateTaskModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        onSave: addTask
      }
    )
  ] });
}
export {
  TaskList
};
