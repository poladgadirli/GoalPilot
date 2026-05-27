"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { AppShell } from "@/components/dashboard/app-shell";
import { AiGoalCreator } from "@/components/dashboard/ai-goal-creator";

function NewGoalContent() {
  const navigate = useNavigate();

  return (
    <section className="max-w-2xl space-y-6">
      <div className="space-y-3">
        <Link to="/goals" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to goals
        </Link>
        <PageHeader title="New Goal" subtitle="Create a goal and let AI generate a plan for you." />
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
