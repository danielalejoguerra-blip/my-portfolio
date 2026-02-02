"use client";

import { cn } from "@/app/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200",
        variant === "default" &&
          "bg-[var(--muted)] text-[var(--muted-foreground)]",
        variant === "primary" &&
          "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20",
        variant === "secondary" &&
          "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
        variant === "outline" &&
          "border border-[var(--border)] text-[var(--muted-foreground)]",
        className
      )}
    >
      {children}
    </span>
  );
}
