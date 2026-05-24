"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { TodaysPlan } from "@/components/dashboard/todays-plan"
import { ActiveGoals } from "@/components/dashboard/active-goals"
import { CurrentPlanProgress } from "@/components/dashboard/current-plan-progress"
import { AiGoalCreator } from "@/components/dashboard/ai-goal-creator"
import { RecentManualTasks } from "@/components/dashboard/recent-manual-tasks"
import { TaskDetail } from "@/components/dashboard/task-detail"

export default function DashboardPage() {
  const [view, setView] = useState<"dashboard" | "task-detail">("dashboard")
  const [selectedTask, setSelectedTask] = useState<string>("")

  const handleTaskSelect = (taskTitle: string) => {
    setSelectedTask(taskTitle)
    setView("task-detail")
  }

  const handleBackToDashboard = () => {
    setView("dashboard")
    setSelectedTask("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onTaskSelect={handleTaskSelect} />

      <div className="ml-[260px] min-h-screen flex flex-col">
        <Header title={view === "dashboard" ? "Dashboard" : "Task Details"} />

        <main className="p-6 max-w-[1280px] mx-auto w-full flex flex-col gap-6">
          {view === "dashboard" ? (
            <>
              <SummaryCards />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <TodaysPlan />
                  <ActiveGoals />
                </div>
                <div className="space-y-6">
                  <AiGoalCreator />
                  <CurrentPlanProgress />
                </div>
              </div>

              <RecentManualTasks />
            </>
          ) : (
            <TaskDetail taskTitle={selectedTask} onBack={handleBackToDashboard} />
          )}
        </main>
      </div>
    </div>
  )
}
