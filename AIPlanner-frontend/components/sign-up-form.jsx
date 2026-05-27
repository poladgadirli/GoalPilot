"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { register, storeAuth } from "@/lib/api";
function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: "WEAK PASSWORD", color: "bg-error", textColor: "text-outline" };
  }
  let score = 0;
  if (password.length > 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  switch (score) {
    case 0:
    case 1:
      return { score: 25, label: "WEAK PASSWORD", color: "bg-error", textColor: "text-error" };
    case 2:
      return { score: 50, label: "MEDIUM SECURITY", color: "bg-tertiary-fixed-dim", textColor: "text-on-tertiary-container" };
    case 3:
      return { score: 75, label: "STRONG PASSWORD", color: "bg-primary-fixed-dim", textColor: "text-on-primary-container" };
    case 4:
      return { score: 100, label: "EXCELLENT SECURITY", color: "bg-primary", textColor: "text-primary" };
    default:
      return { score: 0, label: "WEAK PASSWORD", color: "bg-error", textColor: "text-outline" };
  }
}
function SignUpForm({ formRef }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const strength = getPasswordStrength(password);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const usernameBase = email.split("@")[0]?.replace(/[^a-zA-Z0-9._-]/g, "") || fullName.replace(/\s+/g, "");
      const username = usernameBase.length >= 3 ? usernameBase.slice(0, 30) : `${usernameBase}user`.slice(0, 30);
      const response = await register(fullName, username, email, password, confirmPassword);
      storeAuth(response);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      setIsSubmitting(false);
      setIsSuccess(false);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unable to create your account. Please try again.");
      }
    }
  };
  return /* @__PURE__ */ jsxs("form", { ref: formRef, className: "space-y-4", onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "fullName",
          className: "text-on-surface-variant text-xs font-medium px-1",
          children: "Full name"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "fullName",
          type: "text",
          placeholder: "John Doe",
          required: true,
          value: fullName,
          onChange: (e) => setFullName(e.target.value),
          className: "w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "email",
          className: "text-on-surface-variant text-xs font-medium px-1",
          children: "Email address"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "email",
          type: "email",
          placeholder: "name@company.com",
          required: true,
          value: email,
          onChange: (e) => setEmail(e.target.value),
          className: "w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "password",
          className: "text-on-surface-variant text-xs font-medium px-1",
          children: "Password"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            type: showPassword ? "text" : "password",
            placeholder: "Min. 8 characters",
            required: true,
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full h-12 px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowPassword(!showPassword),
            className: "absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors",
            "aria-label": showPassword ? "Hide password" : "Show password",
            children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-surface-container-high rounded-full overflow-hidden mt-2 h-1", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `h-full transition-all duration-300 ${strength.color}`,
          style: { width: password ? `${strength.score}%` : "0%" }
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: `text-[10px] font-medium uppercase tracking-wider ${strength.textColor}`, children: strength.label })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "confirm-password",
          className: "text-on-surface-variant text-xs font-medium px-1",
          children: "Confirm password"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "confirm-password",
            type: showConfirmPassword ? "text" : "password",
            placeholder: "Repeat your password",
            required: true,
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            className: "w-full h-12 px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowConfirmPassword(!showConfirmPassword),
            className: "absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors",
            "aria-label": showConfirmPassword ? "Hide password" : "Show password",
            children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 py-2", children: [
      /* @__PURE__ */ jsx("div", { className: "relative flex items-center pt-0.5", children: /* @__PURE__ */ jsx(
        "input",
        {
          id: "terms",
          type: "checkbox",
          required: true,
          checked: agreedToTerms,
          onChange: (e) => setAgreedToTerms(e.target.checked),
          className: "w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
        }
      ) }),
      /* @__PURE__ */ jsxs("label", { htmlFor: "terms", className: "text-on-surface-variant text-sm leading-relaxed", children: [
        "I agree to the",
        " ",
        /* @__PURE__ */ jsx("a", { href: "#", className: "text-primary font-semibold hover:underline", children: "Terms of Service" }),
        " ",
        "and",
        " ",
        /* @__PURE__ */ jsx("a", { href: "#", className: "text-primary font-semibold hover:underline", children: "Privacy Policy" }),
        "."
      ] })
    ] }),
    errorMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-error", children: errorMessage }) : null,
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: isSubmitting || isSuccess,
        className: `w-full h-12 font-semibold text-sm tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 ${isSuccess ? "bg-tertiary-container text-on-tertiary-container" : "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98]"} disabled:cursor-not-allowed`,
        children: isSubmitting && !isSuccess ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "animate-spin h-5 w-5",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              children: [
                /* @__PURE__ */ jsx(
                  "circle",
                  {
                    className: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    strokeWidth: "4"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    className: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  }
                )
              ]
            }
          ),
          "Processing..."
        ] }) : isSuccess ? "Success! Redirecting..." : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Sign Up",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "text-center pt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant text-sm", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-primary font-bold hover:underline", children: "Log In" })
    ] }) })
  ] });
}
export {
  SignUpForm
};
