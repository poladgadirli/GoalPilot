"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

function AppShell({ title, children, refreshKey = 0 }) {
  const navigate = useNavigate();
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  const combinedRefreshKey = refreshKey + localRefreshKey;

  const handleTaskSelect = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const refreshShell = () => {
    setLocalRefreshKey((key) => key + 1);
  };

  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Sidebar, { onTaskSelect: handleTaskSelect, refreshKey: combinedRefreshKey }),
    /* @__PURE__ */ jsxs("div", { className: "ml-[260px] min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, { title }),
      /* @__PURE__ */ jsx("main", { className: "p-6 max-w-[1280px] mx-auto w-full flex flex-col gap-6", children: typeof children === "function" ? children({ refreshShell }) : children })
    ] })
  ] });
}

export {
  AppShell
};
