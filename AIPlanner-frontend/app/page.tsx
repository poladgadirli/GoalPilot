"use client"

import { useRef } from "react"
import { OnboardingCarousel } from "@/components/onboarding-carousel"
import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleGetStarted = () => {
    // On mobile, scroll to form. On desktop, focus the first input.
    if (formRef.current) {
      const firstInput = formRef.current.querySelector("input")
      if (firstInput) {
        firstInput.focus()
        // On mobile, also scroll into view
        if (window.innerWidth < 1024) {
          formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }
  }

  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      {/* Left: Onboarding Carousel */}
      <OnboardingCarousel onGetStarted={handleGetStarted} />

      {/* Right: Sign Up Form Section */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-surface">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-on-surface font-serif text-3xl font-semibold mb-2 tracking-tight">
              Create your account
            </h2>
            <p className="text-on-surface-variant text-base">
              Start planning smarter with AI Planner.
            </p>
          </div>

          <SignUpForm formRef={formRef} />
        </div>
      </section>
    </main>
  )
}
