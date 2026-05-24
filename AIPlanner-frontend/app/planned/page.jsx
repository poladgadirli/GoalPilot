"use client";
import { jsx } from "react/jsx-runtime";
import { AppShell } from "@/components/dashboard/app-shell";
import { TaskCollectionPage } from "@/components/dashboard/task-collection-page";

function PlannedPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "Planned", children: /* @__PURE__ */ jsx(TaskCollectionPage, { title: "Planned Tasks", filter: "planned", emptyMessage: "No planned tasks yet." }) });
}

export default PlannedPage;
