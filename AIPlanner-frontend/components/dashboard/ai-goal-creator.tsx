"use client"

import { Sparkles, Plus } from "lucide-react"
import { useState } from "react"

interface Goal {
  title: string
  description: string
}

export function AiGoalCreator() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [goalTitle, setGoalTitle] = useState("")
  const [goalDescription, setGoalDescription] = useState("")

  const suggestedGoals: Goal[] = [
    {
      title: "Weekly Review",
      description: "Analyze this week's performance and plan for next week",
    },
    {
      title: "Focus Block",
      description: "3-hour deep work session for high-priority tasks",
    },
    {
      title: "Team Sync",
      description: "Coordinate with team on project status and blockers",
    },
  ]

  const handleCreateGoal = () => {
    if (goalTitle.trim()) {
      console.log("[v0] Creating goal:", { title: goalTitle, description: goalDescription })
      setGoalTitle("")
      setGoalDescription("")
      setIsExpanded(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-on-surface">AI Goal Creator</h2>
      </div>

      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-gradient-to-r from-primary-fixed-dim/20 to-primary/10 hover:from-primary-fixed-dim/30 hover:to-primary/20 border border-primary/20 p-4 rounded-xl transition-all flex items-center gap-3 text-left"
        >
          <Plus className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-on-surface text-sm">Create new goal</p>
            <p className="text-xs text-on-surface-variant">Let AI help you plan your next objective</p>
          </div>
        </button>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-3">
          <input
            type="text"
            placeholder="What do you want to achieve?"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <textarea
            placeholder="Add details (optional)"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={2}
          />

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCreateGoal}
              className="flex-1 bg-primary text-on-primary font-semibold py-2 rounded-lg hover:opacity-90 transition-all text-sm"
            >
              Create Goal
            </button>
            <button
              onClick={() => {
                setIsExpanded(false)
                setGoalTitle("")
                setGoalDescription("")
              }}
              className="flex-1 bg-surface-container text-on-surface font-semibold py-2 rounded-lg hover:bg-surface-container-high transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-outline-variant">
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Suggested Goals
          </p>
          <div className="space-y-2">
            {suggestedGoals.map((goal, idx) => (
              <button
                key={idx}
                onClick={() => setGoalTitle(goal.title)}
                className="w-full text-left bg-surface-container/50 hover:bg-surface-container p-2 rounded-lg transition-all text-sm"
              >
                <p className="font-medium text-on-surface">{goal.title}</p>
                <p className="text-xs text-on-surface-variant">{goal.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
