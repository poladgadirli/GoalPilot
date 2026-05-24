"use client"

import { BarChart3 } from "lucide-react"

interface PlanItem {
  id: string
  title: string
  completed: number
  total: number
  timeSpent: string
}

const planProgress: PlanItem[] = [
  {
    id: "1",
    title: "Weekly Sprint Goals",
    completed: 5,
    total: 8,
    timeSpent: "12h 30m",
  },
  {
    id: "2",
    title: "Daily Habits",
    completed: 4,
    total: 5,
    timeSpent: "2h 15m",
  },
  {
    id: "3",
    title: "Project Milestones",
    completed: 2,
    total: 4,
    timeSpent: "8h 45m",
  },
]

export function CurrentPlanProgress() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-on-surface">Current Plan Progress</h2>
      </div>

      <div className="space-y-3">
        {planProgress.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-on-surface">{item.title}</h3>
              <span className="text-xs font-medium text-on-surface-variant">
                {item.completed}/{item.total}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(item.completed / item.total) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-on-surface-variant">Time spent: {item.timeSpent}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
