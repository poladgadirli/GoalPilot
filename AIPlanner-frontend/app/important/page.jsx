"use client";
import { jsx } from "react/jsx-runtime";
import { AppShell } from "@/components/dashboard/app-shell";
import { TaskCollectionPage } from "@/components/dashboard/task-collection-page";

function ImportantPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "Important", children: /* @__PURE__ */ jsx(TaskCollectionPage, { title: "Important Tasks", filter: "important", emptyMessage: "No high-priority tasks yet." }) });
}

export default ImportantPage;
