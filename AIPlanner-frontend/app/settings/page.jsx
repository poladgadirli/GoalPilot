"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { PageHeader } from "@/components/common/page-header";
import { AppShell } from "@/components/dashboard/app-shell";
import { useTheme } from "@/components/theme-provider";
import { getStoredUser } from "@/lib/api";

function SettingsContent() {
  const user = getStoredUser();
  const { theme, setTheme } = useTheme();
  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" }
  ];

  return /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Settings", subtitle: "Manage your account and interface preferences" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Appearance" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: themeOptions.map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setTheme(option.value),
          className: `rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${theme === option.value ? "border-primary bg-primary text-primary-foreground" : "border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high"}`,
          "aria-pressed": theme === option.value,
          children: option.label
        },
        option.value
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Account" }),
      user ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-3 rounded-xl", children: [
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Name" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: user.name ?? "Not set" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-3 rounded-xl", children: [
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Username" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: user.username ?? "Not set" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-3 rounded-xl md:col-span-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Email" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: user.email ?? "Not set" })
        ] })
      ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant", children: "No profile is stored for this session." })
    ] })
  ] });
}

function SettingsPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "Settings", children: /* @__PURE__ */ jsx(SettingsContent, {}) });
}

export default SettingsPage;
