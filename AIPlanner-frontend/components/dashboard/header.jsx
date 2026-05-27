"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { languageOptions, useTranslation } from "@/i18n";
import { getStoredUser, logout, USER_UPDATED_EVENT } from "@/lib/api";

function getInitials(user) {
  const source = user?.name || user?.username || user?.email || "Account";
  return source
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";
}

function Header({ title }) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const languageRef = useRef(null);
  const accountRef = useRef(null);
  const isDark = theme === "dark";
  const titleMap = {
    Dashboard: "dashboard",
    Goals: "goals",
    "My Day": "myDay",
    Important: "important",
    Planned: "planned",
    Tasks: "tasks",
    Categories: "categories",
    Settings: "settings",
    "New Task": "newTask",
    "Task Details": "taskDetails",
    "New Goal": "newGoal",
    "Goal Details": "goalDetails"
  };
  const displayTitle = titleMap[title] ? t(titleMap[title]) : title;
  const accountName = user?.name || user?.username || t("account");

  useEffect(() => {
    function handleUserUpdated(event) {
      setUser(event.detail ?? getStoredUser());
    }

    function handlePointerDown(event) {
      if (!languageRef.current?.contains(event.target)) {
        setIsLanguageOpen(false);
      }

      if (!accountRef.current?.contains(event.target)) {
        setIsAccountOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
        setIsAccountOpen(false);
      }
    }

    window.addEventListener(USER_UPDATED_EVENT, handleUserUpdated);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener(USER_UPDATED_EVENT, handleUserUpdated);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAccountOpen(false);
    navigate("/login");
  };

  const handleLanguageSelect = (nextLanguage) => {
    setLanguage(nextLanguage);
    setIsLanguageOpen(false);
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 sticky top-0 z-30">
      <div className="flex flex-1 items-center gap-6">
        <h1 className="text-xl font-semibold text-on-surface">{displayTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div ref={languageRef} className="relative">
          <button
            type="button"
            onClick={() => setIsLanguageOpen((open) => !open)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Change language"
            aria-expanded={isLanguageOpen}
            aria-haspopup="menu"
          >
            {t("language")}
            <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
          </button>

          {isLanguageOpen ? (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg">
              {languageOptions.map((option) => {
                const isSelected = language === option.code;

                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => handleLanguageSelect(option.code)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary-container text-on-primary-container"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <Check className={`h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full p-2 transition-all duration-150 hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-90"
          aria-label={isDark ? t("light") : t("dark")}
          title={isDark ? t("light") : t("dark")}
        >
          {isDark ? <Sun className="h-5 w-5 text-on-surface-variant" /> : <Moon className="h-5 w-5 text-on-surface-variant" />}
        </button>

        <div ref={accountRef} className="relative">
          <button
            type="button"
            onClick={() => setIsAccountOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label={t("account")}
            aria-expanded={isAccountOpen}
            aria-haspopup="menu"
          >
            {getInitials(user)}
          </button>

          {isAccountOpen ? (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg">
              <div className="border-b border-outline-variant px-3 py-3">
                <p className="truncate text-sm font-semibold text-on-surface">{accountName}</p>
                {user?.email ? <p className="mt-1 truncate text-xs text-on-surface-variant">{user.email}</p> : null}
              </div>
              <div className="py-2">
                <Link
                  to="/settings"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                >
                  <Settings className="h-4 w-4" />
                  {t("settings")}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-error transition-colors hover:bg-error-container/30"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export {
  Header
};
