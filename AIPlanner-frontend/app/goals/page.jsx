"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock, Plus, Search, Target } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { AppShell } from "@/components/dashboard/app-shell";
import { useTranslation } from "@/i18n";
import { fetchGoals, fetchPlanByGoalId } from "@/lib/api";

function formatDate(value, locale, fallback) {
  if (!value) return fallback;
  return new Date(`${value}T12:00:00`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getPlanStats(plan) {
  const tasks = (plan?.days ?? []).flatMap((day) => day.tasks ?? []);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => Boolean(task.completed)).length;
  const progress = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : null;
  return { totalTasks, completedTasks, progress };
}

function getGoalProgress(goal) {
  if (goal.progress !== undefined && goal.progress !== null) return Number(goal.progress);
  if (goal.planStats.progress !== null) return goal.planStats.progress;
  if (goal.status === "COMPLETED") return 100;
  if (goal.status === "ACTIVE") return 0;
  return null;
}

function getStatusLabel(goal) {
  if (goal.status === "COMPLETED") return "completed";
  const progress = getGoalProgress(goal);
  const todayKey = new Date().toISOString().slice(0, 10);
  if (goal.endDate && goal.endDate < todayKey && goal.status !== "COMPLETED") return "behind";
  if (progress === 0) return "notStarted";
  return goal.status === "ACTIVE" ? "onTrack" : "active";
}

function statusClass(label) {
  if (label === "completed") return "bg-green-100/70 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  if (label === "behind") return "bg-error-container/40 text-error";
  if (label === "notStarted") return "bg-surface-container text-on-surface-variant";
  return "bg-secondary-container text-on-secondary-container";
}

function GoalCard({ goal }) {
  const { t, dateLocale } = useTranslation();
  const navigate = useNavigate();
  const progress = getGoalProgress(goal);
  const status = getStatusLabel(goal);
  const progressLabel = progress === null ? "-" : `${progress}%`;

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/goals/${goal.id}`, { state: { from: "/goals" } })}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") navigate(`/goals/${goal.id}`, { state: { from: "/goals" } });
      }}
      className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-on-surface break-words">{goal.title}</h3>
          {goal.description ? (
            <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">{goal.description}</p>
          ) : null}
        </div>
        <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${statusClass(status)}`}>{t(status)}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(goal.endDate, dateLocale, t("noDueDate"))}
        </span>
        {goal.dailyAvailableMinutes ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {goal.dailyAvailableMinutes} min/day
          </span>
        ) : null}
        {goal.planStats.totalTasks > 0 ? (
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {goal.planStats.completedTasks}/{goal.planStats.totalTasks} plan tasks
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-container">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress ?? 0}%` }} />
        </div>
        <span className="w-10 shrink-0 text-right text-xs font-semibold text-on-surface-variant tabular-nums">
          {progressLabel}
        </span>
      </div>

      <Link
        to={`/goals/${goal.id}`}
        state={{ from: "/goals" }}
        onClick={(event) => event.stopPropagation()}
        className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
      >
        {t("viewDetails")}
      </Link>
    </article>
  );
}

