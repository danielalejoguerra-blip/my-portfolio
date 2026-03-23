'use client';

// ============================================
// NavItem - Ítem de navegación del sidebar
// ============================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  disabled?: boolean;
  badge?: string;
}

export default function NavItem({
  href,
  icon: Icon,
  label,
  isCollapsed,
  disabled = false,
  badge,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  const content = (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
          : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        isCollapsed && 'justify-center px-2'
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--primary)]"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-[var(--primary)]')} />

      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="truncate whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge (e.g. "Soon") */}
      {badge && !isCollapsed && (
        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
          {badge}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-md bg-[var(--foreground)] text-[var(--background)] text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg">
          {label}
          {badge && <span className="ml-1.5 opacity-70">({badge})</span>}
        </div>
      )}
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
