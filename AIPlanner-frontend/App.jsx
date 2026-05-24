import { jsx, jsxs } from "react/jsx-runtime";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "@/app/page";
import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";

function App() {
  return /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(SignUpPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(DashboardPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard/tasks/:taskId", element: /* @__PURE__ */ jsx(DashboardPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
  ] }) });
}

export default App;
