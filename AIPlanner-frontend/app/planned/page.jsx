"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, CalendarDays, Check, Clock, Plus, Search, Star } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { AppShell } from "@/components/dashboard/app-shell";
import { useTranslation } from "@/i18n";
import { fetchTasksWithParams, updateTask, updateTaskImportant } from "@/lib/api";

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

function addDaysKey(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return getLocalDateKey(date);
}

function isTaskDone(task) {
  return Boolean(task.completed) || task.status === "DONE";
}

function formatDateTime(value, locale, fallback) {
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

function statusLabel(task) {
  if (isTaskDone(task)) return "DONE";
  return task.status ?? "TODO";
}

function matchesStatus(task, statusFilter) {
  if (statusFilter === "all") return true;
  if (statusFilter === "DONE") return isTaskDone(task);
  return !isTaskDone(task) && statusLabel(task) === statusFilter;
}

function isInNextWeek(dueKey, todayKey) {
  const weekEndKey = addDaysKey(7);
  return dueKey >= todayKey && dueKey <= weekEndKey;
}

function TaskCard({ task, isUpdating, isUpdatingImportant, onComplete, onToggleImportant, enumLabel, dateLocale, t }) {
  const navigate = useNavigate();
  const done = isTaskDone(task);
  const estimated = formatMinutes(task.estimatedMinutes);

  const openTask = () => navigate(`/tasks/${task.id}`, { state: { from: "/planned" } });

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
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (!done) onComplete(task);
        }}
        disabled={done || isUpdating}
        aria-label={done ? "Task completed" : "Mark task as complete"}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          done ? "border-primary bg-primary" : "border-outline-variant hover:border-primary"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {done ? <Check className="h-3 w-3 text-on-primary" /> : null}
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleImportant(task);
        }}
        disabled={isUpdatingImportant}
        aria-label={task.important ? "Remove from important" : "Mark as important"}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded transition-colors ${
          task.important ? "text-primary" : "text-on-surface-variant hover:text-primary"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <Star className="h-4 w-4" style={{ fill: task.important ? "currentColor" : "none" }} />
      </button>

      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold break-words ${done ? "text-outline line-through" : "text-on-surface"}`}>
          {task.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDateTime(task.dueDate, dateLocale, t("noDueDate"))}
          </span>
          {task.category?.name ? <span className="px-2 py-1 bg-surface-container rounded">{task.category.name}</span> : null}
          <span className={`px-2 py-1 rounded font-medium ${priorityClass(task.priority)}`}>{enumLabel(task.priority ?? "MEDIUM")}</span>
          <span className="px-2 py-1 bg-surface-container rounded font-medium">{enumLabel(statusLabel(task))}</span>
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

function PlannedContent({ onTasksChanged }) {
  const { t, enumLabel, dateLocale } = useTranslation();
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const tomorrowKey = useMemo(() => addDaysKey(1), []);
  const weekEndKey = useMemo(() => addDaysKey(7), []);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [updatingTaskIds, setUpdatingTaskIds] = useState([]);
  const [updatingImportantIds, setUpdatingImportantIds] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadTasks() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const page = await fetchTasksWithParams({ size: 200, sortBy: "dueDate", direction: "asc" });
        if (!isMounted) return;
        setTasks((page.content ?? []).filter((task) => Boolean(task.dueDate)));
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load planned tasks.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const openTasks = tasks.filter((task) => !isTaskDone(task));
    return {
      planned: tasks.length,
      today: openTasks.filter((task) => getLocalDateKey(task.dueDate) === todayKey).length,
      upcoming: openTasks.filter((task) => getLocalDateKey(task.dueDate) > todayKey).length,
      overdue: openTasks.filter((task) => getLocalDateKey(task.dueDate) < todayKey).length
    };
  }, [tasks, todayKey]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return tasks.filter((task) => {
      const dueKey = getLocalDateKey(task.dueDate);
      const matchesSearch = !normalizedSearch || task.title.toLowerCase().includes(normalizedSearch);
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      let matchesDate = true;
      if (dateFilter === "today") matchesDate = dueKey === todayKey;
      if (dateFilter === "week") matchesDate = isInNextWeek(dueKey, todayKey);
      if (dateFilter === "overdue") matchesDate = dueKey < todayKey && !isTaskDone(task);
      return matchesSearch && matchesStatus(task, statusFilter) && matchesPriority && matchesDate;
    });
  }, [dateFilter, priorityFilter, searchTerm, statusFilter, tasks, todayKey]);

  const groups = useMemo(() => {
    const grouped = {
      overdue: [],
      today: [],
      tomorrow: [],
      week: [],
      later: []
    };
    for (const task of filteredTasks) {
      const dueKey = getLocalDateKey(task.dueDate);
      if (dueKey < todayKey) grouped.overdue.push(task);
      else if (dueKey === todayKey) grouped.today.push(task);
      else if (dueKey === tomorrowKey) grouped.tomorrow.push(task);
      else if (dueKey <= weekEndKey) grouped.week.push(task);
      else grouped.later.push(task);
    }
    return [
      { key: "overdue", title: t("overdue"), tasks: grouped.overdue },
      { key: "today", title: t("today"), tasks: grouped.today },
      { key: "tomorrow", title: t("tomorrow"), tasks: grouped.tomorrow },
      { key: "week", title: t("thisWeek"), tasks: grouped.week },
      { key: "later", title: t("later"), tasks: grouped.later }
    ].filter((group) => group.tasks.length > 0);
  }, [filteredTasks, todayKey, tomorrowKey, weekEndKey]);

  const handleCompleteTask = async (task) => {
    setUpdatingTaskIds((ids) => [...ids, task.id]);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTask(task.id, {
        completed: true,
        status: "DONE"
      });
      setTasks((currentTasks) => currentTasks.map((entry) => entry.id === task.id ? updatedTask : entry));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update task.");
    } finally {
      setUpdatingTaskIds((ids) => ids.filter((id) => id !== task.id));
    }
  };

  const handleToggleImportant = async (task) => {
    setUpdatingImportantIds((ids) => [...ids, task.id]);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTaskImportant(task.id, !task.important);
      setTasks((currentTasks) => currentTasks.map((entry) => entry.id === task.id ? updatedTask : entry));
      onTasksChanged?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update task importance.");
    } finally {
      setUpdatingImportantIds((ids) => ids.filter((id) => id !== task.id));
    }
  };

  const summaryCards = [
    { label: t("plannedTasks"), value: summary.planned, variant: "blue", icon: <CalendarDays className="h-5 w-5" /> },
    { label: t("dueToday"), value: summary.today, variant: "purple", icon: <Clock className="h-5 w-5" /> },
    { label: t("upcoming"), value: summary.upcoming, variant: "green", icon: <Check className="h-5 w-5" /> },
    { label: t("overdue"), value: summary.overdue, variant: "red", icon: <AlertTriangle className="h-5 w-5" /> }
  ];

  const hasFilters = searchTerm.trim() || statusFilter !== "all" || priorityFilter !== "all" || dateFilter !== "all";
  const noPlannedTasks = !isLoading && !errorMessage && tasks.length === 0;
  const noFilteredResults = !isLoading && !errorMessage && tasks.length > 0 && groups.length === 0;

  return (
    <section className="space-y-6">
      <PageHeader
        title={t("planned")}
        subtitle={t("plannedSubtitle")}
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

      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("searchTitleDescription")}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">{t("allStatuses")}</option>
          <option value="TODO">{t("todo")}</option>
          <option value="IN_PROGRESS">{t("inProgress")}</option>
          <option value="DONE">{t("done")}</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">{t("allPriorities")}</option>
          <option value="LOW">{t("low")}</option>
          <option value="MEDIUM">{t("medium")}</option>
          <option value="HIGH">{t("high")}</option>
        </select>
        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">{t("plannedTasks")}</option>
          <option value="today">{t("today")}</option>
          <option value="week">{t("thisWeek")}</option>
          <option value="overdue">{t("overdue")}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
          {t("loading")}...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      {noPlannedTasks ? (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
          <h3 className="text-lg font-semibold text-on-surface">{t("noPlannedTasks")}</h3>
          <p className="mt-2 text-sm text-on-surface-variant">{t("addDueDates")}</p>
          <Link
            to="/tasks/new"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            {t("create")}
          </Link>
        </div>
      ) : null}

      {noFilteredResults ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
          {t("noTasksMatch")}
        </div>
      ) : null}

      {!isLoading && !errorMessage && groups.length > 0 ? (
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.key} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-on-surface">{group.title}</h3>
                <span className="text-xs text-on-surface-variant">
                  {group.tasks.length} {group.tasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>
              <div className="space-y-2">
                {group.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isUpdating={updatingTaskIds.includes(task.id)}
                    isUpdatingImportant={updatingImportantIds.includes(task.id)}
                    onComplete={handleCompleteTask}
                    onToggleImportant={handleToggleImportant}
                    enumLabel={enumLabel}
                    dateLocale={dateLocale}
                    t={t}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {hasFilters && !isLoading && !errorMessage && groups.length > 0 ? (
        <p className="text-xs text-on-surface-variant">
          Showing {filteredTasks.length} of {tasks.length} planned tasks.
        </p>
      ) : null}
    </section>
  );
}

function PlannedPage() {
  return (
    <AppShell title="Planned">
      {({ refreshShell }) => <PlannedContent onTasksChanged={refreshShell} />}
    </AppShell>
  );
}

export default PlannedPage;
