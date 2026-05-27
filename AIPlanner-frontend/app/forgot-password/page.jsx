"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword, verifyResetOtp } from "@/lib/api";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const setRequestError = (error, fallback) => {
    if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage(fallback);
    }
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setStep("otp");
    } catch (error) {
      setRequestError(error, "Unable to send reset code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMessage("Enter the 6 digit code.");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await verifyResetOtp(email, code);
      setStep("password");
    } catch (error) {
      setRequestError(error, "Unable to verify reset code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await resetPassword(email, code, newPassword, confirmNewPassword);
      setStep("success");
      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      setRequestError(error, "Unable to reset password. Please try again.");
      setIsSubmitting(false);
    }
  };

  return /* @__PURE__ */ jsx("main", { className: "min-h-screen bg-surface flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs("section", { className: "w-full max-w-[440px]", children: [
    /* @__PURE__ */ jsx(Link, { to: "/login", className: "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-8", children: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
      "Back to login"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4", children: step === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-on-surface font-serif text-3xl font-semibold mb-2 tracking-tight", children: step === "success" ? "Password updated" : "Reset your password" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-base leading-relaxed", children: step === "email" ? "Enter your email and we will send a 6 digit reset code." : step === "otp" ? "Enter the code sent to your email address." : step === "password" ? "Choose a new password for your account." : "Redirecting you to login." })
    ] }),
    step === "email" ? /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: submitEmail, children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-on-surface-variant text-xs font-medium px-1", children: "Email address" }),
        /* @__PURE__ */ jsx("input", { id: "email", type: "email", placeholder: "name@company.com", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base" })
      ] }),
      errorMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-error", children: errorMessage }) : null,
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full h-12 font-semibold text-sm tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed", children: isSubmitting ? "Sending..." : /* @__PURE__ */ jsxs(Fragment, { children: [
        "Send code",
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
      ] }) })
    ] }) : null,
    step === "otp" ? /* @__PURE__ */ jsxs("form", { className: "space-y-5", onSubmit: submitCode, children: [
      /* @__PURE__ */ jsx(InputOTP, { maxLength: 6, value: code, onChange: setCode, containerClassName: "justify-center gap-2", children: /* @__PURE__ */ jsxs(InputOTPGroup, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 0, className: "h-12 w-12 rounded-xl border bg-surface-container-lowest text-base" }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 1, className: "h-12 w-12 rounded-xl border bg-surface-container-lowest text-base" }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 2, className: "h-12 w-12 rounded-xl border bg-surface-container-lowest text-base" }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 3, className: "h-12 w-12 rounded-xl border bg-surface-container-lowest text-base" }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 4, className: "h-12 w-12 rounded-xl border bg-surface-container-lowest text-base" }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 5, className: "h-12 w-12 rounded-xl border bg-surface-container-lowest text-base" })
      ] }) }),
      errorMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-error text-center", children: errorMessage }) : null,
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full h-12 font-semibold text-sm tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed", children: isSubmitting ? "Verifying..." : "Verify code" })
    ] }) : null,
    step === "password" ? /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: submitPassword, children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "new-password", className: "text-on-surface-variant text-xs font-medium px-1", children: "New password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("input", { id: "new-password", type: showPassword ? "text" : "password", placeholder: "Min. 6 characters", required: true, minLength: 6, value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full h-12 px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "confirm-new-password", className: "text-on-surface-variant text-xs font-medium px-1", children: "Confirm new password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("input", { id: "confirm-new-password", type: showConfirmPassword ? "text" : "password", placeholder: "Repeat your password", required: true, minLength: 6, value: confirmNewPassword, onChange: (e) => setConfirmNewPassword(e.target.value), className: "w-full h-12 px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors", "aria-label": showConfirmPassword ? "Hide password" : "Show password", children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" }) })
        ] })
      ] }),
      errorMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-error", children: errorMessage }) : null,
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full h-12 font-semibold text-sm tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed", children: isSubmitting ? "Updating..." : "Update password" })
    ] }) : null
  ] }) });
}

export {
  ForgotPasswordPage as default
};
