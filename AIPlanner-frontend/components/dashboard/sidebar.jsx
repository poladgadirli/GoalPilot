"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import {
  Sun,
  LayoutDashboard,
  Star,
  Calendar,
  CheckSquare,
  ChevronRight,
  Settings,
  Target
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { fetchCategories, fetchGoals, fetchTasks, fetchTasksWithParams, getStoredUser } from "@/lib/api";
const fallbackCategoryColor = "#64748B";
function getCategoryColor(color) {
  if (typeof color !== "string") return fallbackCategoryColor;
  const trimmed = color.trim();
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(trimmed) ? trimmed : fallbackCategoryColor;
}
function Sidebar({ onTaskSelect, refreshKey = 0 }) {
  const { t } = useTranslation();
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [mainItems, setMainItems] = useState([
    { icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5" }), labelKey: "dashboard", count: null, path: "/dashboard" },
    { icon: /* @__PURE__ */ jsx(Target, { className: "w-5 h-5" }), labelKey: "goals", count: 0, path: "/goals" },
    { icon: /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }), labelKey: "myDay", count: 0, path: "/my-day" },
    { icon: /* @__PURE__ */ jsx(Star, { className: "w-5 h-5" }), labelKey: "important", count: 0, path: "/important" },
    { icon: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }), labelKey: "planned", count: 0, path: "/planned" },
    { icon: /* @__PURE__ */ jsx(CheckSquare, { className: "w-5 h-5" }), labelKey: "tasks", count: 0, path: "/tasks" }
  ]);
  const [categories, setCategories] = useState([]);
  const user = getStoredUser();
  useEffect(() => {
    let isMounted = true;
    async function loadSidebarData() {
      try {
        const [tasksPage, importantTasksPage, goalList, categoryList] = await Promise.all([
          fetchTasks(200),
          fetchTasksWithParams({ size: 1, important: true }),
          fetchGoals(),
          fetchCategories()
        ]);
        if (!isMounted) return;
        const tasks = tasksPage.content ?? [];
        const openTasks = tasks.filter((task) => !task.completed);
        const importantCount = importantTasksPage.totalElements ?? (importantTasksPage.content ?? []).length;
        const plannedTasks = tasks.filter((task) => Boolean(task.dueDate));
        setMainItems([
          { icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5" }), labelKey: "dashboard", count: null, path: "/dashboard" },
          { icon: /* @__PURE__ */ jsx(Target, { className: "w-5 h-5" }), labelKey: "goals", count: goalList.length, path: "/goals" },
          { icon: /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }), labelKey: "myDay", count: openTasks.length, path: "/my-day" },
          { icon: /* @__PURE__ */ jsx(Star, { className: "w-5 h-5" }), labelKey: "important", count: importantCount, path: "/important" },
          { icon: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }), labelKey: "planned", count: plannedTasks.length, path: "/planned" },
          { icon: /* @__PURE__ */ jsx(CheckSquare, { className: "w-5 h-5" }), labelKey: "tasks", count: tasks.length, path: "/tasks" }
        ]);
        const categoryMap = /* @__PURE__ */ new Map();
        for (const category of categoryList) {
          categoryMap.set(category.id, {
            id: category.id,
            label: category.name,
            color: category.color,
            count: 0,
            tasks: []
          });
        }
        for (const task of tasks) {
          if (!task.category) continue;
          const entry = categoryMap.get(task.category.id);
          if (!entry) continue;
          entry.count += 1;
          entry.tasks.push({ id: task.id, name: task.title });
        }
        setCategories(Array.from(categoryMap.values()));
      } catch {
        if (!isMounted) return;
        setCategories([]);
      }
    }
    loadSidebarData();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  const toggleCategory = (id) => {
    setExpandedCategories(
      (prev) => prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    );
  };
  return /* @__PURE__ */ jsxs("aside", { className: "fixed left-0 top-0 h-full w-[260px] flex flex-col py-4 z-40 bg-surface border-r border-outline-variant", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary", children: "AI Planner" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-on-surface-variant", children: t("appSubtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex-1 px-1 overflow-y-auto space-y-1", children: [
      mainItems.map((item) => /* @__PURE__ */ jsx(
        NavLink,
        {
          to: item.path,
          className: ({ isActive }) => `flex items-center justify-between px-4 py-2 rounded-lg group transition-colors ${isActive ? "bg-secondary-container text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container-high"}`,
          children: /* @__PURE__ */ jsxs("span", { className: "contents", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              item.icon,
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: t(item.labelKey) })
            ] }),
            item.count !== null ? /* @__PURE__ */ jsx("span", { className: "text-xs text-outline group-hover:text-primary", children: item.count }) : /* @__PURE__ */ jsx("span", { className: "w-4" })
          ] })
        },
        item.labelKey
      )),
      /* @__PURE__ */ jsx("div", { className: "pt-4 pb-2 px-4", children: /* @__PURE__ */ jsx("div", { className: "h-px bg-outline-variant w-full" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setCategoriesExpanded(!categoriesExpanded),
            className: "pl-4 pr-1 py-2 rounded-l-lg text-on-surface-variant hover:bg-surface-container-high transition-colors group",
            children: /* @__PURE__ */ jsx(
                ChevronRight,
                {
                  className: `w-5 h-5 transition-transform duration-200 ${categoriesExpanded ? "rotate-90" : ""}`
                }
              ),
          }
        ),
        /* @__PURE__ */ jsx(NavLink, { to: "/categories", className: ({ isActive }) => `flex-1 px-2 py-2 rounded-r-lg text-sm font-bold transition-colors ${isActive ? "bg-secondary-container text-on-surface" : "text-on-surface-variant hover:bg-surface-container-high"}`, children: t("categories") })
        ] }),
        categoriesExpanded && /* @__PURE__ */ jsx("div", { className: "ml-4 space-y-1", children: categories.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-4 py-2 text-xs text-on-surface-variant", children: "No categories yet" }) : categories.map((category) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors group", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleCategory(category.id),
                className: "p-2",
                "aria-label": `${expandedCategories.includes(category.id) ? "Collapse" : "Expand"} ${category.label}`,
                children: /* @__PURE__ */ jsx(
                  ChevronRight,
                  {
                    className: `w-4 h-4 transition-transform duration-200 ${expandedCategories.includes(category.id) ? "rotate-90" : ""}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs(
              NavLink,
              {
                to: `/tasks?categoryId=${category.id}`,
                className: ({ isActive }) => `flex min-w-0 flex-1 items-center justify-between gap-2 py-2 pr-3 text-sm font-medium ${isActive && window.location.search === `?categoryId=${category.id}` ? "text-on-surface font-semibold" : ""}`,
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 flex-shrink-0 rounded-full border border-outline-variant", style: { backgroundColor: getCategoryColor(category.color) } }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: category.label })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-outline group-hover:text-primary", children: category.count })
                ]
              }
            )
          ] }),
          expandedCategories.includes(category.id) && category.tasks.length > 0 && /* @__PURE__ */ jsx("div", { className: "ml-8 space-y-1", children: category.tasks.map((task) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onTaskSelect?.(task.id),
              className: "block w-full text-left px-4 py-1 text-sm text-on-surface-variant hover:text-primary border-l border-outline-variant ml-2 transition-colors",
              children: task.name
            },
            task.id
          )) })
        ] }, category.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-auto px-1 space-y-1", children: [
      /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/settings",
          className: ({ isActive }) => `flex items-center gap-4 pl-4 py-2 transition-colors rounded-lg ${isActive ? "bg-secondary-container text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container-high"}`,
          children: [
            /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t("settings") })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "pt-6 mt-4 border-t border-outline-variant px-4", children:
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold truncate", children: user?.name ?? "Guest" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-outline truncate", children: user?.email ?? "Not signed in" })
        ] })
      })
    ] })
  ] });
}
export {
  Sidebar
};
