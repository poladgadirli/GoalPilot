"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Check, Clock, Plus, Star } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { fetchTasksWithParams, updateTask, updateTaskImportant } from "@/lib/api";

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

function ImportantTaskCard({ task, isUpdating, isUpdatingImportant, onComplete, onToggleImportant }) {
  const navigate = useNavigate();
  const completed = isTaskDone(task);
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
          if (!completed) onComplete(task);
        }}
        disabled={completed || isUpdating}
        aria-label={completed ? "Task completed" : "Mark task as complete"}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          completed ? "border-primary bg-primary" : "border-outline-variant hover:border-primary"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {completed ? <Check className="h-3 w-3 text-on-primary" /> : null}
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleImportant(task);
        }}
        disabled={isUpdatingImportant}
        aria-label="Remove from important"
        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Star className="h-4 w-4" style={{ fill: "currentColor" }} />
      </button>

      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold break-words ${completed ? "text-outline line-through" : "text-on-surface"}`}>
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

function ImportantContent({ onTasksChanged }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
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
        important: true
      });
      setTasks((page.content ?? []).filter((task) => task.important));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load important tasks.");
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
          important: true
        });
        if (!isMounted) return;
        setTasks((page.content ?? []).filter((task) => task.important));
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Unable to load important tasks.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCompleteTask = async (task) => {
    setUpdatingTaskIds((ids) => [...ids, task.id]);
    setErrorMessage(null);
    try {
      const updatedTask = await updateTask(task.id, {
        completed: true,
        status: "DONE"
      });
      setTasks((currentTasks) => currentTasks.map((entry) => entry.id === task.id ? updatedTask : entry).filter((entry) => entry.important));
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
      setTasks((currentTasks) => currentTasks.map((entry) => entry.id === task.id ? updatedTask : entry).filter((entry) => entry.important));
      onTasksChanged?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update task importance.");
    } finally {
      setUpdatingImportantIds((ids) => ids.filter((id) => id !== task.id));
    }
  };

  const isEmpty = !isLoading && !errorMessage && tasks.length === 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-on-surface">Important</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Starred tasks that need extra attention</p>
        </div>
        <Link
          to="/tasks/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-sm text-on-surface-variant">
          Loading important tasks...
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

      {isEmpty ? (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
          <h3 className="text-lg font-semibold text-on-surface">No important tasks yet</h3>
          <p className="mt-2 text-sm text-on-surface-variant">
            Star tasks that need extra attention and they will appear here.
          </p>
          <Link
            to="/tasks"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Go to Tasks
          </Link>
        </div>
      ) : null}

      {!isLoading && !errorMessage && tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task) => (
            <ImportantTaskCard
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
    </section>
  );
}

function ImportantPage() {
  return (
    <AppShell title="Important">
      {({ refreshShell }) => <ImportantContent onTasksChanged={refreshShell} />}
    </AppShell>
  );
}

export default ImportantPage;
