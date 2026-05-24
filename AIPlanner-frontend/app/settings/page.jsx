"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { AppShell } from "@/components/dashboard/app-shell";
import { getStoredUser } from "@/lib/api";

function SettingsContent() {
  const user = getStoredUser();

  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Settings" }),
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
