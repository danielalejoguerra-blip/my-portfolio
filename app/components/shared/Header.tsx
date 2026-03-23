"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Globe, Menu, X, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { locales, type Locale } from "@/app/i18n/config";
import type { PersonalInfo } from "@/types";

const localeNames: Record<Locale, string> = { es: "Español", en: "English" };
const localeFlags: Record<Locale, string> = { es: "🇪🇸", en: "🇺🇸" };

const NAV_ITEMS = [
  { key: "about",      href: "#about" },
  { key: "skills",     href: "#skills" },
  { key: "experience", href: "#experience" },
  { key: "projects",   href: "#projects" },
  { key: "contact",    href: "#contact" },
] as const;

interface HeaderProps {
  personalInfo?: PersonalInfo | null;
}

/* ─── Scroll-progress bar ─── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-0.5 z-60
        bg-linear-to-r from-(--gradient-start) via-(--gradient-mid) to-(--gradient-end)"
    />
  );
}

/* ─── Language dropdown ─── */
function LangDropdown({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const change = (next: Locale) => {
    const segs = pathname.split("/");
    if (locales.includes(segs[1] as Locale)) segs[1] = next;
    else segs.splice(1, 0, next);
    router.push(segs.join("/") || "/");
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-full transition-all duration-200 font-medium text-sm",
          "text-(--muted-foreground) hover:text-(--foreground)",
          compact
            ? "px-3 py-1.5 bg-(--secondary) hover:bg-(--secondary-hover)"
            : "px-4 py-2 bg-(--secondary) hover:bg-(--secondary-hover)"
        )}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span>{localeFlags[locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <ChevronDown
          className={cn("w-3 h-3 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 mt-2 w-40 rounded-xl overflow-hidden z-50",
              "bg-(--card) border border-(--card-border)",
              "shadow-xl shadow-black/10"
            )}
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => change(l)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  "hover:bg-(--secondary)",
                  l === locale
                    ? "text-(--primary) font-semibold bg-(--secondary)"
                    : "text-(--foreground)"
                )}
              >
                <span className="text-lg">{localeFlags[l]}</span>
                {localeNames[l]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Desktop nav link ─── */
function NavLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-1 py-0.5 text-sm font-medium transition-colors duration-200",
        active
          ? "text-(--foreground)"
          : "text-(--muted-foreground) hover:text-(--foreground)"
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full
            bg-linear-to-r from-(--gradient-start) to-(--gradient-end)"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}

/* ─── Main Header ─── */
export default function Header({ personalInfo }: HeaderProps) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const firstName = personalInfo?.full_name?.split(" ")[0] ?? "Daniel";
  const lastName = personalInfo?.full_name?.split(" ").slice(1).join(" ") ?? "Guerra";

  /* Track scroll for background blur */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section via Intersection Observer */
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((i) => i.key);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* Close mobile menu on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <ScrollProgress />

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-2 inset-x-4 z-50 rounded-2xl transition-all duration-500",
          scrolled
            ? [
                "bg-(--background)/80 backdrop-blur-xl",
                "border border-(--border)",
                "shadow-lg shadow-black/8",
              ]
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Go to top"
          >
            <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
              bg-linear-to-br from-(--gradient-start) via-(--gradient-mid) to-(--gradient-end)
              text-white shadow-md shadow-(--gradient-start)/30
              group-hover:shadow-lg group-hover:shadow-(--gradient-start)/40 transition-shadow">
              {firstName[0]}{lastName[0]}
            </span>
            <span className="hidden sm:block text-sm font-semibold tracking-tight">
              <span className="text-(--foreground)">{firstName} </span>
              <span className="bg-linear-to-r from-(--gradient-start) to-(--gradient-end)
                bg-clip-text text-transparent">
                {lastName}
              </span>
            </span>
          </button>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                label={t(item.key)}
                active={activeSection === item.key}
                onClick={() => scrollTo(item.key)}
              />
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <LangDropdown compact />

            <Link
              href="/login"
              className={cn(
                "hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "border border-(--border) text-(--muted-foreground)",
                "hover:border-(--primary) hover:text-(--primary)",
                "transition-all duration-200"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "md:hidden p-2 rounded-xl transition-all duration-200",
                "text-(--muted-foreground) hover:text-(--foreground)",
                "hover:bg-(--secondary)"
              )}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile overlay menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                "fixed top-20 inset-x-4 z-50 rounded-2xl p-6 md:hidden",
                "bg-(--card)/95 backdrop-blur-xl",
                "border border-(--card-border)",
                "shadow-2xl shadow-black/20"
              )}
            >
              {/* Nav links */}
              <nav className="flex flex-col gap-1 mb-6">
                {NAV_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.key}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(item.key)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-xl text-left",
                      "transition-all duration-200 text-sm font-medium",
                      activeSection === item.key
                        ? "bg-linear-to-r from-(--gradient-start)/10 to-(--gradient-end)/10 text-(--primary)"
                        : "text-(--muted-foreground) hover:bg-(--secondary) hover:text-(--foreground)"
                    )}
                  >
                    {t(item.key)}
                    {activeSection === item.key && (
                      <span className="w-1.5 h-1.5 rounded-full bg-(--primary)" />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-(--border) mb-4" />

              {/* Admin link */}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium",
                  "text-(--muted-foreground) hover:bg-(--secondary) hover:text-(--foreground)",
                  "transition-all duration-200"
                )}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
