"use client";

import { cn } from "@/app/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          // Variants
          variant === "primary" &&
            "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-lg shadow-[var(--primary)]/25",
          variant === "secondary" &&
            "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary-hover)]",
          variant === "outline" &&
            "border-2 border-[var(--border)] bg-transparent hover:bg-[var(--secondary)] text-[var(--foreground)]",
          variant === "ghost" &&
            "bg-transparent hover:bg-[var(--secondary)] text-[var(--foreground)]",
          // Sizes
          size === "sm" && "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
          size === "md" && "px-5 py-2.5 text-sm rounded-[var(--radius)]",
          size === "lg" && "px-8 py-3.5 text-base rounded-[var(--radius-lg)]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
