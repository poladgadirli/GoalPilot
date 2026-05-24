"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { OnboardingCarousel } from "@/components/onboarding-carousel";
import { SignUpForm } from "@/components/sign-up-form";
function SignUpPage() {
  const formRef = useRef(null);
  const handleGetStarted = () => {
    if (formRef.current) {
      const firstInput = formRef.current.querySelector("input");
      if (firstInput) {
        firstInput.focus();
        if (window.innerWidth < 1024) {
          formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };
  return /* @__PURE__ */ jsxs("main", { className: "flex flex-col lg:flex-row min-h-screen", children: [
    /* @__PURE__ */ jsx(OnboardingCarousel, { onGetStarted: handleGetStarted }),
    /* @__PURE__ */ jsx("section", { className: "w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-surface", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[440px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center lg:text-left", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-on-surface font-serif text-3xl font-semibold mb-2 tracking-tight", children: "Create your account" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-base", children: "Start planning smarter with AI Planner." })
      ] }),
      /* @__PURE__ */ jsx(SignUpForm, { formRef })
    ] }) })
  ] });
}
export {
  SignUpPage as default
};