function GoalsContent() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const loadGoals = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const goalList = await fetchGoals();
      const goalsWithPlans = await Promise.all(
        goalList.map(async (goal) => {
          const plan = await fetchPlanByGoalId(goal.id);
          return {
            ...goal,
            plan,
            planStats: getPlanStats(plan)
          };
        })
      );
      setGoals(goalsWithPlans);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load goals.");
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
        const goalList = await fetchGoals();
        const goalsWithPlans = await Promise.all(
          goalList.map(async (goal) => {
            const plan = await fetchPlanByGoalId(goal.id);
            return {
              ...goal,
              plan,
              planStats: getPlanStats(plan)
            };
          })
        );
        if (!isMounted) return;
        setGoals(goalsWithPlans);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load goals.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const completed = goals.filter((goal) => goal.status === "COMPLETED").length;
    const progressValues = goals.map(getGoalProgress).filter((value) => value !== null);
    return {
      total: goals.length,
      active: goals.length - completed,
      completed,
      averageProgress: progressValues.length
        ? `${Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)}%`
        : "-"
    };
  }, [goals]);

  const filteredGoals = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return goals
      .filter((goal) => {
        const text = `${goal.title ?? ""} ${goal.description ?? ""}`.toLowerCase();
        const matchesSearch = !normalizedSearch || text.includes(normalizedSearch);
        const matchesStatus = statusFilter === "all"
          || (statusFilter === "active" && goal.status !== "COMPLETED")
          || (statusFilter === "completed" && goal.status === "COMPLETED");
        return matchesSearch && matchesStatus;
      })
      .sort((first, second) => {
        if (sortOption === "oldest") {
          return new Date(first.createdAt ?? 0).getTime() - new Date(second.createdAt ?? 0).getTime();
        }
        if (sortOption === "deadline") {
          const firstDate = first.endDate ? new Date(first.endDate).getTime() : Number.MAX_SAFE_INTEGER;
          const secondDate = second.endDate ? new Date(second.endDate).getTime() : Number.MAX_SAFE_INTEGER;
          return firstDate - secondDate;
        }
        if (sortOption === "progress") {
          return (getGoalProgress(second) ?? -1) - (getGoalProgress(first) ?? -1);
        }
        return new Date(second.createdAt ?? 0).getTime() - new Date(first.createdAt ?? 0).getTime();
      });
  }, [goals, searchTerm, sortOption, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortOption("newest");
  };

  const summaryCards = [
    { label: t("totalGoals"), value: summary.total, variant: "purple", icon: <Target className="h-5 w-5" /> },
    { label: t("activeGoals"), value: summary.active, variant: "blue", icon: <CalendarDays className="h-5 w-5" /> },
    { label: t("completedGoals"), value: summary.completed, variant: "green", icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: t("averageProgress"), value: summary.averageProgress, variant: "purple", icon: <Clock className="h-5 w-5" /> }
  ];
  const hasFilters = searchTerm.trim() || statusFilter !== "all" || sortOption !== "newest";
  const isEmpty = !isLoading && !errorMessage && goals.length === 0;
  const noFilteredResults = !isLoading && !errorMessage && goals.length > 0 && filteredGoals.length === 0;

  return (
    <section className="space-y-6">
      <PageHeader
        title={t("goals")}
        subtitle={t("goalsSubtitle")}
        action={(
          <Link
            to="/goals/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {t("newGoal")}
          </Link>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <StatCard key={card.label} title={card.label} value={card.value} icon={card.icon} variant={card.variant} size="lg" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 lg:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("searchGoals")}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">{t("allStatuses")}</option>
          <option value="active">{t("active")}</option>
          <option value="completed">{t("completed")}</option>
        </select>
        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="newest">{t("newestFirst")}</option>
          <option value="oldest">{t("oldestFirst")}</option>
          <option value="deadline">{t("deadlineSort")}</option>
          <option value="progress">{t("progressSort")}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
          {t("loading")}...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-error">
          <span>{errorMessage}</span>
          <button type="button" onClick={loadGoals} className="text-xs font-semibold text-on-surface hover:underline">
            {t("retry")}
          </button>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
          <Target className="h-6 w-6 text-primary" />
          <h3 className="mt-3 text-lg font-semibold text-on-surface">{t("noGoalsYet")}</h3>
          <p className="mt-2 text-sm text-on-surface-variant">{t("createGoalHelp")}</p>
          <Link
            to="/goals/new"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            {t("createNewGoal")}
          </Link>
        </div>
      ) : null}

      {noFilteredResults ? (
        <div className="flex flex-col gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <span>No goals match your filters.</span>
          <button type="button" onClick={clearFilters} className="self-start rounded-lg bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface sm:self-auto">
            {t("clearFilters")}
          </button>
        </div>
      ) : null}

      {!isLoading && !errorMessage && filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : null}

      {hasFilters && !isLoading && !errorMessage && filteredGoals.length > 0 ? (
        <p className="text-xs text-on-surface-variant">
          Showing {filteredGoals.length} of {goals.length} goals.
        </p>
      ) : null}
    </section>
  );
}

function GoalsPage() {
  return (
    <AppShell title="Goals">
      <GoalsContent />
    </AppShell>
  );
}

export default GoalsPage;
