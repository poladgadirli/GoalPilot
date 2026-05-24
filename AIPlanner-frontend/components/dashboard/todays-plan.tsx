"use client"

import { Lightbulb, Sparkles } from "lucide-react"

interface AiPlan {
  id: string
  title: string
  tasks: number
  progress: number
  priority: "High" | "Medium" | "Low"
}

const aiPlans: AiPlan[] = [
  {
    id: "1",
    title: "Q1 Planning: Strategic Roadmap",
    tasks: 8,
    progress: 65,
    priority: "High",
  },
  {
    id: "2",
    title: "Weekly Review & Analysis",
    tasks: 5,
    progress: 40,
    priority: "Medium",
  },
]

export function TodaysPlan() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-on-surface">Today&apos;s AI Plan</h2>
      </div>

      <div className="space-y-3">
        {aiPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {plan.title}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">{plan.tasks} tasks included</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.priority === "High"
                    ? "bg-error-container text-error"
                    : plan.priority === "Medium"
                      ? "bg-tertiary-container/20 text-on-tertiary-container"
                      : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {plan.priority}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Progress</span>
                <span className="text-xs font-semibold text-on-surface">{plan.progress}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-fixed-dim to-primary transition-all duration-300"
                  style={{ width: `${plan.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
