"use client"

import { Clock, Check } from "lucide-react"

interface ManualTask {
  id: string
  title: string
  time: string
  category: string
  completed: boolean
}

const recentManualTasks: ManualTask[] = [
  {
    id: "1",
    title: "Design system review",
    time: "2 hours ago",
    category: "Design",
    completed: true,
  },
  {
    id: "2",
    title: "Client presentation prep",
    time: "4 hours ago",
    category: "Work",
    completed: true,
  },
  {
    id: "3",
    title: "Code review for PR #234",
    time: "1 day ago",
    category: "Development",
    completed: false,
  },
  {
    id: "4",
    title: "Team standup notes",
    time: "2 days ago",
    category: "Meeting",
    completed: true,
  },
]

export function RecentManualTasks() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-on-surface">Recent Manual Tasks</h2>

      <div className="space-y-2">
        {recentManualTasks.map((task) => (
          <div
            key={task.id}
            className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant flex items-center gap-3 group hover:border-primary/20 transition-all"
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                task.completed
                  ? "bg-primary border-primary"
                  : "border-outline-variant group-hover:border-primary"
              }`}
            >
              {task.completed && <Check className="w-3 h-3 text-on-primary" />}
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-medium truncate ${
                  task.completed ? "text-outline line-through" : "text-on-surface"
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant">
                <Clock className="w-3 h-3" />
                {task.time}
              </div>
            </div>

            <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-xs font-medium flex-shrink-0">
              {task.category}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
