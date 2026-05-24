"use client"

import { TrendingUp } from "lucide-react"

interface OverviewCard {
  label: string
  value: string | number
  extra?: React.ReactNode
}

const cards: OverviewCard[] = [
  {
    label: "Total Tasks",
    value: 24,
    extra: (
      <span className="text-sm text-on-error-container font-medium flex items-center gap-1">
        +4 <TrendingUp className="w-4 h-4" />
      </span>
    ),
  },
  {
    label: "Completed",
    value: 18,
    extra: (
      <div className="h-2 w-24 bg-surface-container rounded-full overflow-hidden">
        <div className="h-full bg-primary w-[75%]" />
      </div>
    ),
  },
  {
    label: "Pending",
    value: 6,
    extra: <span className="text-sm text-outline">On track</span>,
  },
  {
    label: "High Priority",
    value: 3,
    extra: (
      <span className="px-2 py-0.5 bg-error-container text-on-error-container rounded-full text-xs font-medium">
        Urgent
      </span>
    ),
  },
]

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:-translate-y-1 hover:shadow-md transition-all duration-200"
        >
          <p className="text-sm font-semibold text-on-surface-variant">{card.label}</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-serif font-semibold">{card.value}</span>
            {card.extra}
          </div>
        </div>
      ))}
    </div>
  )
}
