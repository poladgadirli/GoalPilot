import { jsx, jsxs } from "react/jsx-runtime";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import SignUpPage from "@/app/page";
import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";
import MyDayPage from "@/app/my-day/page";
import ImportantPage from "@/app/important/page";
import PlannedPage from "@/app/planned/page";
import TasksPage from "@/app/tasks/page";
import NewTaskPage from "@/app/tasks/new/page";
import TaskDetailPage from "@/app/tasks/detail/page";
import CategoriesPage from "@/app/categories/page";
import GoalsPage from "@/app/goals/page";
import NewGoalPage from "@/app/goals/new/page";
import GoalDetailPage from "@/app/goals/detail/page";
import SettingsPage from "@/app/settings/page";
import { isAuthenticated } from "@/lib/api";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true });
  }
  return children;
}

function protectedElement(element) {
  return /* @__PURE__ */ jsx(ProtectedRoute, { children: element });
}

function LegacyTaskRedirect() {
  const params = useParams();
  return /* @__PURE__ */ jsx(Navigate, { to: `/tasks/${params.id}`, replace: true });
}

function App() {
  return /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(SignUpPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: protectedElement(/* @__PURE__ */ jsx(DashboardPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/my-day", element: protectedElement(/* @__PURE__ */ jsx(MyDayPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/important", element: protectedElement(/* @__PURE__ */ jsx(ImportantPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/planned", element: protectedElement(/* @__PURE__ */ jsx(PlannedPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/tasks", element: protectedElement(/* @__PURE__ */ jsx(TasksPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/tasks/new", element: protectedElement(/* @__PURE__ */ jsx(NewTaskPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/tasks/:id", element: protectedElement(/* @__PURE__ */ jsx(TaskDetailPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/categories", element: protectedElement(/* @__PURE__ */ jsx(CategoriesPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/goals", element: protectedElement(/* @__PURE__ */ jsx(GoalsPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/goals/new", element: protectedElement(/* @__PURE__ */ jsx(NewGoalPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/goals/:id", element: protectedElement(/* @__PURE__ */ jsx(GoalDetailPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/settings", element: protectedElement(/* @__PURE__ */ jsx(SettingsPage, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard/tasks/:id", element: protectedElement(/* @__PURE__ */ jsx(LegacyTaskRedirect, {})) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
  ] }) });
}

export default App;
