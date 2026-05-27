"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, CalendarDays, Check, Clock, Plus, Sparkles, Star } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { AppShell } from "@/components/dashboard/app-shell";
import { useTranslation } from "@/i18n";
import { fetchGoals, fetchPlanByGoalId, fetchTasksWithParams, setPlanTaskCompletion, updateTask, updateTaskImportant } from "@/lib/api";

function getLocalDateKey(value = new Date()) {
  if (typeof value === "string") {
    const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (dateOnly) return dateOnly;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isTaskDone(task) {
  return Boolean(task.completed) || task.status === "DONE";
}

function formatTodayLabel(locale) {
  return new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function formatDueDate(value, locale, fallback) {
  if (!value) return fallback;
  return new Date(value).toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatMinutes(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function priorityClass(priority) {
  switch (priority) {
    case "HIGH":
      return "bg-error-container/50 text-error";
    case "LOW":
      return "bg-surface-container text-on-surface-variant";
    default:
      return "bg-secondary-container text-on-secondary-container";
  }
}

function CheckboxButton({ checked, disabled, isUpdating, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isUpdating}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
        checked ? "border-primary bg-primary" : "border-outline-variant hover:border-primary"
      } disabled:cursor-not-allowed disabled:opacity-60`}
      aria-label={label}
    >
      {checked ? <Check className="h-3 w-3 text-on-primary" /> : null}
    </button>
  );
}

function ManualTaskRow({ task, isUpdating, isUpdatingImportant, onComplete, onToggleImportant, enumLabel, dateLocale, t }) {
  const navigate = useNavigate();
  const completed = isTaskDone(task);
  const estimated = formatMinutes(task.estimatedMinutes);

  const openTask = () => navigate(`/tasks/${task.id}`, { state: { from: "/my-day" } });

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openTask}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openTask();
      }}
      className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-start gap-3 hover:border-primary/30 transition-all cursor-pointer"
    >
      <CheckboxButton
        checked={completed}
        disabled={completed}
        isUpdating={isUpdating}
        label={completed ? "Task completed" : "Mark task as complete"}
        onClick={(event) => {
          event.stopPropagation();
          if (!completed) onComplete(task);
        }}
      />
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleImportant(task);
        }}
        disabled={isUpdatingImportant}
        aria-label={task.important ? "Remove from important" : "Mark as important"}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors ${
          task.important ? "text-primary" : "text-on-surface-variant hover:text-primary"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <Star className="h-4 w-4" style={{ fill: task.important ? "currentColor" : "none" }} />
      </button>
      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold break-words ${completed ? "text-outline line-through" : "text-on-surface"}`}>
          {task.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          {task.category?.name ? <span className="px-2 py-1 bg-surface-container rounded">{task.category.name}</span> : null}
          <span className={`px-2 py-1 rounded font-medium ${priorityClass(task.priority)}`}>{enumLabel(task.priority ?? "MEDIUM")}</span>
          {estimated ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {estimated}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDueDate(task.dueDate, dateLocale, t("noDueDate"))}
          </span>
        </div>
      </div>
    </div>
  );
}

function PlanTaskRow({ task, isUpdating, onToggle }) {
  const completed = Boolean(task.completed);
  const estimated = formatMinutes(task.estimatedMinutes);

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-start gap-3">
      <CheckboxButton
        checked={completed}
        disabled={false}
        isUpdating={isUpdating}
        label={completed ? "Mark AI plan task incomplete" : "Complete AI plan task"}
        onClick={() => onToggle(task, !completed)}
      />
      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold break-words ${completed ? "text-outline line-through" : "text-on-surface"}`}>
          {task.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          {task.goalTitle ? <span className="px-2 py-1 bg-surface-container rounded">{task.goalTitle}</span> : null}
          {estimated ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {estimated}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MyDayContent({ onTasksChanged }) {
  const { t, enumLabel, dateLocale } = useTranslation();
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const [manualTasks, setManualTasks] = useState([]);
  const [planTasks, setPlanTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updatingManualIds, setUpdatingManualIds] = useState([]);
  const [updatingImportantIds, setUpdatingImportantIds] = useState([]);
  const [updatingPlanIds, setUpdatingPlanIds] = useState([]);

  const loadDay = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [tasksPage, goals] = await Promise.all([
        fetchTasksWithParams({ size: 200, sortBy: "dueDate", direction: "asc" }),
        fetchGoals()
      ]);
      setManualTasks(tasksPage.content ?? []);

      const planResults = await Promise.all(
        goals.map(async (goal) => {
          const plan = await fetchPlanByGoalId(goal.id);
          const today = plan?.days?.find((day) => getLocalDateKey(day.date) === todayKey);
          return (today?.tasks ?? []).map((task) => ({
            ...task,
            goalId: goal.id,
            goalTitle: goal.title
          }));
        })
      );
      setPlanTasks(planResults.flat());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load My Day.");
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
        const [tasksPage, goals] = await Promise.all([
          fetchTasksWithParams({ size: 200, sortBy: "dueDate", direction: "asc" }),
          fetchGoals()
        ]);
        if (!isMounted) return;
        setManualTasks(tasksPage.content ?? []);

        const planResults = await Promise.all(
          goals.map(async (goal) => {
            const plan = await fetchPlanByGoalId(goal.id);
            const today = plan?.days?.find((day) => getLocalDateKey(day.date) === todayKey);
            return (today?.tasks ?? []).map((task) => ({
              ...task,
              goalId: goal.id,
              goalTitle: goal.title
            }));
          })
        );
        if (!isMounted) return;
        setPlanTasks(planResults.flat());
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load My Day.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [todayKey]);

  const todayManualTasks = manualTasks.filter((task) => getLocalDateKey(task.dueDate) === todayKey);
  const overdueTasks = manualTasks.filter((task) => {
    const dueKey = getLocalDateKey(task.dueDate);
    return dueKey && dueKey < todayKey && !isTaskDone(task);
  });
  const completedToday = todayManualTasks.filter(isTaskDone).length + planTasks.filter((task) => task.completed).length;
  const estimatedMinutes = [...todayManualTasks, ...planTasks].reduce(
    (total, task) => total + (Number(task.estimatedMinutes) || 0),
    0
  );
  const isEmpty = !isLoading && !errorMessage && todayManualTasks.length === 0 && planTasks.length === 0 && overdueTasks.length === 0;

  const handleCompleteManualTask = async (task) => {
    setUpdatingManualIds((ids) => [...ids, task.id]);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTask(task.id, {
        completed: true,
        status: "DONE"
      });
      setManualTasks((tasks) => tasks.map((entry) => entry.id === task.id ? updatedTask : entry));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to complete task.");
    } finally {
      setUpdatingManualIds((ids) => ids.filter((id) => id !== task.id));
    }
  };

  const handleToggleImportant = async (task) => {
    setUpdatingImportantIds((ids) => [...ids, task.id]);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTaskImportant(task.id, !task.important);
      setManualTasks((tasks) => tasks.map((entry) => entry.id === task.id ? updatedTask : entry));
      onTasksChanged?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update task importance.");
    } finally {
      setUpdatingImportantIds((ids) => ids.filter((id) => id !== task.id));
    }
  };

  const handleSetPlanTaskCompletion = async (task, completed) => {
    setUpdatingPlanIds((ids) => [...ids, task.id]);
    setErrorMessage(null);
    try {
      const updatedTask = await setPlanTaskCompletion(task.id, completed);
      setPlanTasks((tasks) => tasks.map((entry) => entry.id === task.id ? { ...entry, ...updatedTask } : entry));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update AI plan task.");
    } finally {
      setUpdatingPlanIds((ids) => ids.filter((id) => id !== task.id));
    }
  };

  const summaryCards = [
    { label: t("dueToday"), value: todayManualTasks.length, variant: "blue", icon: <CalendarDays className="h-5 w-5" /> },
    { label: t("completedToday"), value: completedToday, variant: "green", icon: <Check className="h-5 w-5" /> },
    { label: t("overdue"), value: overdueTasks.length, variant: "red", icon: <AlertTriangle className="h-5 w-5" /> },
    { label: t("estimatedTime"), value: formatMinutes(estimatedMinutes) ?? "0 min", variant: "purple", icon: <Clock className="h-5 w-5" /> }
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title={t("myDay")}
        subtitle={formatTodayLabel(dateLocale)}
        action={(
          <Link
            to="/tasks/new"
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {t("newTask")}
          </Link>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <StatCard key={card.label} title={card.label} value={card.value} icon={card.icon} variant={card.variant} size="lg" />
        ))}
      </div>

      {isLoading ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
          {t("loading")}...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error flex items-center justify-between gap-3">
          <span>{errorMessage}</span>
          <button type="button" onClick={loadDay} className="text-xs font-semibold text-on-surface hover:underline">
            {t("retry")}
          </button>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
          <h3 className="text-lg font-semibold text-on-surface">{t("dayClear")}</h3>
          <p className="mt-2 text-sm text-on-surface-variant">
            {t("dayClearHelp")}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link to="/tasks/new" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary">
              {t("newTask")}
            </Link>
            <Link to="/goals/new" className="inline-flex items-center justify-center rounded-lg bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface">
              {t("createNewGoal")}
            </Link>
          </div>
        </div>
      ) : null}

      {!isEmpty && !isLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-on-surface">{t("todaysManualTasks")}</h3>
                <span className="text-xs text-on-surface-variant">{todayManualTasks.length} tasks</span>
              </div>
              {todayManualTasks.length === 0 ? (
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
                  No manual tasks due today.
                </div>
              ) : (
                <div className="space-y-2">
                  {todayManualTasks.map((task) => (
                    <ManualTaskRow
                      key={task.id}
                      task={task}
                      isUpdating={updatingManualIds.includes(task.id)}
                      isUpdatingImportant={updatingImportantIds.includes(task.id)}
                      onComplete={handleCompleteManualTask}
                      onToggleImportant={handleToggleImportant}
                      enumLabel={enumLabel}
                      dateLocale={dateLocale}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </section>

            {overdueTasks.length > 0 ? (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-error" />
                  <h3 className="text-lg font-semibold text-on-surface">{t("overdue")}</h3>
                </div>
                <div className="space-y-2">
                  {overdueTasks.map((task) => (
                    <Link
                      key={task.id}
                      to={`/tasks/${task.id}`}
                      state={{ from: "/my-day" }}
                      className="block bg-error-container/20 p-4 rounded-xl border border-error/20 hover:border-error/40 transition-all"
                    >
                      <h4 className="font-semibold text-on-surface">{task.title}</h4>
                      <p className="mt-1 text-xs text-on-surface-variant">{t("dueDate")} {formatDueDate(task.dueDate, dateLocale, t("noDueDate"))}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-on-surface">{t("todaysAiPlanTasks")}</h3>
            </div>
            {planTasks.length === 0 ? (
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
                No AI plan tasks scheduled for today.
              </div>
            ) : (
              <div className="space-y-2">
                {planTasks.map((task) => (
                  <PlanTaskRow
                    key={task.id}
                    task={task}
                    isUpdating={updatingPlanIds.includes(task.id)}
                    onToggle={handleSetPlanTaskCompletion}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </section>
  );
}

function MyDayPage() {
  return (
    <AppShell title="My Day">
      {({ refreshShell }) => <MyDayContent onTasksChanged={refreshShell} />}
    </AppShell>
  );
}

export default MyDayPage;
