"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "@/components/dashboard/app-shell";
import { fetchGoalById, fetchPlanByGoalId } from "@/lib/api";

function GoalDetailContent() {
  const params = useParams();
  const [goal, setGoal] = useState(null);
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGoal() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const loadedGoal = await fetchGoalById(params.id);
        const loadedPlan = await fetchPlanByGoalId(params.id);
        if (!isMounted) return;
        setGoal(loadedGoal);
        setPlan(loadedPlan);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load goal.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadGoal();
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold", children: isLoading ? "Loading goal..." : goal?.title ?? "Goal Details" }),
      /* @__PURE__ */ jsx(Link, { to: "/goals", className: "text-primary text-sm font-semibold hover:underline", children: "Back to goals" })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Loading goal..." }) : null,
    errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : null,
    !isLoading && !errorMessage && !goal ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Goal not found." }) : null,
    goal ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2", children: "Description" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface", children: goal.description || "No description added." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-3 rounded-xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Start" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: goal.startDate ?? "Not set" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-3 rounded-xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "End" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: goal.endDate ?? "Not set" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-3 rounded-xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Daily minutes" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: goal.dailyAvailableMinutes ?? 0 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-3 rounded-xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Status" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: goal.status ?? "ACTIVE" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3", children: "Plan" }),
        plan ? /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-on-surface-variant", children: [
          /* @__PURE__ */ jsx("p", { className: "text-on-surface font-semibold", children: plan.title }),
          /* @__PURE__ */ jsxs("p", { children: [plan.totalDays ?? 0, " days"] }),
          /* @__PURE__ */ jsxs("p", { children: [plan.days?.reduce((sum, day) => sum + (day.tasks?.length ?? 0), 0) ?? 0, " tasks"] })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant", children: "No plan connected yet." })
      ] })
    ] }) : null
  ] });
}

function GoalDetailPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "Goal Details", children: /* @__PURE__ */ jsx(GoalDetailContent, {}) });
}

export default GoalDetailPage;
