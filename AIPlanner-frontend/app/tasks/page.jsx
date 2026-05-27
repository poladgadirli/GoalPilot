"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, Check, Clock, Plus, Search, Star } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { AppShell } from "@/components/dashboard/app-shell";
import { fetchTasksWithParams, updateTask, updateTaskImportant } from "@/lib/api";

const priorityRank = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

function getLocalDateKey(value = new Date()) {
  if (!value) return "";
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

function formatDateTime(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleString(void 0, {
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

function TaskCard({ task, isUpdating, isUpdatingImportant, onComplete, onToggleImportant }) {
  const navigate = useNavigate();
  const done = isTaskDone(task);
  const estimated = formatMinutes(task.estimatedMinutes);

  const openTask = () => navigate(`/tasks/${task.id}`);

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
        {task.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{task.description}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDateTime(task.dueDate)}
          </span>
          {task.category?.name ? <span className="px-2 py-1 bg-surface-container rounded">{task.category.name}</span> : null}
          <span className={`px-2 py-1 rounded font-medium ${priorityClass(task.priority)}`}>{task.priority ?? "MEDIUM"}</span>
          <span className="px-2 py-1 bg-surface-container rounded font-medium">{statusLabel(task)}</span>
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

function TasksContent({ onTasksChanged }) {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [updatingTaskIds, setUpdatingTaskIds] = useState([]);
  const [updatingImportantIds, setUpdatingImportantIds] = useState([]);

  const loadTasks = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const page = await fetchTasksWithParams({
        size: 200,
        sortBy: "createdAt",
        direction: "desc",
        categoryId: categoryId || undefined
      });
      setTasks(page.content ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load tasks.");
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
        const page = await fetchTasksWithParams({
          size: 200,
          sortBy: "createdAt",
          direction: "desc",
          categoryId: categoryId || undefined
        });
        if (!isMounted) return;
        setTasks(page.content ?? []);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load tasks.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const summary = useMemo(() => {
    const completed = tasks.filter(isTaskDone).length;
    return {
      total: tasks.length,
      open: tasks.length - completed,
      completed,
      highPriority: tasks.filter((task) => task.priority === "HIGH" && !isTaskDone(task)).length
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = tasks.filter((task) => {
      const dueKey = getLocalDateKey(task.dueDate);
      const done = isTaskDone(task);
      const text = `${task.title ?? ""} ${task.description ?? ""}`.toLowerCase();
      const matchesSearch = !normalizedSearch || text.includes(normalizedSearch);
      const matchesCategory = !categoryId || String(task.category?.id) === categoryId;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      let matchesDate = true;
      if (dateFilter === "none") matchesDate = !task.dueDate;
      if (dateFilter === "today") matchesDate = dueKey === todayKey;
      if (dateFilter === "upcoming") matchesDate = Boolean(dueKey) && dueKey > todayKey && !done;
      if (dateFilter === "overdue") matchesDate = Boolean(dueKey) && dueKey < todayKey && !done;
      return matchesSearch && matchesCategory && matchesStatus(task, statusFilter) && matchesPriority && matchesDate;
    });

    return [...filtered].sort((first, second) => {
      if (sortOption === "oldest") {
        return new Date(first.createdAt ?? 0).getTime() - new Date(second.createdAt ?? 0).getTime();
      }
      if (sortOption === "due") {
        const firstDue = first.dueDate ? new Date(first.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const secondDue = second.dueDate ? new Date(second.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return firstDue - secondDue;
      }
      if (sortOption === "priority") {
        return (priorityRank[second.priority] ?? 0) - (priorityRank[first.priority] ?? 0);
      }
      return new Date(second.createdAt ?? 0).getTime() - new Date(first.createdAt ?? 0).getTime();
    });
  }, [categoryId, dateFilter, priorityFilter, searchTerm, sortOption, statusFilter, tasks, todayKey]);

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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDateFilter("all");
    setSortOption("newest");
  };

  const summaryCards = [
    { label: "Total Tasks", value: summary.total, variant: "blue", icon: <CalendarDays className="h-5 w-5" /> },
    { label: "Open Tasks", value: summary.open, variant: "orange", icon: <Clock className="h-5 w-5" /> },
    { label: "Completed", value: summary.completed, variant: "green", icon: <Check className="h-5 w-5" /> },
    { label: "High Priority", value: summary.highPriority, variant: "red", icon: <Star className="h-5 w-5" /> }
  ];

  const hasFilters = categoryId || searchTerm.trim() || statusFilter !== "all" || priorityFilter !== "all" || dateFilter !== "all" || sortOption !== "newest";
  const noTasks = !isLoading && !errorMessage && tasks.length === 0;
  const noFilteredResults = !isLoading && !errorMessage && tasks.length > 0 && filteredTasks.length === 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-on-surface">Tasks</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Manage all your manual tasks</p>
        </div>
        <Link
          to="/tasks/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <StatCard key={card.label} title={card.label} value={card.value} icon={card.icon} variant={card.variant} />
        ))}
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant grid grid-cols-1 xl:grid-cols-[1fr_auto_auto_auto_auto] gap-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title or description"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All statuses</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All dates</option>
          <option value="none">No due date</option>
          <option value="today">Due today</option>
          <option value="upcoming">Upcoming</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {categoryId ? (
        <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant flex flex-col gap-2 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <span>Showing tasks in selected category.</span>
          <Link to="/tasks" className="self-start text-xs font-semibold text-primary hover:underline sm:self-auto">
            View all tasks
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
          Loading tasks...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-error flex items-center justify-between gap-3">
          <span>{errorMessage}</span>
          <button type="button" onClick={loadTasks} className="text-xs font-semibold text-on-surface hover:underline">
            Retry
          </button>
        </div>
      ) : null}

      {noTasks ? (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
          <h3 className="text-lg font-semibold text-on-surface">No tasks yet</h3>
          <p className="mt-2 text-sm text-on-surface-variant">Create your first task to start organizing your work.</p>
          <Link
            to="/tasks/new"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Create Task
          </Link>
        </div>
      ) : null}

      {noFilteredResults ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col gap-3 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <span>No tasks match your filters.</span>
          <button type="button" onClick={clearFilters} className="self-start rounded-lg bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface sm:self-auto">
            Clear filters
          </button>
        </div>
      ) : null}

      {!isLoading && !errorMessage && filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isUpdating={updatingTaskIds.includes(task.id)}
              isUpdatingImportant={updatingImportantIds.includes(task.id)}
              onComplete={handleCompleteTask}
              onToggleImportant={handleToggleImportant}
            />
          ))}
        </div>
      ) : null}

      {hasFilters && !isLoading && !errorMessage && filteredTasks.length > 0 ? (
        <p className="text-xs text-on-surface-variant">
          Showing {filteredTasks.length} of {tasks.length} tasks.
        </p>
      ) : null}
    </section>
  );
}

function TasksPage() {
  return (
    <AppShell title="Tasks">
      {({ refreshShell }) => <TasksContent onTasksChanged={refreshShell} />}
    </AppShell>
  );
}

export default TasksPage;
