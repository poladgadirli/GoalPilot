"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PasswordStrength {
  score: number
  label: string
  color: string
  textColor: string
}

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "WEAK PASSWORD", color: "bg-error", textColor: "text-outline" }
  }

  let score = 0
  if (password.length > 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  switch (score) {
    case 0:
    case 1:
      return { score: 25, label: "WEAK PASSWORD", color: "bg-error", textColor: "text-error" }
    case 2:
      return { score: 50, label: "MEDIUM SECURITY", color: "bg-tertiary-fixed-dim", textColor: "text-on-tertiary-container" }
    case 3:
      return { score: 75, label: "STRONG PASSWORD", color: "bg-primary-fixed-dim", textColor: "text-on-primary-container" }
    case 4:
      return { score: 100, label: "EXCELLENT SECURITY", color: "bg-primary", textColor: "text-primary" }
    default:
      return { score: 0, label: "WEAK PASSWORD", color: "bg-error", textColor: "text-outline" }
  }
}

interface SignUpFormProps {
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function SignUpForm({ formRef }: SignUpFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSuccess(true)
    
    // Redirect to dashboard after success
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      {/* Full Name Field */}
      <div className="space-y-1">
        <label
          htmlFor="fullName"
          className="text-on-surface-variant text-xs font-medium px-1"
        >
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="text-on-surface-variant text-xs font-medium px-1"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="text-on-surface-variant text-xs font-medium px-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Strength Bar */}
        <div className="w-full bg-surface-container-high rounded-full overflow-hidden mt-2 h-1">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: password ? `${strength.score}%` : "0%" }}
          />
        </div>
        <p className={`text-[10px] font-medium uppercase tracking-wider ${strength.textColor}`}>
          {strength.label}
        </p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label
          htmlFor="confirm-password"
          className="text-on-surface-variant text-xs font-medium px-1"
        >
          Confirm password
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-4 py-2">
        <div className="relative flex items-center pt-0.5">
          <input
            id="terms"
            type="checkbox"
            required
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
          />
        </div>
        <label htmlFor="terms" className="text-on-surface-variant text-sm leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-primary font-semibold hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary font-semibold hover:underline">
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isSuccess}
        className={`w-full h-12 font-semibold text-sm tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 ${
          isSuccess
            ? "bg-tertiary-container text-on-tertiary-container"
            : "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98]"
        } disabled:cursor-not-allowed`}
      >
        {isSubmitting && !isSuccess ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : isSuccess ? (
          "Success! Redirecting..."
        ) : (
          <>
            Sign Up
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Footer Link */}
      <div className="text-center pt-4">
        <p className="text-on-surface-variant text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </form>
  )
}
