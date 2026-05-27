"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { Bell, History, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
function Header({ title }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return /* @__PURE__ */ jsxs("header", { className: "flex justify-between items-center px-6 h-16 w-full bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-6 flex-1", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-on-surface", children: title }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: toggleTheme, className: "p-2 hover:bg-surface-container-high rounded-full transition-all active:scale-90 duration-150", "aria-label": isDark ? "Switch to light theme" : "Switch to dark theme", title: isDark ? "Switch to light theme" : "Switch to dark theme", children: isDark ? /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5 text-on-surface-variant" }) : /* @__PURE__ */ jsx(Moon, { className: "w-5 h-5 text-on-surface-variant" }) }),
      /* @__PURE__ */ jsx("button", { className: "p-2 hover:bg-surface-container-high rounded-full transition-all active:scale-90 duration-150", children: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5 text-on-surface-variant" }) }),
      /* @__PURE__ */ jsx("button", { className: "p-2 hover:bg-surface-container-high rounded-full transition-all active:scale-90 duration-150", children: /* @__PURE__ */ jsx(History, { className: "w-5 h-5 text-on-surface-variant" }) }),
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full overflow-hidden border border-outline-variant", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCm8H-GnZE81Qo-Ixgf76kpX1JIFtA3bDvByWZe3kbJsGUeeHTXUhJ4fbcML8Q8H6_V6n9WycCWApLklWGeDv-X6dAVayJcmMXjfzx-4UiuX_dKgn9RqRZfkUpMQQh6UG3Msvshi12VxBJ17VNhHQ1O-Wxu4P6-Ng3CCVM5wC5L-DeUocLJec3v-_uxcPJaNkEmJZ4sGar8bRJLNq1Lrs1HgSEAX-Wjh2JEe24GPY_6i_6YdWGKiGIBBj6AUK5KZsRHhzhNzciElQh",
          alt: "User Profile",
          width: 32,
          height: 32,
          className: "w-full h-full object-cover"
        }
      ) })
    ] })
  ] });
}
export {
  Header
};
