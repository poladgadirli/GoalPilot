"use client"

import { Target, ArrowRight } from "lucide-react"

interface Goal {
  id: string
  title: string
  dueDate: string
  progress: number
  status: "On Track" | "At Risk" | "Behind"
}

const activeGoals: Goal[] = [
  {
    id: "1",
    title: "Complete Product Launch",
    dueDate: "May 31",
    progress: 75,
    status: "On Track",
  },
  {
    id: "2",
    title: "Q2 Revenue Target",
    dueDate: "June 30",
    progress: 45,
    status: "On Track",
  },
  {
    id: "3",
    title: "Team Expansion",
    dueDate: "April 15",
    progress: 20,
    status: "At Risk",
  },
]

export function ActiveGoals() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-on-surface">Active Goals</h2>
        </div>
        <button className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {activeGoals.map((goal) => (
          <div
            key={goal.id}
            className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-on-surface">{goal.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1">Due: {goal.dueDate}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  goal.status === "On Track"
                    ? "bg-green-100/50 text-green-700"
                    : goal.status === "At Risk"
                      ? "bg-orange-100/50 text-orange-700"
                      : "bg-error-container/30 text-error"
                }`}
              >
                {goal.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-on-surface-variant min-w-fit">
                {goal.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
