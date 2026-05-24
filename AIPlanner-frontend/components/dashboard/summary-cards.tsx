"use client"

import { TrendingUp, Target, Zap } from "lucide-react"

interface SummaryCard {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  color: "blue" | "purple" | "green" | "orange"
}

const summaryCards: SummaryCard[] = [
  {
    label: "Today's Goals",
    value: 5,
    icon: <Target className="w-6 h-6" />,
    trend: 2,
    color: "blue",
  },
  {
    label: "Completed",
    value: 3,
    icon: <TrendingUp className="w-6 h-6" />,
    trend: 1,
    color: "green",
  },
  {
    label: "In Progress",
    value: 2,
    icon: <Zap className="w-6 h-6" />,
    trend: 0,
    color: "orange",
  },
  {
    label: "Time Tracked",
    value: "4.5h",
    icon: <TrendingUp className="w-6 h-6" />,
    trend: 0,
    color: "purple",
  },
]

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    icon: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-800",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-800",
  },
}

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card) => {
        const colors = colorMap[card.color]
        return (
          <div
            key={card.label}
            className={`p-6 rounded-xl border ${colors.bg} ${colors.border} hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <div className={colors.icon}>{card.icon}</div>
              </div>
              {card.trend !== undefined && card.trend > 0 && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  +{card.trend}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-on-surface-variant">{card.label}</p>
            <div className="text-3xl font-semibold mt-2 text-on-surface">{card.value}</div>
          </div>
        )
      })}
    </div>
  )
}
