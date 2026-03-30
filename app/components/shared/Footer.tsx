"use client";

import { Heart, Github, Linkedin, Mail, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PersonalInfo } from "@/types";

interface FooterProps {
  personalInfo?: PersonalInfo | null;
}

export default function Footer({ personalInfo }: FooterProps) {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  // Datos dinámicos con fallbacks
  const fullName = personalInfo?.full_name || "Daniel Alejandro Guerra Muñoz";
  const nameParts = fullName.split(" ");
  const initials = `${(nameParts[0] || "D")[0]}${(nameParts[1] || "G")[0]}`;
  const socialLinks = personalInfo?.social_links || {};
  const githubUrl = socialLinks.github || "https://github.com/DanielWar01";
  const linkedinUrl = socialLinks.linkedin || "https://linkedin.com/in/daniel-guerra-197551301";
  const emailAddress = personalInfo?.email || "danielalejoguerra@gmail.com";

  return (
    <footer className="py-12 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Source Code Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-(--muted-foreground)">
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">{t("sourceCode")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/danielalejoguerra-blip/my-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--border) bg-(--secondary) hover:border-(--primary) hover:text-(--primary) text-(--muted-foreground) text-sm transition-all duration-300"
            >
              <Github className="w-4 h-4" />
              {t("frontend")}
            </a>
            <a
              href="https://github.com/danielalejoguerra-blip/portfolio_backend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--border) bg-(--secondary) hover:border-(--primary) hover:text-(--primary) text-(--muted-foreground) text-sm transition-all duration-300"
            >
              <Github className="w-4 h-4" />
              {t("backend")}
            </a>
          </div>
        </div>

        <div className="border-t border-(--border)" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo / Name */}
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--accent)] bg-clip-text text-transparent">
              {initials}
            </span>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {fullName}
            </p>
          </div>

          {/* Social links */}
          <div className="flex gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] text-[var(--muted-foreground)] transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] text-[var(--muted-foreground)] transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${emailAddress}`}
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
