import { jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { ThemeProvider, applyTheme, THEME_STORAGE_KEY } from "@/components/theme-provider";
import "@/app/globals.css";

const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
applyTheme(storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light");

createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(App, {}) }) })
);
