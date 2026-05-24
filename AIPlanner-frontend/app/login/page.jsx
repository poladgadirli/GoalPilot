"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login, storeAuth } from "@/lib/api";
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await login(email, password);
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
        setErrorMessage("Unable to sign in. Please try again.");
      }
    }
  };
  return /* @__PURE__ */ jsxs("main", { className: "flex flex-col lg:flex-row min-h-screen", children: [
    /* @__PURE__ */ jsxs("section", { className: "w-full lg:w-1/2 bg-primary-container relative flex flex-col justify-center min-h-[40vh] lg:min-h-screen overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-20 pointer-events-none", children: /* @__PURE__ */ jsx(
        "img",
        {
          className: "w-full h-full object-cover grayscale brightness-50 contrast-125",
          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCry5AoCvyhCtuczh-9pO5fqouT0Gfzw-j7Od7mpKVCXtNscPxMONSPqri2ql1oqtXNRl6fF-1DLghggtqU4iKxo4LObzjhXx3dsSfts8ZLgISp5yFT7ZJqthRTnC0PZ0KubvDfqlDgQY4Ndy44DY33QVPrvjPfa1aX1ZSNYyWYj5-P_rCGCHEZTBs1uQhCUhEZv3VRIdHXFKl8OiFMclex8_nfUY2_jKZNwlEUEf3MmAR128_KqHgxYrJaxw7cb1DZkFDlHwkaKU7_",
          alt: "Abstract technology background with circuit patterns and fiber optic light paths"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-6 md:p-10 lg:p-16 max-w-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-primary-fixed-dim text-sm font-medium tracking-wide uppercase", children: "Welcome Back" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-white font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight text-balance", children: "Continue where you left off." }),
        /* @__PURE__ */ jsx("p", { className: "text-on-primary-container text-base lg:text-lg leading-relaxed max-w-md", children: "Sign in to access your tasks, plans, and AI-powered productivity tools. Your workflow is waiting." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-surface", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[440px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center lg:text-left", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-on-surface font-serif text-3xl font-semibold mb-2 tracking-tight", children: "Log in to your account" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-base", children: "Enter your credentials to continue." })
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
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
                placeholder: "Enter your password",
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
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("a", { href: "#", className: "text-primary text-sm font-medium hover:underline", children: "Forgot password?" }) }),
        errorMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-error mt-2", children: errorMessage }) : null,
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
              "Signing in..."
            ] }) : isSuccess ? "Success! Redirecting..." : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Log In",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-center pt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant text-sm", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/", className: "text-primary font-bold hover:underline", children: "Sign Up" })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  LoginPage as default
};
