"use client";

import { Heart, Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo / Name */}
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--accent)] bg-clip-text text-transparent">
              DG
            </span>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Daniel Alejandro Guerra Muñoz
            </p>
          </div>

          {/* Social links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/DanielWar01"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] text-[var(--muted-foreground)] transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/daniel-guerra-197551301"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] text-[var(--muted-foreground)] transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:danielalejoguerra@gmail.com"
              className="p-2.5 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] text-[var(--muted-foreground)] transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
              {t("madeWith")} <Heart className="w-4 h-4 text-red-500 fill-current" /> {t("location")}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              © {currentYear} {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
