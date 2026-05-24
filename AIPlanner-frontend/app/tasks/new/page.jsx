"use client";
import { jsx } from "react/jsx-runtime";
import { AppShell } from "@/components/dashboard/app-shell";
import { TaskFormPage } from "@/components/dashboard/task-form-page";

function NewTaskPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "New Task", children: /* @__PURE__ */ jsx(TaskFormPage, {}) });
}

export default NewTaskPage;
