"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TrendingUp, Target, Zap } from "lucide-react";
import { fetchGoals, fetchTasks } from "@/lib/api";
const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-800"
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    icon: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-800"
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-800"
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-800"
  }
};
function SummaryCards({ refreshKey = 0 }) {
  const [summaryCards, setSummaryCards] = useState([
    { label: "Active Goals", value: "-", icon: /* @__PURE__ */ jsx(Target, { className: "w-6 h-6" }), color: "blue" },
    { label: "Completed Tasks", value: "-", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "green" },
    { label: "Open Tasks", value: "-", icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }), color: "orange" },
    { label: "Estimated Time", value: "-", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "purple" }
  ]);
  useEffect(() => {
    let isMounted = true;
    async function loadSummary() {
      try {
        const [tasksPage, goals] = await Promise.all([fetchTasks(), fetchGoals()]);
        if (!isMounted) return;
        const tasks = tasksPage.content ?? [];
        const completedTasks = tasks.filter((task) => task.completed).length;
        const openTasks = tasks.length - completedTasks;
        const estimatedMinutes = tasks.reduce((sum, task) => sum + (task.estimatedMinutes ?? 0), 0);
        const estimatedHours = estimatedMinutes > 0 ? `${Math.round(estimatedMinutes / 60 * 10) / 10}h` : "0h";
        setSummaryCards([
          { label: "Active Goals", value: goals.length, icon: /* @__PURE__ */ jsx(Target, { className: "w-6 h-6" }), color: "blue" },
          { label: "Completed Tasks", value: completedTasks, icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "green" },
          { label: "Open Tasks", value: openTasks, icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }), color: "orange" },
          { label: "Estimated Time", value: estimatedHours, icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "purple" }
        ]);
      } catch {
        if (!isMounted) return;
        setSummaryCards((cards) => cards.map((card) => ({ ...card, value: "Login needed" })));
      }
    }
    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: summaryCards.map((card) => {
    const colors = colorMap[card.color];
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `p-6 rounded-xl border ${colors.bg} ${colors.border} hover:shadow-md transition-all duration-200`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${colors.bg}`, children: /* @__PURE__ */ jsx("div", { className: colors.icon, children: card.icon }) }),
            card.trend !== void 0 && card.trend > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-green-600 dark:text-green-400", children: [
              "+",
              card.trend
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-on-surface-variant", children: card.label }),
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-semibold mt-2 text-on-surface", children: card.value })
        ]
      },
      card.label
    );
  }) });
}
export {
  SummaryCards
};
