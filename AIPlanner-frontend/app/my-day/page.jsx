"use client";
import { jsx } from "react/jsx-runtime";
import { AppShell } from "@/components/dashboard/app-shell";
import { TaskCollectionPage } from "@/components/dashboard/task-collection-page";

function MyDayPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "My Day", children: /* @__PURE__ */ jsx(TaskCollectionPage, { title: "My Day", filter: "my-day", emptyMessage: "No tasks due today." }) });
}

export default MyDayPage;
