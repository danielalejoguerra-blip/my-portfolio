"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import type { PersonalInfo } from "@/types";

interface HeroProps {
  personalInfo?: PersonalInfo | null;
}

/* ── floating particle ── */
function Particle({ size, x, y, delay }: { size: number; x: string; y: string; delay: number }) {
  return (
    <motion.span
      className="absolute rounded-full bg-[var(--primary)]/20"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function Hero({ personalInfo }: HeroProps) {
  const t = useTranslations("hero");

  const fullName = personalInfo?.full_name || "Daniel Guerra";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "Daniel";
  const lastName = nameParts.slice(1).join(" ") || "Guerra";
  const initials = `${firstName[0] || "D"}${lastName[0] || "G"}`;
  const socialLinks = personalInfo?.social_links || {};
  const githubUrl = socialLinks.github || "https://github.com/DanielWar01";
  const linkedinUrl = socialLinks.linkedin || "https://linkedin.com/in/daniel-guerra-197551301";
  const emailAddress = personalInfo?.email || "danielalejoguerra@gmail.com";
  const avatarUrl = personalInfo?.avatar_url || null;
  const headline = personalInfo?.headline || t("role");
  const resumeUrl = personalInfo?.resume_url || null;
  const metadata = (personalInfo?.metadata || {}) as Record<string, unknown>;
  const statsYears = typeof metadata.years_experience === "number" ? `${metadata.years_experience}+` : "1+";
  const statsProjects = typeof metadata.projects_count === "number" ? `${metadata.projects_count}+` : "3+";
  const statsTechs = typeof metadata.technologies_count === "number" ? `${metadata.technologies_count}+` : "10+";

  return (
    <section className="relative h-screen flex flex-col pt-20">
      {/* ── Fondo ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes suaves */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--gradient-start)]/8 blur-[120px]"
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--gradient-end)]/8 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/5 blur-[100px]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Partículas */}
        <Particle size={6} x="10%" y="20%" delay={0} />
        <Particle size={4} x="80%" y="15%" delay={1.2} />
        <Particle size={5} x="65%" y="70%" delay={0.8} />
        <Particle size={3} x="25%" y="75%" delay={2} />
        <Particle size={7} x="90%" y="50%" delay={0.5} />
        <Particle size={4} x="45%" y="10%" delay={1.8} />
        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Contenido principal ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">

            {/* ── Lado izquierdo: texto ── */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge disponible */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--secondary)]/50 backdrop-blur-sm mb-6"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-[var(--muted-foreground)]">
                  {t("greeting")}
                </span>
              </motion.div>

              {/* Nombre */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4"
              >
                <span className="text-[var(--foreground)]">{firstName}</span>
                <br />
                <span className="bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                  {lastName}
                </span>
              </motion.h1>

              {/* Rol con ícono */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-center lg:justify-start gap-2 mb-6"
              >
                <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--muted-foreground)]">
                  {headline}
                </h2>
              </motion.div>

              {/* Descripción */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="text-sm sm:text-base lg:text-lg text-[var(--muted-foreground)] max-w-xl mx-auto lg:mx-0 mb-6 lg:mb-8 leading-relaxed"
              >
                {t.rich("description", {
                  react: (chunks) => <span className="text-[var(--primary)] font-semibold">{chunks}</span>,
                  nodejs: (chunks) => <span className="text-[var(--accent)] font-semibold">{chunks}</span>,
                  typescript: (chunks) => <span className="text-[var(--primary)] font-semibold">{chunks}</span>,
                })}
              </motion.p>

              {/* Botones */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start items-center mb-3 lg:mb-4"
              >
                <Button size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                  {t("viewProjects")}
                </Button>
                <Button variant="outline" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                  {t("contactMe")}
                </Button>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-medium border border-dashed border-(--border) text-(--muted-foreground) hover:border-(--primary)/60 hover:text-(--primary) transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    {t("downloadCV")}
                  </a>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex justify-center lg:justify-start items-center gap-6 py-1"
              >
                {[
                  { number: statsYears, label: t("statsYears") },
                  { number: statsProjects, label: t("statsProjects") },
                  { number: statsTechs, label: t("statsTechs") },
                ].map(({ number, label }, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start gap-0.5">
                    <span className="text-xl font-bold bg-linear-to-r from-(--gradient-start) to-(--accent) bg-clip-text text-transparent leading-none">
                      {number}
                    </span>
                    <span className="text-xs text-(--muted-foreground)">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Social links */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="flex justify-center lg:justify-start gap-3"
              >
                {[
                  { href: githubUrl, icon: Github, label: "GitHub", external: true },
                  { href: linkedinUrl, icon: Linkedin, label: "LinkedIn", external: true },
                  { href: `mailto:${emailAddress}`, icon: Mail, label: "Email", external: false },
                ].map(({ href, icon: Icon, label, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative p-2.5 rounded-xl bg-[var(--secondary)]/60 border border-[var(--border)] backdrop-blur-sm
                      hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                  </a>
                ))}
              </motion.div>
            </div>

            {/* ── Lado derecho: avatar ── */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative flex-shrink-0"
            >
              {/* Anillo exterior animado */}
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 lg:w-72 lg:h-72">
                {/* Anillo con gradiente giratorio */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end), var(--gradient-start))",
                    padding: "3px",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full bg-[var(--background)]" />
                </motion.div>

                {/* Glow detrás */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--gradient-start)]/20 via-[var(--gradient-mid)]/10 to-[var(--gradient-end)]/20 blur-2xl scale-110" />

                {/* Avatar */}
                <div className="absolute inset-2 rounded-full overflow-hidden bg-[var(--secondary)]">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={fullName}
                      width={300}
                      height={300}
                      priority
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--gradient-start)]/20 to-[var(--gradient-end)]/20">
                      <span className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--accent)] bg-clip-text text-transparent">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                {/* Orbes flotantes decorativos */}
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[var(--gradient-start)] flex items-center justify-center shadow-lg shadow-[var(--gradient-start)]/30"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-xs lg:text-sm">⚡</span>
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-1 w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/30"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <span className="text-xs">💻</span>
                </motion.div>
                <motion.div
                  className="absolute top-1/2 -right-4 lg:-right-5 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[var(--gradient-end)] flex items-center justify-center shadow-lg shadow-[var(--gradient-end)]/30"
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <span className="text-xs">🚀</span>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Flecha scroll ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 rounded-full border border-[var(--border)] bg-[var(--secondary)]/40 backdrop-blur-sm
            hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 transition-all duration-300"
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Scroll down"
        >
          <ArrowDown className="w-5 h-5 text-[var(--muted-foreground)]" />
        </motion.button>
      </motion.div>
    </section>
  );
}
