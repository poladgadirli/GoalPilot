"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, Clock, Target, Trash2 } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { AppShell } from "@/components/dashboard/app-shell";
import { useTranslation } from "@/i18n";
import { deleteGoal, fetchGoalById, fetchPlanByGoalId, setPlanTaskCompletion } from "@/lib/api";

function formatDate(value, locale, fallback) {
  if (!value) return fallback;
  return new Date(`${value}T12:00:00`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getPlanTasks(plan) {
  return (plan?.days ?? []).flatMap((day) => day.tasks ?? []);
}

function getPlanStats(plan) {
  const tasks = getPlanTasks(plan);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => Boolean(task.completed)).length;
  const progress = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : null;
  return { totalTasks, completedTasks, progress };
}

function statusLabel(goal, progress) {
  if (goal?.status === "COMPLETED") return "completed";
  if (progress === 0) return "notStarted";
  return goal?.status === "ACTIVE" ? "onTrack" : "active";
}

function getGoalBackTarget(from) {
  return from === "/dashboard" ? "/dashboard" : "/goals";
}

function GoalDetailContent() {
  const { t, dateLocale } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTarget = getGoalBackTarget(location.state?.from);
  const [goal, setGoal] = useState(null);
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingPlanTaskIds, setUpdatingPlanTaskIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadGoal = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [loadedGoal, loadedPlan] = await Promise.all([
        fetchGoalById(params.id),
        fetchPlanByGoalId(params.id)
      ]);
      setGoal(loadedGoal);
      setPlan(loadedPlan);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load goal.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [loadedGoal, loadedPlan] = await Promise.all([
          fetchGoalById(params.id),
          fetchPlanByGoalId(params.id)
        ]);
        if (!isMounted) return;
        setGoal(loadedGoal);
        setPlan(loadedPlan);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load goal.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const stats = useMemo(() => getPlanStats(plan), [plan]);
  const progress = stats.progress ?? (goal?.status === "COMPLETED" ? 100 : goal?.status === "ACTIVE" ? 0 : null);
  const progressLabel = progress === null ? "-" : `${progress}%`;

  const handleDelete = async () => {
    if (!goal || !window.confirm("Delete this goal? This cannot be undone.")) return;
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await deleteGoal(goal.id);
      navigate("/goals");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete goal.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetPlanTaskCompletion = async (taskId, completed) => {
    setUpdatingPlanTaskIds((ids) => [...ids, taskId]);
    setErrorMessage(null);
    try {
      const updatedTask = await setPlanTaskCompletion(taskId, completed);
      setPlan((currentPlan) => {
        if (!currentPlan) return currentPlan;
        return {
          ...currentPlan,
          days: (currentPlan.days ?? []).map((day) => ({
            ...day,
            tasks: (day.tasks ?? []).map((task) => task.id === taskId ? updatedTask : task)
          }))
        };
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update plan task.");
    } finally {
      setUpdatingPlanTaskIds((ids) => ids.filter((id) => id !== taskId));
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to={backTarget} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            {t("goals")}
          </Link>
          <h2 className="text-xl font-semibold text-on-surface">
            {isLoading ? `${t("loading")}...` : goal?.title ?? t("goals")}
          </h2>
          {goal?.description ? <p className="mt-1 text-sm text-on-surface-variant">{goal.description}</p> : null}
        </div>
        {goal ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container px-3 py-2 text-sm font-semibold text-error transition-all hover:bg-error-container/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? `${t("delete")}...` : t("delete")}
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
          {t("loading")}...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-error">
          <span>{errorMessage}</span>
          <button type="button" onClick={loadGoal} className="text-xs font-semibold text-on-surface hover:underline">
            {t("retry")}
          </button>
        </div>
      ) : null}

      {!isLoading && !errorMessage && !goal ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
          Goal not found.
        </div>
      ) : null}

      {goal ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title={t("status")} value={t(statusLabel(goal, progress))} variant="blue" icon={<Target className="h-5 w-5" />} />
            <StatCard title={t("deadline")} value={formatDate(goal.endDate, dateLocale, t("noDueDate"))} variant="purple" icon={<CalendarDays className="h-5 w-5" />} />
            <StatCard title={t("estimatedTime")} value={`${goal.dailyAvailableMinutes ?? 0} min`} variant="orange" icon={<Clock className="h-5 w-5" />} />
            <StatCard title={t("plannedTasks")} value={`${stats.completedTasks}/${stats.totalTasks}`} variant="green" icon={<Check className="h-5 w-5" />} />
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-on-surface">{t("progress")}</h3>
              </div>
              <span className="text-sm font-semibold text-on-surface-variant">{progressLabel}</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress ?? 0}%` }} />
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-on-surface">AI Plan</h3>
              {plan?.totalDays ? <span className="text-xs text-on-surface-variant">{plan.totalDays} days</span> : null}
            </div>

            {!plan ? (
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
                No plan connected yet.
              </div>
            ) : (
              <div className="space-y-3">
                {(plan.days ?? []).map((day) => (
                  <article key={day.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-on-surface">{day.title ?? `Day ${day.dayNumber}`}</h4>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
                          {formatDate(day.date, dateLocale, t("noDueDate"))}
                        </p>
                      </div>
                      {day.restDay ? <span className="rounded bg-surface-container px-2 py-1 text-xs text-on-surface-variant">Rest day</span> : null}
                    </div>
                    {day.description ? <p className="mt-2 text-sm text-on-surface-variant">{day.description}</p> : null}
                    {(day.tasks ?? []).length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {day.tasks.map((task) => (
                          <div key={task.id} className="flex items-start gap-3 rounded-lg bg-surface-container-low p-3">
                            <button
                              type="button"
                              onClick={() => handleSetPlanTaskCompletion(task.id, !task.completed)}
                              disabled={updatingPlanTaskIds.includes(task.id)}
                              aria-label={task.completed ? "Mark plan task incomplete" : "Complete plan task"}
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              task.completed ? "border-primary bg-primary" : "border-outline-variant"
                            }`}>
                              {task.completed ? <Check className="h-3 w-3 text-on-primary" /> : null}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium ${task.completed ? "text-outline line-through" : "text-on-surface"}`}>{task.title}</p>
                              {task.description ? <p className="mt-1 text-xs text-on-surface-variant">{task.description}</p> : null}
                            </div>
                            {task.estimatedMinutes ? (
                              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-on-surface-variant">
                                <Clock className="h-3.5 w-3.5" />
                                {task.estimatedMinutes} min
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-on-surface-variant">No tasks scheduled for this day.</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}

function GoalDetailPage() {
  return (
    <AppShell title="Goal Details">
      <GoalDetailContent />
    </AppShell>
  );
}

export default GoalDetailPage;
