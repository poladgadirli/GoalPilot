"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target, ArrowRight } from "lucide-react";
import { fetchGoals } from "@/lib/api";
function ActiveGoals({ refreshKey = 0 }) {
  const [activeGoals, setActiveGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    let isMounted = true;
    async function loadGoals() {
      try {
        const goals = await fetchGoals();
        if (!isMounted) return;
        setActiveGoals(
          goals.map((goal) => {
            const start = goal.startDate ? new Date(goal.startDate).getTime() : Date.now();
            const end = goal.endDate ? new Date(goal.endDate).getTime() : Date.now();
            const now = Date.now();
            const progress = end > start ? Math.min(100, Math.max(0, Math.round((now - start) / (end - start) * 100))) : 0;
            return {
              id: goal.id.toString(),
              title: goal.title,
              dueDate: goal.endDate ? new Date(goal.endDate).toLocaleDateString(void 0, { month: "short", day: "numeric" }) : "No date",
              progress,
              status: goal.status === "COMPLETED" ? "On Track" : progress > 85 ? "At Risk" : "On Track"
            };
          })
        );
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load goals.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadGoals();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "w-5 h-5 text-primary" }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-on-surface", children: "Active Goals" })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/goals", className: "text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all", children: [
        "View all ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Loading goals..." }) : errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : activeGoals.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "No goals yet." }) : null,
      activeGoals.map((goal) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/goals/${goal.id}`,
          className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:shadow-md transition-all",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-on-surface", children: goal.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-on-surface-variant mt-1", children: [
                  "Due: ",
                  goal.dueDate
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs font-medium ${goal.status === "On Track" ? "bg-green-100/50 text-green-700" : goal.status === "At Risk" ? "bg-orange-100/50 text-orange-700" : "bg-error-container/30 text-error"}`,
                  children: goal.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-surface-container rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-primary transition-all duration-300",
                  style: { width: `${goal.progress}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-on-surface-variant min-w-fit", children: [
                goal.progress,
                "%"
              ] })
            ] })
          ]
        },
        goal.id
      ))
    ] })
  ] });
}
export {
  ActiveGoals
};
