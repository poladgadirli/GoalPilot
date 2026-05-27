"use client";

import { cn } from "@/lib/utils";

const variantStyles = {
  blue: {
    card: "bg-blue-50/80 border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/70",
    badge: "bg-blue-100/80 dark:bg-blue-900/40",
    icon: "text-blue-600 dark:text-blue-300"
  },
  green: {
    card: "bg-green-50/80 border-green-100 dark:bg-green-950/30 dark:border-green-800/70",
    badge: "bg-green-100/80 dark:bg-green-900/40",
    icon: "text-green-600 dark:text-green-300"
  },
  orange: {
    card: "bg-orange-50/80 border-orange-100 dark:bg-orange-950/30 dark:border-orange-800/70",
    badge: "bg-orange-100/80 dark:bg-orange-900/40",
    icon: "text-orange-600 dark:text-orange-300"
  },
  purple: {
    card: "bg-purple-50/80 border-purple-100 dark:bg-purple-950/30 dark:border-purple-800/70",
    badge: "bg-purple-100/80 dark:bg-purple-900/40",
    icon: "text-purple-600 dark:text-purple-300"
  },
  red: {
    card: "bg-red-50/80 border-red-100 dark:bg-red-950/30 dark:border-red-800/70",
    badge: "bg-red-100/80 dark:bg-red-900/40",
    icon: "text-red-600 dark:text-red-300"
  },
  gray: {
    card: "bg-surface-container-lowest border-outline-variant",
    badge: "bg-surface-container",
    icon: "text-on-surface-variant"
  }
};

function StatCard({
  title,
  label,
  value,
  icon,
  variant = "gray",
  subtitle,
  trend,
  size = "default",
  className
}) {
  const styles = variantStyles[variant] ?? variantStyles.gray;
  const isLarge = size === "lg";

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200 hover:shadow-md",
        isLarge ? "p-6" : "p-4",
        styles.card,
        className
      )}
    >
      {(icon || trend !== undefined) ? (
        <div className={cn("flex items-start justify-between", isLarge ? "mb-4" : "mb-3")}>
          {icon ? (
            <div className={cn("rounded-lg p-2", styles.badge)}>
              <div className={styles.icon}>{icon}</div>
            </div>
          ) : (
            <span />
          )}
          {trend !== undefined && trend > 0 ? (
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">+{trend}</span>
          ) : null}
        </div>
      ) : null}
      <p className="text-sm font-medium text-on-surface-variant">{title ?? label}</p>
      <div className={cn("font-semibold text-on-surface", isLarge ? "mt-2 text-3xl" : "mt-2 text-2xl")}>
        {value}
      </div>
      {subtitle ? <p className="mt-1 text-xs text-on-surface-variant">{subtitle}</p> : null}
    </div>
  );
}

export {
  StatCard,
  variantStyles
};
