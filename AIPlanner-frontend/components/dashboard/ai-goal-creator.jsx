"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Plus } from "lucide-react";
import { useTranslation } from "@/i18n";
import {
  createGoal,
  createGoalRecommendation,
  generateAiPlan
} from "@/lib/api";
function AiGoalCreator({ onGoalCreated, defaultExpanded = false, createPath }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const suggestedGoals = [
    {
      title: "Weekly Review",
      description: "Analyze this week's performance and plan for next week"
    },
    {
      title: "Focus Block",
      description: "3-hour deep work session for high-priority tasks"
    },
    {
      title: "Team Sync",
      description: "Coordinate with team on project status and blockers"
    }
  ];
  const handleCreateGoal = async () => {
    if (!goalTitle.trim()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const recommendation = await createGoalRecommendation(goalTitle.trim(), goalDescription.trim());
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const goal = await createGoal({
        recommendationId: recommendation.recommendationId,
        startDate: today,
        durationDays: Math.max(recommendation.minimumRecommendedDays, 7),
        dailyAvailableMinutes: Math.max(recommendation.minimumRecommendedMinutes, 60)
      });
      await generateAiPlan(goal.id);
      setGoalTitle("");
      setGoalDescription("");
      setIsExpanded(false);
      setSuccessMessage("Goal created and AI plan generated.");
      onGoalCreated?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create goal.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-primary" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-on-surface", children: t("aiGoalCreator") })
    ] }),
    successMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 px-3 py-2 rounded-lg", children: successMessage }) : null,
    !isExpanded ? /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => createPath ? navigate(createPath) : setIsExpanded(true),
        className: "w-full bg-gradient-to-r from-primary-fixed-dim/20 to-primary/10 hover:from-primary-fixed-dim/30 hover:to-primary/20 border border-primary/20 p-4 rounded-xl transition-all flex items-center gap-3 text-left",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5 text-primary flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-on-surface text-sm", children: t("createNewGoal") }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant", children: t("aiGoalHelp") })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "What do you want to achieve?",
          value: goalTitle,
          onChange: (e) => setGoalTitle(e.target.value),
          className: "w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          placeholder: "Add details (optional)",
          value: goalDescription,
          onChange: (e) => setGoalDescription(e.target.value),
          className: "w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          rows: 2
        }
      ),
      errorMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-error", children: errorMessage }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCreateGoal,
            disabled: isSubmitting || !goalTitle.trim(),
            className: "flex-1 bg-primary text-on-primary font-semibold py-2 rounded-lg hover:opacity-90 transition-all text-sm disabled:opacity-50",
            children: isSubmitting ? `${t("create")}...` : t("createNewGoal")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setIsExpanded(false);
              setGoalTitle("");
              setGoalDescription("");
              setErrorMessage(null);
            },
            disabled: isSubmitting,
            className: "flex-1 bg-surface-container text-on-surface font-semibold py-2 rounded-lg hover:bg-surface-container-high transition-all text-sm",
            children: t("cancel")
          }
        )
      ] })
    ] }),
    isExpanded && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-outline-variant", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-on-surface-variant uppercase tracking-wider", children: "Suggested Goals" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: suggestedGoals.map((goal) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setGoalTitle(goal.title);
            setGoalDescription(goal.description);
          },
          className: "w-full text-left bg-surface-container/50 hover:bg-surface-container p-2 rounded-lg transition-all text-sm",
          children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-on-surface", children: goal.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant", children: goal.description })
          ]
        },
        goal.title
      )) })
    ] })
  ] });
}
export {
  AiGoalCreator
};
