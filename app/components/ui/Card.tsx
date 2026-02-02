"use client";

import { cn } from "@/app/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
}

export default function Card({
  className,
  variant = "default",
  hover = true,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-[var(--radius-xl)] p-6 transition-all duration-300",
        // Variants
        variant === "default" &&
          "bg-[var(--card)] border border-[var(--card-border)] shadow-sm",
        variant === "glass" &&
          "bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--card-border)]/50 shadow-lg",
        variant === "gradient" &&
          "bg-gradient-to-br from-[var(--gradient-start)]/10 via-[var(--gradient-mid)]/10 to-[var(--gradient-end)]/10 border border-[var(--card-border)]",
        // Hover
        hover && "hover:shadow-xl hover:-translate-y-1 hover:border-[var(--primary)]/30",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
