"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TodaysPlan } from "@/components/dashboard/todays-plan";
import { ActiveGoals } from "@/components/dashboard/active-goals";
import { CurrentPlanProgress } from "@/components/dashboard/current-plan-progress";
import { AiGoalCreator } from "@/components/dashboard/ai-goal-creator";
import { RecentManualTasks } from "@/components/dashboard/recent-manual-tasks";
import { TaskDetail } from "@/components/dashboard/task-detail";
import { isAuthenticated } from "@/lib/api";
function DashboardPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [view, setView] = useState("dashboard");
  const [selectedTaskId, setSelectedTaskId] = useState(params.taskId ?? "");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    setIsReady(true);
  }, [navigate]);
  useEffect(() => {
    setSelectedTaskId(params.taskId ?? "");
    setView(params.taskId ? "task-detail" : "dashboard");
  }, [params.taskId]);
  const handleDataChange = () => {
    setRefreshKey((key) => key + 1);
  };
  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId.toString());
    navigate(`/dashboard/tasks/${taskId}`);
  };
  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedTaskId("");
    navigate("/dashboard");
  };
  if (!isReady) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-on-surface-variant", children: "Loading dashboard..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Sidebar, { onTaskSelect: handleTaskSelect, refreshKey }),
    /* @__PURE__ */ jsxs("div", { className: "ml-[260px] min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, { title: view === "dashboard" ? "Dashboard" : "Task Details" }),
      /* @__PURE__ */ jsx("main", { className: "p-6 max-w-[1280px] mx-auto w-full flex flex-col gap-6", children: view === "dashboard" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(SummaryCards, { refreshKey }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
            /* @__PURE__ */ jsx(TodaysPlan, { refreshKey }),
            /* @__PURE__ */ jsx(ActiveGoals, { refreshKey })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx(AiGoalCreator, { onGoalCreated: handleDataChange }),
            /* @__PURE__ */ jsx(CurrentPlanProgress, { refreshKey })
          ] })
        ] }),
        /* @__PURE__ */ jsx(RecentManualTasks, { refreshKey, onDataChange: handleDataChange })
      ] }) : /* @__PURE__ */ jsx(TaskDetail, { taskId: selectedTaskId, onBack: handleBackToDashboard, onTaskUpdated: handleDataChange }) })
    ] })
  ] });
}
export {
  DashboardPage as default
};
