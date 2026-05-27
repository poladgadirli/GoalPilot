"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "@/i18n";
import { fetchGoals, fetchPlanByGoalId, fetchPlanProgress } from "@/lib/api";
function CurrentPlanProgress({ refreshKey = 0 }) {
  const { t } = useTranslation();
  const [planProgress, setPlanProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    let isMounted = true;
    async function loadProgress() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const goals = await fetchGoals();
        const items = [];
        for (const goal of goals) {
          const plan = await fetchPlanByGoalId(goal.id);
          if (!plan) continue;
          const progress = await fetchPlanProgress(plan.id);
          items.push({
            id: plan.id.toString(),
            title: plan.title || goal.title,
            completed: progress.completedTasks,
            total: progress.totalTasks,
            timeSpent: `${progress.completedDays}/${progress.totalDays} days`
          });
        }
        if (!isMounted) return;
        setPlanProgress(items);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load plan progress.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProgress();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5 text-primary" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-on-surface", children: t("currentPlanProgress") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: `${t("loading")}...` }) : errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : planProgress.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: t("currentPlanProgress") }) : null,
      planProgress.map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-on-surface", children: item.title }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-on-surface-variant", children: [
                item.completed,
                "/",
                item.total
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-2", children: /* @__PURE__ */ jsx("div", { className: "flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-primary",
                style: {
                  width: `${item.total > 0 ? item.completed / item.total * 100 : 0}%`
                }
              }
            ) }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-on-surface-variant", children: [
              "Progress: ",
              item.timeSpent
            ] })
          ]
        },
        item.id
      ))
    ] })
  ] });
}
export {
  CurrentPlanProgress
};
