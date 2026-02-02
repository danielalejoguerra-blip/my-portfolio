"use client";

import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
}

export default function Section({
  children,
  className,
  id,
  title,
  subtitle,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
