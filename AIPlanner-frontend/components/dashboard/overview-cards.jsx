"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { TrendingUp } from "lucide-react";
const cards = [
  {
    label: "Total Tasks",
    value: 24,
    extra: /* @__PURE__ */ jsxs("span", { className: "text-sm text-on-error-container font-medium flex items-center gap-1", children: [
      "+4 ",
      /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4" })
    ] })
  },
  {
    label: "Completed",
    value: 18,
    extra: /* @__PURE__ */ jsx("div", { className: "h-2 w-24 bg-surface-container rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary w-[75%]" }) })
  },
  {
    label: "Pending",
    value: 6,
    extra: /* @__PURE__ */ jsx("span", { className: "text-sm text-outline", children: "On track" })
  },
  {
    label: "High Priority",
    value: 3,
    extra: /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-error-container text-on-error-container rounded-full text-xs font-medium", children: "Urgent" })
  }
];
function OverviewCards() {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: cards.map((card) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:-translate-y-1 hover:shadow-md transition-all duration-200",
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-on-surface-variant", children: card.label }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-semibold", children: card.value }),
          card.extra
        ] })
      ]
    },
    card.label
  )) });
}
export {
  OverviewCards
};
