"use client";
import { jsx } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/dashboard/app-shell";
import { TaskDetail } from "@/components/dashboard/task-detail";

function TaskDetailPage() {
  const navigate = useNavigate();
  const params = useParams();

  return /* @__PURE__ */ jsx(AppShell, { title: "Task Details", children: ({ refreshShell }) => /* @__PURE__ */ jsx(TaskDetail, { taskId: params.id, onBack: () => navigate("/tasks"), onTaskUpdated: refreshShell }) });
}

export default TaskDetailPage;
