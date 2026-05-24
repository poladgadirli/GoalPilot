"use client"

import { useState } from "react"
import { Plus, Clock, Check } from "lucide-react"
import { CreateTaskModal } from "./create-task-modal"

interface Task {
  id: string
  title: string
  time?: string
  priority: "High" | "Med" | "Low"
  category: string
  completed: boolean
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Quarterly report synthesis",
    time: "10:00 AM",
    priority: "High",
    category: "Work",
    completed: false,
  },
  {
    id: "2",
    title: "Review design system updates",
    time: "Done",
    priority: "Med",
    category: "Work",
    completed: true,
  },
]

interface TaskListProps {
  onTaskSelect?: (taskTitle: string) => void
}

export function TaskList({ onTaskSelect }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const addTask = (title: string, category: string, priority: "High" | "Med" | "Low") => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      time: "Soon",
      priority,
      category,
      completed: false,
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const getPriorityStyles = (priority: string, completed: boolean) => {
    if (completed) return "bg-tertiary-container/10 text-on-tertiary-container"
    switch (priority) {
      case "High":
        return "bg-error-container/10 text-error"
      case "Med":
        return "bg-tertiary-container/10 text-on-tertiary-container"
      default:
        return "bg-surface-container text-on-surface-variant"
    }
  }

  return (
    <section className="lg:col-span-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-semibold">Today&apos;s Tasks</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 duration-200"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4 group hover:border-primary/20 transition-all cursor-pointer"
            onClick={() => !task.completed && onTaskSelect?.(task.title)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleTask(task.id)
              }}
              className={`flex items-center justify-center w-6 h-6 border-2 rounded-md cursor-pointer transition-colors ${
                task.completed
                  ? "border-primary bg-primary"
                  : "border-outline-variant group-hover:border-primary"
              }`}
            >
              {task.completed && <Check className="w-4 h-4 text-on-primary" />}
            </button>
            <div className="flex-1">
              <h3
                className={`text-base font-semibold ${
                  task.completed ? "text-outline line-through" : "text-on-surface"
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-outline flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {task.time}
                </span>
                <span
                  className={`px-2 py-0.5 font-medium rounded-full text-xs ${getPriorityStyles(
                    task.priority,
                    task.completed
                  )}`}
                >
                  {task.priority}
                </span>
                <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-xs">
                  {task.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTask}
      />
    </section>
  )
}
