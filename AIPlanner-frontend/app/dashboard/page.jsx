"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AppShell } from "@/components/dashboard/app-shell";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TodaysPlan } from "@/components/dashboard/todays-plan";
import { ActiveGoals } from "@/components/dashboard/active-goals";
import { CurrentPlanProgress } from "@/components/dashboard/current-plan-progress";
import { AiGoalCreator } from "@/components/dashboard/ai-goal-creator";
import { RecentManualTasks } from "@/components/dashboard/recent-manual-tasks";
function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleDataChange = () => {
    setRefreshKey((key) => key + 1);
  };
  return /* @__PURE__ */ jsx(AppShell, { title: "Dashboard", refreshKey, children: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(SummaryCards, { refreshKey }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
            /* @__PURE__ */ jsx(TodaysPlan, { refreshKey }),
            /* @__PURE__ */ jsx(ActiveGoals, { refreshKey })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx(AiGoalCreator, { onGoalCreated: handleDataChange, createPath: "/goals/new" }),
            /* @__PURE__ */ jsx(CurrentPlanProgress, { refreshKey })
          ] })
        ] }),
        /* @__PURE__ */ jsx(RecentManualTasks, { refreshKey, onDataChange: handleDataChange })
      ] }) });
}
export {
  DashboardPage as default
};
