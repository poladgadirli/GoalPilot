"use client"

import { useState } from "react"
import { 
  Sun, 
  Star, 
  Calendar, 
  CheckSquare, 
  ChevronRight, 
  Settings, 
  Search 
} from "lucide-react"
import Image from "next/image"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  count: number
  active?: boolean
}

interface CategoryItem {
  emoji: string
  label: string
  count: number
  tasks?: { name: string }[]
}

const mainItems: SidebarItem[] = [
  { icon: <Sun className="w-5 h-5" />, label: "My Day", count: 8, active: true },
  { icon: <Star className="w-5 h-5" />, label: "Important", count: 5 },
  { icon: <Calendar className="w-5 h-5" />, label: "Planned", count: 10 },
  { icon: <CheckSquare className="w-5 h-5" />, label: "Tasks", count: 9 },
]

const categories: CategoryItem[] = [
  { emoji: "👨‍💻", label: "Work", count: 4, tasks: [{ name: "Report Synthesis" }, { name: "Design Review" }] },
  { emoji: "🏠", label: "Home", count: 10 },
  { emoji: "🍉", label: "Groceries", count: 6 },
]

interface SidebarProps {
  onTaskSelect?: (taskName: string) => void
}

export function Sidebar({ onTaskSelect }: SidebarProps) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] flex flex-col py-4 z-40 bg-surface border-r border-outline-variant">
      {/* Header */}
      <div className="px-6 mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-primary">AI Planner</span>
          <div className="text-sm text-on-surface-variant">Intelligent Management</div>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-1 overflow-y-auto space-y-1">
        {mainItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center justify-between px-4 py-2 rounded-lg group transition-colors ${
              item.active
                ? "bg-secondary-container text-on-surface font-semibold"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            <span className="text-xs text-outline group-hover:text-primary">{item.count}</span>
          </a>
        ))}

        {/* Divider */}
        <div className="pt-4 pb-2 px-4">
          <div className="h-px bg-outline-variant w-full" />
        </div>

        {/* Categories Tree View */}
        <div className="space-y-1">
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="w-full flex items-center gap-1 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors group"
          >
            <ChevronRight
              className={`w-5 h-5 transition-transform duration-200 ${
                categoriesExpanded ? "rotate-90" : ""
              }`}
            />
            <span className="text-sm font-bold">Categories</span>
          </button>

          {categoriesExpanded && (
            <div className="ml-4 space-y-1">
              {categories.map((category) => (
                <div key={category.label} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category.label)}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedCategories.includes(category.label) ? "rotate-90" : ""
                        }`}
                      />
                      <span className="text-lg">{category.emoji}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    <span className="text-xs text-outline">{category.count}</span>
                  </button>

                  {expandedCategories.includes(category.label) && category.tasks && (
                    <div className="ml-8 space-y-1">
                      {category.tasks.map((task) => (
                        <button
                          key={task.name}
                          onClick={() => onTaskSelect?.(task.name)}
                          className="block w-full text-left px-4 py-1 text-sm text-on-surface-variant hover:text-primary border-l border-outline-variant ml-2 transition-colors"
                        >
                          {task.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto px-1 space-y-1">
        <a
          href="#"
          className="flex items-center gap-4 text-on-surface-variant pl-4 py-2 hover:bg-surface-container-high transition-colors rounded-lg"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </a>

        <div className="pt-6 mt-4 border-t border-outline-variant px-4 flex items-center gap-2">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGMYf_C4fYenocNe3roK0OMEKmAz7aBp1WBhP96dgGBad8CUM4jc8ih16klUDXeZkcYtIr5UqHrWiL_vPLrQ5JDB4V8HeTQUFqh4sy89zAPuNpFPyM30_NtR0NvklFpRkstt7VxA5H8BjpggJZaomflNBcmSeUsu5A8DhXIF95URTvznF-WxQwwhirEO7_TyCtQVKTqhBZMeFV89AjX89GLoBO9VdK4CB6irMnu4gXP9Z-OOCp4z6znppbVQV967g1lh7mHlFQysGl"
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full bg-surface-container-high"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Alex Chen</p>
            <p className="text-sm text-outline truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
