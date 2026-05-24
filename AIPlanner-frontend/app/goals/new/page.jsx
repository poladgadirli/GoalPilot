"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { AiGoalCreator } from "@/components/dashboard/ai-goal-creator";

function NewGoalContent() {
  const navigate = useNavigate();

  return (
    <section className="max-w-2xl space-y-6">
      <div>
        <Link to="/goals" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to goals
        </Link>
        <h2 className="text-2xl font-serif font-semibold text-on-surface">New Goal</h2>
        <p className="mt-1 text-sm text-on-surface-variant">Create a goal and let AI generate a plan for you.</p>
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
        <AiGoalCreator defaultExpanded onGoalCreated={() => navigate("/goals")} />
      </div>
    </section>
  );
}

function NewGoalPage() {
  return /* @__PURE__ */ jsx(AppShell, { title: "New Goal", children: /* @__PURE__ */ jsx(NewGoalContent, {}) });
}

export default NewGoalPage;
