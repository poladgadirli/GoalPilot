"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";
import { createGoal, generatePlanForGoal, getGoalRecommendation } from "@/lib/api";

const today = () => new Date().toISOString().slice(0, 10);

function AiGoalCreator({ onGoalCreated, defaultExpanded = false, createPath }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [dailyAvailableMinutes, setDailyAvailableMinutes] = useState(60);
  const [startDate, setStartDate] = useState(today());
  const [recommendation, setRecommendation] = useState(null);
  const [durationDays, setDurationDays] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const resetForm = () => {
    setGoalTitle("");
    setGoalDescription("");
    setDailyAvailableMinutes(60);
    setStartDate(today());
    setRecommendation(null);
    setDurationDays("");
    setErrorMessage(null);
  };

  const handleGetRecommendation = async () => {
    if (!goalTitle.trim() || !startDate || dailyAvailableMinutes <= 0) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await getGoalRecommendation({
        title: goalTitle.trim(),
        description: goalDescription.trim(),
        dailyAvailableMinutes: Number(dailyAvailableMinutes),
        startDate
      });
      setRecommendation(result);
      setDurationDays(String(result.minimumRecommendedDays));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to get AI recommendation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGoal = async () => {
    const selectedDurationDays = Number(durationDays);
    if (!recommendation || selectedDurationDays < recommendation.minimumRecommendedDays) {
      setErrorMessage(`Duration must be at least ${recommendation?.minimumRecommendedDays ?? 1} days.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const goal = await createGoal({
        title: goalTitle.trim(),
        description: goalDescription.trim(),
        startDate,
        durationDays: selectedDurationDays,
        dailyAvailableMinutes: Number(dailyAvailableMinutes),
        minimumRecommendedDays: recommendation.minimumRecommendedDays,
        minimumRecommendedMinutes: recommendation.minimumRecommendedMinutes
      });
      await generatePlanForGoal(goal.id);
      resetForm();
      setIsExpanded(false);
      setSuccessMessage("Goal created and AI plan generated.");
      onGoalCreated?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create goal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-on-surface">{t("aiGoalCreator")}</h2>
      </div>

      {successMessage && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{successMessage}</p>}

      {!isExpanded ? (
        <button
          onClick={() => createPath ? navigate(createPath) : setIsExpanded(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary-fixed-dim/20 to-primary/10 p-4 text-left transition-all hover:from-primary-fixed-dim/30 hover:to-primary/20"
        >
          <Plus className="w-5 h-5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-on-surface">{t("createNewGoal")}</p>
            <p className="text-xs text-on-surface-variant">{t("aiGoalHelp")}</p>
          </div>
        </button>
      ) : (
        <div className="space-y-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-on-surface">Step 1: Goal details</p>
            <input type="text" placeholder="What do you want to achieve?" value={goalTitle} onChange={(event) => setGoalTitle(event.target.value)} disabled={Boolean(recommendation)} className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60" />
            <textarea placeholder="Add details (optional)" value={goalDescription} onChange={(event) => setGoalDescription(event.target.value)} disabled={Boolean(recommendation)} rows={3} className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-on-surface">
                <span>Daily available minutes</span>
                <input type="number" min="1" step="1" value={dailyAvailableMinutes} onChange={(event) => setDailyAvailableMinutes(event.target.value)} disabled={Boolean(recommendation)} className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60" />
              </label>
              <label className="space-y-1 text-sm text-on-surface">
                <span>Start date</span>
                <input type="date" min={today()} value={startDate} onChange={(event) => setStartDate(event.target.value)} disabled={Boolean(recommendation)} className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60" />
              </label>
            </div>
            {!recommendation && (
              <button onClick={handleGetRecommendation} disabled={isSubmitting || !goalTitle.trim() || !startDate || Number(dailyAvailableMinutes) <= 0} className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-on-primary transition-all hover:opacity-90 disabled:opacity-50">
                {isSubmitting ? "Getting recommendation..." : "Get AI recommendation"}
              </button>
            )}
          </div>

          {recommendation && (
            <div className="space-y-3 border-t border-outline-variant pt-4">
              <p className="text-sm font-semibold text-on-surface">Step 2: Confirm duration</p>
              <div className="rounded-lg bg-surface-container p-3 text-sm text-on-surface">
                <p><strong>Minimum recommended days:</strong> {recommendation.minimumRecommendedDays}</p>
                <p><strong>Minimum recommended total minutes:</strong> {recommendation.minimumRecommendedMinutes}</p>
                <p className="mt-2 text-on-surface-variant">{recommendation.reason}</p>
              </div>
              <label className="block space-y-1 text-sm text-on-surface">
                <span>Duration days</span>
                <input type="number" min={recommendation.minimumRecommendedDays} step="1" value={durationDays} onChange={(event) => setDurationDays(event.target.value)} className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </label>
              {Number(durationDays) < recommendation.minimumRecommendedDays && <p className="text-sm text-error">Duration must be at least {recommendation.minimumRecommendedDays} days.</p>}
              <div className="flex gap-2">
                <button onClick={handleCreateGoal} disabled={isSubmitting || Number(durationDays) < recommendation.minimumRecommendedDays} className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-on-primary transition-all hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? "Creating plan..." : "Create goal and generate plan"}
                </button>
                <button onClick={() => { setRecommendation(null); setDurationDays(""); setErrorMessage(null); }} disabled={isSubmitting} className="rounded-lg bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high">
                  Edit details
                </button>
              </div>
            </div>
          )}

          {errorMessage && <p className="text-sm text-error">{errorMessage}</p>}
          <button onClick={() => { resetForm(); setIsExpanded(false); }} disabled={isSubmitting} className="w-full rounded-lg bg-surface-container py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high">
            {t("cancel")}
          </button>
        </div>
      )}
    </section>
  );
}

export { AiGoalCreator };
