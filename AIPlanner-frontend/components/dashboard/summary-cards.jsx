"use client";
import { jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TrendingUp, Target, Zap } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { useTranslation } from "@/i18n";
import { fetchGoals, fetchTasks } from "@/lib/api";
function SummaryCards({ refreshKey = 0 }) {
  const { t } = useTranslation();
  const [summaryCards, setSummaryCards] = useState([
    { labelKey: "activeGoals", value: "-", icon: /* @__PURE__ */ jsx(Target, { className: "w-6 h-6" }), color: "blue" },
    { labelKey: "completedTasks", value: "-", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "green" },
    { labelKey: "openTasks", value: "-", icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }), color: "orange" },
    { labelKey: "estimatedTime", value: "-", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "purple" }
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
          { labelKey: "activeGoals", value: goals.length, icon: /* @__PURE__ */ jsx(Target, { className: "w-6 h-6" }), color: "blue" },
          { labelKey: "completedTasks", value: completedTasks, icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "green" },
          { labelKey: "openTasks", value: openTasks, icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }), color: "orange" },
          { labelKey: "estimatedTime", value: estimatedHours, icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6" }), color: "purple" }
        ]);
      } catch {
        if (!isMounted) return;
      setSummaryCards((cards) => cards.map((card) => ({ ...card, value: "-" })));
      }
    }
    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: summaryCards.map((card) => /* @__PURE__ */ jsx(
    StatCard,
    {
      title: t(card.labelKey),
      value: card.value,
      icon: card.icon,
      variant: card.color,
      trend: card.trend,
      size: "lg"
    },
    card.labelKey
  )) });
}
export {
  SummaryCards
};
