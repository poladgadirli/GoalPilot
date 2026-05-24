"use client"

import { ArrowLeft, Plus, Calendar, Bell, Circle, CheckCircle2 } from "lucide-react"
import { Sparkles } from "lucide-react"

interface TaskDetailProps {
  taskTitle: string
  onBack: () => void
}

export function TaskDetail({ taskTitle, onBack }: TaskDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-surface-container rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-serif font-semibold">{taskTitle}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-md border-2 border-outline-variant flex items-center justify-center cursor-pointer hover:border-primary transition-colors" />
                <span className="text-base font-semibold">Mark as completed</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-error-container/20 text-error rounded-full text-sm font-bold">
                  High Priority
                </span>
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-sm">
                  Work
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-base text-on-surface leading-relaxed">
                  Compile all departmental reports into the final Q3 synthesis document. Pay special
                  attention to the marketing ROI metrics and the engineering milestone shifts. Needs
                  to be ready for the board review meeting next Tuesday.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Subtasks
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 p-2 hover:bg-surface-container-low rounded-lg transition-all group cursor-pointer">
                    <Circle className="w-5 h-5 text-outline group-hover:text-primary" />
                    <span className="text-sm">Gather marketing ROI spreadsheets</span>
                  </div>
                  <div className="flex items-center gap-4 p-2 hover:bg-surface-container-low rounded-lg transition-all group">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm line-through text-outline">
                      Confirm engineering milestones
                    </span>
                  </div>
                  <div className="flex items-center gap-4 p-2 border-t border-outline-variant/30 mt-4 pt-4">
                    <Plus className="w-5 h-5 text-primary" />
                    <input
                      type="text"
                      placeholder="Add a subtask..."
                      className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6">
              Activity
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">H</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">You changed the priority from Medium to High</p>
                  <p className="text-xs text-outline">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">E</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Task created</p>
                  <p className="text-xs text-outline">Yesterday, 4:30 PM</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-outline">DUE DATE</label>
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-base font-semibold">Oct 24, 2023</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-outline">REMINDER</label>
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <Bell className="w-5 h-5 text-on-surface-variant" />
                <span className="text-base">9:00 AM, Oct 24</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-outline">TAGS</label>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs">
                  #quarterly
                </span>
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs">
                  #finance
                </span>
              </div>
            </div>
          </div>

          <div className="glass-ai p-6 rounded-2xl border border-outline-variant flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold">AI Insight</span>
            </div>
            <p className="text-sm italic">
              &quot;This task is linked to 3 other reports. Finishing this will unlock the
              &apos;Board Prep&apos; milestone.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
