"use client";
import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "ai-planner-theme";
const ThemeContext = createContext(null);

function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;
}

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: (nextTheme) => {
      if (nextTheme === "dark" || nextTheme === "light") {
        setThemeState(nextTheme);
      }
    },
    toggleTheme: () => {
      setThemeState((currentTheme) => currentTheme === "dark" ? "light" : "dark");
    }
  }), [theme]);

  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export {
  THEME_STORAGE_KEY,
  ThemeProvider,
  applyTheme,
  useTheme
};
