"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string, category: string, priority: "High" | "Med" | "Low") => void
}

export function CreateTaskModal({ isOpen, onClose, onSave }: CreateTaskModalProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Work")
  const [priority, setPriority] = useState<"High" | "Med" | "Low">("Med")

  if (!isOpen) return null

  const handleSave = () => {
    if (title.trim()) {
      onSave(title, category, priority)
      setTitle("")
      setCategory("Work")
      setPriority("Med")
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-xl font-serif font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design review session"
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base focus:border-primary focus:ring-0 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-on-surface-variant">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-base focus:border-primary focus:ring-0 outline-none"
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Health</option>
                <option>Finance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-on-surface-variant">Priority</label>
              <div className="flex gap-2 h-full pt-1">
                {(["High", "Med", "Low"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 border rounded-xl text-xs font-medium transition-all ${
                      priority === p
                        ? p === "High"
                          ? "border-error bg-error-container/10 text-error"
                          : "border-primary bg-primary/10 text-primary"
                        : "border-outline-variant hover:border-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-container-low flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 font-semibold text-sm hover:bg-surface-container-highest rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm shadow-lg shadow-primary/10 hover:shadow-xl transition-all active:scale-95"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  )
}
