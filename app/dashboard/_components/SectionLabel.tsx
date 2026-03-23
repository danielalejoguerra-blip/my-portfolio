'use client';

// ============================================
// SectionLabel - Etiqueta de sección del sidebar
// ============================================

import { AnimatePresence, motion } from 'framer-motion';

interface SectionLabelProps {
  label: string;
  isCollapsed: boolean;
}

export default function SectionLabel({ label, isCollapsed }: SectionLabelProps) {
  return (
    <div className="px-3 pt-6 pb-2">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div
            key="dot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full flex justify-center"
          >
            <div className="w-5 h-px bg-[var(--border)]" />
          </motion.div>
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]/60"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
