"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
    <main className="flex flex-col lg:flex-row min-h-screen">
      {/* Left: Brand Section */}
      <section className="w-full lg:w-1/2 bg-primary-container relative flex flex-col justify-center min-h-[40vh] lg:min-h-screen overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            className="w-full h-full object-cover grayscale brightness-50 contrast-125"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCry5AoCvyhCtuczh-9pO5fqouT0Gfzw-j7Od7mpKVCXtNscPxMONSPqri2ql1oqtXNRl6fF-1DLghggtqU4iKxo4LObzjhXx3dsSfts8ZLgISp5yFT7ZJqthRTnC0PZ0KubvDfqlDgQY4Ndy44DY33QVPrvjPfa1aX1ZSNYyWYj5-P_rCGCHEZTBs1uQhCUhEZv3VRIdHXFKl8OiFMclex8_nfUY2_jKZNwlEUEf3MmAR128_KqHgxYrJaxw7cb1DZkFDlHwkaKU7_"
            alt="Abstract technology background with circuit patterns and fiber optic light paths"
          />
        </div>

        <div className="relative z-10 p-6 md:p-10 lg:p-16 max-w-lg">
          {/* Label */}
          <div className="mb-4">
            <span className="text-primary-fixed-dim text-sm font-medium tracking-wide uppercase">
              Welcome Back
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-white font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight text-balance">
            Continue where you left off.
          </h1>

          {/* Description */}
          <p className="text-on-primary-container text-base lg:text-lg leading-relaxed max-w-md">
            Sign in to access your tasks, plans, and AI-powered productivity tools. Your workflow is waiting.
          </p>
        </div>
      </section>

      {/* Right: Login Form Section */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-surface">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-on-surface font-serif text-3xl font-semibold mb-2 tracking-tight">
              Log in to your account
            </h2>
            <p className="text-on-surface-variant text-base">
              Enter your credentials to continue.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
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
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a href="#" className="text-primary text-sm font-medium hover:underline">
                Forgot password?
              </a>
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
                  Signing in...
                </>
              ) : isSuccess ? (
                "Success! Redirecting..."
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Footer Link */}
            <div className="text-center pt-4">
              <p className="text-on-surface-variant text-sm">
                {"Don't have an account?"}{" "}
                <Link href="/" className="text-primary font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
