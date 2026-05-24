"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
const phrases = [
  "Analyzing client feedback for Project Aurora...",
  "Building a priority roadmap for your workload...",
  "Suggested: Finish reports before lunch peak focus."
];
function AiAssistant() {
  const [typingText, setTypingText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  useEffect(() => {
    const phrase = phrases[phraseIndex];
    let charIndex = 0;
    setTypingText("");
    const typingInterval = setInterval(() => {
      if (charIndex < phrase.length) {
        setTypingText(phrase.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 3e3);
      }
    }, 40);
    return () => clearInterval(typingInterval);
  }, [phraseIndex]);
  return /* @__PURE__ */ jsx("aside", { className: "lg:col-span-4 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "glass-ai p-6 rounded-2xl border border-outline-variant ai-glow", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-primary fill-primary" }),
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-primary", children: "AI Planner" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "p-1 hover:bg-surface-container-high rounded-full transition-all", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-on-surface-variant" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-4 rounded-xl border border-primary/10 min-h-[120px]", children: /* @__PURE__ */ jsxs("div", { className: "text-sm text-on-surface leading-relaxed", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold text-primary mb-2", children: "Optimal Day Strategy:" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-2 list-none p-0", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-primary font-bold", children: "1." }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Start with the ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Quarterly Report" }),
            " (High focus task)."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-primary font-bold", children: "2." }),
          /* @__PURE__ */ jsx("span", { className: "typing-cursor", children: typingText })
        ] })
      ] })
    ] }) }) })
  ] }) });
}
export {
  AiAssistant
};
