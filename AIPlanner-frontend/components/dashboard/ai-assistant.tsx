"use client"

import { useState, useEffect } from "react"
import { Sparkles, X } from "lucide-react"

const phrases = [
  "Analyzing client feedback for Project Aurora...",
  "Building a priority roadmap for your workload...",
  "Suggested: Finish reports before lunch peak focus.",
]

export function AiAssistant() {
  const [typingText, setTypingText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const phrase = phrases[phraseIndex]
    let charIndex = 0
    setTypingText("")

    const typingInterval = setInterval(() => {
      if (charIndex < phrase.length) {
        setTypingText(phrase.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }, 3000)
      }
    }, 40)

    return () => clearInterval(typingInterval)
  }, [phraseIndex])

  return (
    <aside className="lg:col-span-4 space-y-4">
      <div className="glass-ai p-6 rounded-2xl border border-outline-variant ai-glow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary fill-primary" />
            <h2 className="text-sm font-bold text-primary">AI Planner</h2>
          </div>
          <button className="p-1 hover:bg-surface-container-high rounded-full transition-all">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-primary/10 min-h-[120px]">
            <div className="text-sm text-on-surface leading-relaxed">
              <p className="font-semibold text-primary mb-2">Optimal Day Strategy:</p>
              <ul className="space-y-2 list-none p-0">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    Start with the <span className="font-semibold">Quarterly Report</span> (High
                    focus task).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span className="typing-cursor">{typingText}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
