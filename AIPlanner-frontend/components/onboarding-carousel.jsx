"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Zap, Brain, ListTodo, Target, CheckCircle2, LayoutDashboard, Sparkles, AlertCircle, Rocket, Settings } from "lucide-react";
const slides = [
  {
    label: "AI Planner",
    headline: "Plan smarter. Finish more.",
    description: "AI Planner helps you organize tasks, prioritize your day, and stay focused with intelligent planning support.",
    cards: [
      {
        icon: /* @__PURE__ */ jsx(ListTodo, { className: "w-5 h-5" }),
        title: "Smart Task Management",
        description: "Create, edit, and organize your tasks in one clean workspace."
      },
      {
        icon: /* @__PURE__ */ jsx(Brain, { className: "w-5 h-5" }),
        title: "AI-Powered Planning",
        description: "Get intelligent suggestions for what to focus on first."
      }
    ]
  },
  {
    label: "How It Works",
    headline: "Turn tasks into a clear daily plan.",
    description: "Add your tasks, choose priorities, set deadlines, and let AI help you build a structured plan for your day.",
    cards: [
      {
        icon: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "1" }),
        title: "Step 1",
        description: "Add your tasks with title, description, category, and due date."
      },
      {
        icon: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "2" }),
        title: "Step 2",
        description: "Set priority and status so your work is easier to track."
      },
      {
        icon: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "3" }),
        title: "Step 3",
        description: "Use AI suggestions to decide what to do first."
      }
    ]
  },
  {
    label: "Why AI Planner",
    headline: "Less chaos. More execution.",
    description: "AI Planner is built for people who want a serious productivity system, not just another basic todo list.",
    cards: [
      {
        icon: /* @__PURE__ */ jsx(Target, { className: "w-5 h-5" }),
        title: "Priority Control",
        description: "Focus on high-impact tasks instead of wasting time deciding where to start."
      },
      {
        icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5" }),
        title: "Progress Tracking",
        description: "See what is pending, in progress, completed, or overdue."
      },
      {
        icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5" }),
        title: "Organized Workflow",
        description: "Group tasks by category, priority, and status for better clarity."
      }
    ]
  },
  {
    label: "AI Assistance",
    headline: "Let AI guide your workflow.",
    description: "Use AI to generate daily plans, suggest priorities, detect overdue work, and help you make better decisions faster.",
    cards: [
      {
        icon: /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5" }),
        title: "Daily Plan Generator",
        description: "Create a focused plan based on deadlines and priority."
      },
      {
        icon: /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5" }),
        title: "Priority Suggestions",
        description: "Let AI recommend which tasks deserve attention first."
      },
      {
        icon: /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }),
        title: "Overdue Detection",
        description: "Quickly identify tasks that need immediate action."
      }
    ]
  },
  {
    label: "Get Started",
    headline: "Build your best working day.",
    description: "Create your account and start managing your tasks with structure, clarity, and AI-powered planning.",
    cards: [
      {
        icon: /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5" }),
        title: "Simple Setup",
        description: "Create your account and start adding tasks in minutes."
      },
      {
        icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5" }),
        title: "Professional Dashboard",
        description: "Track tasks, categories, priorities, statuses, and progress from one place."
      }
    ],
    isFinal: true
  }
];
function OnboardingCarousel({ onGetStarted }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("right");
  const goToSlide = useCallback((index, dir) => {
    if (isAnimating || index === currentSlide) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 150);
  }, [isAnimating, currentSlide]);
  const goBack = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1, "left");
    }
  };
  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1, "right");
    }
  };
  const slide = slides[currentSlide];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === slides.length - 1;
  return /* @__PURE__ */ jsxs("section", { className: "w-full lg:w-1/2 bg-primary-container relative flex flex-col min-h-[60vh] lg:min-h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-20 pointer-events-none", children: /* @__PURE__ */ jsx(
      "img",
      {
        className: "w-full h-full object-cover grayscale brightness-50 contrast-125",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCry5AoCvyhCtuczh-9pO5fqouT0Gfzw-j7Od7mpKVCXtNscPxMONSPqri2ql1oqtXNRl6fF-1DLghggtqU4iKxo4LObzjhXx3dsSfts8ZLgISp5yFT7ZJqthRTnC0PZ0KubvDfqlDgQY4Ndy44DY33QVPrvjPfa1aX1ZSNYyWYj5-P_rCGCHEZTBs1uQhCUhEZv3VRIdHXFKl8OiFMclex8_nfUY2_jKZNwlEUEf3MmAR128_KqHgxYrJaxw7cb1DZkFDlHwkaKU7_",
        alt: "Abstract technology background with circuit patterns and fiber optic light paths"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col flex-1 p-6 md:p-10 lg:p-16", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col justify-center max-w-lg", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `transition-all duration-300 ${isAnimating ? direction === "right" ? "opacity-0 -translate-x-4" : "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-primary-fixed-dim text-sm font-medium tracking-wide uppercase", children: slide.label }) }),
            /* @__PURE__ */ jsx("h1", { className: "text-white font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight text-balance", children: slide.headline }),
            /* @__PURE__ */ jsx("p", { className: "text-on-primary-container text-base lg:text-lg leading-relaxed mb-8 max-w-md", children: slide.description }),
            /* @__PURE__ */ jsx("div", { className: `grid gap-4 ${slide.cards.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`, children: slide.cards.map((card, index) => /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl", children: [
              /* @__PURE__ */ jsx("div", { className: "text-primary-fixed-dim mb-2", children: card.icon }),
              /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold text-sm tracking-wide", children: card.title }),
              /* @__PURE__ */ jsx("p", { className: "text-on-primary-container text-sm mt-1 leading-relaxed", children: card.description })
            ] }, index)) }),
            slide.isFinal && /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: onGetStarted,
                  className: "w-full sm:w-auto px-8 py-3 bg-white text-primary-container font-semibold rounded-xl hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx(Rocket, { className: "w-5 h-5" }),
                    "Get Started"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("p", { className: "text-on-primary-container text-sm", children: [
                "Already have an account?",
                " ",
                /* @__PURE__ */ jsx("a", { href: "/login", className: "text-primary-fixed-dim font-semibold hover:underline", children: "Log In" })
              ] })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-8", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: goBack,
            disabled: isFirstSlide,
            className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isFirstSlide ? "opacity-0 pointer-events-none" : "text-on-primary-container hover:text-white hover:bg-white/10"}`,
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              "Back"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: slides.map((_, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => goToSlide(index, index > currentSlide ? "right" : "left"),
            className: `w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-primary-fixed-dim w-6" : "bg-white/30 hover:bg-white/50"}`,
            "aria-label": `Go to slide ${index + 1}`
          },
          index
        )) }),
        isLastSlide ? /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onGetStarted,
            className: "flex items-center gap-2 px-4 py-2 bg-white text-primary-container rounded-lg font-medium text-sm hover:bg-primary-fixed transition-colors",
            children: [
              "Get Started",
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: goNext,
            className: "flex items-center gap-2 px-4 py-2 text-on-primary-container hover:text-white hover:bg-white/10 rounded-lg font-medium text-sm transition-all",
            children: [
              "Next",
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  OnboardingCarousel
};
