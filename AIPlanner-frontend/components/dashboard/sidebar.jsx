"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import {
  Sun,
  Star,
  Calendar,
  CheckSquare,
  ChevronRight,
  Settings,
  Search
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fetchCategories, fetchTasks, getStoredUser, logout } from "@/lib/api";
function Sidebar({ onTaskSelect, refreshKey = 0 }) {
  const navigate = useNavigate();
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [mainItems, setMainItems] = useState([
    { icon: /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }), label: "My Day", count: 0, path: "/my-day" },
    { icon: /* @__PURE__ */ jsx(Star, { className: "w-5 h-5" }), label: "Important", count: 0, path: "/important" },
    { icon: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }), label: "Planned", count: 0, path: "/planned" },
    { icon: /* @__PURE__ */ jsx(CheckSquare, { className: "w-5 h-5" }), label: "Tasks", count: 0, path: "/tasks" }
  ]);
  const [categories, setCategories] = useState([]);
  const user = getStoredUser();
  useEffect(() => {
    let isMounted = true;
    async function loadSidebarData() {
      try {
        const [tasksPage, categoryList] = await Promise.all([fetchTasks(50), fetchCategories()]);
        if (!isMounted) return;
        const tasks = tasksPage.content ?? [];
        const openTasks = tasks.filter((task) => !task.completed);
        const importantTasks = tasks.filter((task) => task.priority === "HIGH");
        const plannedTasks = tasks.filter((task) => Boolean(task.dueDate));
        setMainItems([
          { icon: /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }), label: "My Day", count: openTasks.length, path: "/my-day" },
          { icon: /* @__PURE__ */ jsx(Star, { className: "w-5 h-5" }), label: "Important", count: importantTasks.length, path: "/important" },
          { icon: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }), label: "Planned", count: plannedTasks.length, path: "/planned" },
          { icon: /* @__PURE__ */ jsx(CheckSquare, { className: "w-5 h-5" }), label: "Tasks", count: tasks.length, path: "/tasks" }
        ]);
        const categoryMap = /* @__PURE__ */ new Map();
        for (const category of categoryList) {
          categoryMap.set(category.id, {
            id: category.id,
            label: category.name,
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
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return /* @__PURE__ */ jsxs("aside", { className: "fixed left-0 top-0 h-full w-[260px] flex flex-col py-4 z-40 bg-surface border-r border-outline-variant", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary", children: "AI Planner" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-on-surface-variant", children: "Intelligent Management" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant hover:text-on-surface transition-colors", children: /* @__PURE__ */ jsx(Search, { className: "w-5 h-5" }) })
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
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: item.label })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-outline group-hover:text-primary", children: item.count })
          ] })
        },
        item.label
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
        /* @__PURE__ */ jsx(NavLink, { to: "/categories", className: ({ isActive }) => `flex-1 px-2 py-2 rounded-r-lg text-sm font-bold transition-colors ${isActive ? "bg-secondary-container text-on-surface" : "text-on-surface-variant hover:bg-surface-container-high"}`, children: "Categories" })
        ] }),
        categoriesExpanded && /* @__PURE__ */ jsx("div", { className: "ml-4 space-y-1", children: categories.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-4 py-2 text-xs text-on-surface-variant", children: "No categories yet" }) : categories.map((category) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => toggleCategory(category.id),
              className: "w-full flex items-center justify-between px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors group",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    ChevronRight,
                    {
                      className: `w-4 h-4 transition-transform duration-200 ${expandedCategories.includes(category.id) ? "rotate-90" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: category.label })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-outline", children: category.count })
              ]
            }
          ),
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
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Settings" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 mt-4 border-t border-outline-variant px-4 flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold truncate", children: user?.name ?? "Guest" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-outline truncate", children: user?.email ?? "Not signed in" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleLogout,
            className: "text-xs text-primary font-semibold hover:underline flex-shrink-0",
            children: "Log out"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-4 pb-2", children: /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-xs text-on-surface-variant hover:text-primary", children: "Switch account" }) })
    ] })
  ] });
}
export {
  Sidebar
};
