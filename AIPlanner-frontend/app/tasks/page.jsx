"use client";
import { jsx } from "react/jsx-runtime";
import { AppShell } from "@/components/dashboard/app-shell";
import { TaskCollectionPage } from "@/components/dashboard/task-collection-page";

function TasksPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "Tasks", children: /* @__PURE__ */ jsx(TaskCollectionPage, { title: "All Tasks", filter: "all", emptyMessage: "No tasks yet." }) });
}

export default TasksPage;
