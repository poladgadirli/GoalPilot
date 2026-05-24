"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Check, Lightbulb } from "lucide-react";
import { completePlanTask, fetchGoals, fetchPlanByGoalId } from "@/lib/api";
function getLocalDateKey(value = /* @__PURE__ */ new Date()) {
  if (typeof value === "string") {
    const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (dateOnly) return dateOnly;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function mapPlanToView(plan, progress, todayTasks) {
  return {
    id: plan.id.toString(),
    title: plan.title,
    tasks: todayTasks.length,
    todayTasks,
    progress: Math.round(progress),
    priority: plan.generationType === "AI" ? "High" : "Medium"
  };
}
function TodaysPlan({ refreshKey = 0 }) {
  const [aiPlans, setAiPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completingTaskIds, setCompletingTaskIds] = useState([]);
  useEffect(() => {
    let isMounted = true;
    async function loadPlans() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const goals = await fetchGoals();
        const today = getLocalDateKey();
        const planResults = await Promise.all(
          goals.map(async (goal) => {
            const plan = await fetchPlanByGoalId(goal.id);
            if (!plan || plan.generationType !== "AI") return null;
            const todayDay = plan.days?.find((day) => getLocalDateKey(day.date) === today);
            const dayTasks = todayDay?.tasks ?? [];
            if (dayTasks.length === 0) return null;
            const completed = dayTasks.filter((task) => task.completed).length;
            const progress = dayTasks.length > 0 ? completed / dayTasks.length * 100 : 0;
            return mapPlanToView(plan, progress, dayTasks);
          })
        );
        if (!isMounted) return;
        setAiPlans(planResults.filter((plan) => plan !== null));
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load plans.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPlans();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  const handleCompletePlanTask = async (planId, taskId) => {
    setCompletingTaskIds((ids) => [...ids, taskId]);
    setErrorMessage(null);
    try {
      const updatedTask = await completePlanTask(taskId);
      setAiPlans((plans) => plans.map((plan) => {
        if (plan.id !== planId) return plan;
        const todayTasks = plan.todayTasks.map((task) => task.id === taskId ? updatedTask : task);
        const completed = todayTasks.filter((task) => task.completed).length;
        return {
          ...plan,
          todayTasks,
          progress: todayTasks.length > 0 ? Math.round(completed / todayTasks.length * 100) : 0
        };
      }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to complete plan task.");
    } finally {
      setCompletingTaskIds((ids) => ids.filter((id) => id !== taskId));
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Lightbulb, { className: "w-5 h-5 text-primary" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-on-surface", children: "Today's AI Plan" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Loading plans..." }) : errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : aiPlans.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "No AI plan tasks scheduled for today." }) : null,
      aiPlans.map((plan) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary/30 transition-all cursor-pointer group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-on-surface group-hover:text-primary transition-colors", children: plan.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-on-surface-variant mt-1", children: [
                  plan.tasks,
                  " tasks included"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-3 py-1 rounded-full text-xs font-medium ${plan.priority === "High" ? "bg-error-container text-error" : plan.priority === "Medium" ? "bg-tertiary-container/20 text-on-tertiary-container" : "bg-surface-container text-on-surface-variant"}`,
                  children: plan.priority
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-on-surface-variant", children: "Progress" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-on-surface", children: [
                  plan.progress,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full h-2 bg-surface-container rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-gradient-to-r from-primary-fixed-dim to-primary transition-all duration-300",
                  style: { width: `${plan.progress}%` }
                }
              ) })
            ] }),
            plan.todayTasks.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: plan.todayTasks.map((task) => {
              const isCompleting = completingTaskIds.includes(task.id);
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => !task.completed && handleCompletePlanTask(plan.id, task.id),
                    disabled: task.completed || isCompleting,
                    className: `flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${task.completed ? "bg-primary border-primary" : "border-outline-variant hover:border-primary"}`,
                    "aria-label": task.completed ? "Plan task completed" : "Complete plan task",
                    children: task.completed && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-on-primary" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: task.completed ? "text-outline line-through" : "text-on-surface", children: task.title })
              ] }, task.id);
            }) })
          ]
        },
        plan.id
      ))
    ] })
  ] });
}
export {
  TodaysPlan
};
