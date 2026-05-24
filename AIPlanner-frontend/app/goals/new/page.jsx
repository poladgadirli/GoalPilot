"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/dashboard/app-shell";
import { AiGoalCreator } from "@/components/dashboard/ai-goal-creator";

function NewGoalContent() {
  const navigate = useNavigate();

  return /* @__PURE__ */ jsxs("section", { className: "space-y-4 max-w-2xl", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold", children: "New Goal" }),
    /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant", children: /* @__PURE__ */ jsx(AiGoalCreator, { defaultExpanded: true, onGoalCreated: () => navigate("/goals") }) })
  ] });
}

function NewGoalPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "New Goal", children: /* @__PURE__ */ jsx(NewGoalContent, {}) });
}

export default NewGoalPage;
