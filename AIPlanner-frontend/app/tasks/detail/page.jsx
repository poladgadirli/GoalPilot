"use client";
import { jsx } from "react/jsx-runtime";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/dashboard/app-shell";
import { TaskDetail } from "@/components/dashboard/task-detail";

function getTaskBackTarget(from) {
  if (typeof from !== "string") return "/tasks";
  if (from === "/dashboard" || from === "/planned" || from === "/my-day" || from === "/important") return from;
  if (from === "/tasks" || from.startsWith("/tasks?")) return from;
  return "/tasks";
}

function TaskDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const backTarget = getTaskBackTarget(location.state?.from);

  return /* @__PURE__ */ jsx(AppShell, { title: "Task Details", children: ({ refreshShell }) => /* @__PURE__ */ jsx(TaskDetail, { taskId: params.id, onBack: () => navigate(backTarget), onTaskUpdated: refreshShell }) });
}

export default TaskDetailPage;
