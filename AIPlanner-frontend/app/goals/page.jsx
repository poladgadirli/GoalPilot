"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { fetchGoals } from "@/lib/api";

function GoalsContent() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGoals() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchGoals();
        if (!isMounted) return;
        setGoals(data);
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
  }, []);

  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Goals" }),
      /* @__PURE__ */ jsxs(Link, { to: "/goals/new", className: "flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        "New Goal"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "Loading goals..." }) : null,
    errorMessage ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error", children: errorMessage }) : null,
    !isLoading && !errorMessage && goals.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant", children: "No goals yet." }) : null,
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: goals.map((goal) => /* @__PURE__ */ jsxs(Link, { to: `/goals/${goal.id}`, className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary/30 transition-all", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-on-surface", children: goal.title }),
      goal.description ? /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant mt-1 line-clamp-2", children: goal.description }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-3 text-xs text-on-surface-variant", children: [
        /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-surface-container rounded", children: goal.status ?? "ACTIVE" }),
        /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-surface-container rounded", children: goal.endDate ? `Ends ${new Date(goal.endDate).toLocaleDateString()}` : "No end date" })
      ] })
    ] }, goal.id)) })
  ] });
}

function GoalsPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "Goals", children: /* @__PURE__ */ jsx(GoalsContent, {}) });
}

export default GoalsPage;
