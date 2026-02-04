"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import LanguageSelector from "./LanguageSelector";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Language selector and Admin button - fixed position */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="gap-2">
            <Shield className="w-4 h-4" />
            Admin
          </Button>
        </Link>
        <LanguageSelector />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-start)]/5 via-transparent to-[var(--gradient-end)]/5" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-72 h-72 bg-[var(--primary)]/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Avatar / Photo placeholder */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] p-1">
            <div className="w-full h-full rounded-full bg-[var(--background)] flex items-center justify-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--accent)] bg-clip-text text-transparent">
                DG
              </span>
            </div>
          </div>
        </motion.div>

        {/* Name and title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-[var(--primary)] font-medium mb-4 tracking-wide">
            {t("greeting")}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-[var(--foreground)]">Daniel </span>
            <span className="bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] bg-clip-text text-transparent">
              Guerra
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-[var(--muted-foreground)] mb-8">
            {t("role")}
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t.rich("description", {
            react: (chunks) => <span className="text-[var(--primary)] font-medium">{chunks}</span>,
            nodejs: (chunks) => <span className="text-[var(--accent)] font-medium">{chunks}</span>,
            typescript: (chunks) => <span className="text-[var(--primary)] font-medium">{chunks}</span>,
          })}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            {t("viewProjects")}
          </Button>
          <Button variant="outline" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            {t("contactMe")}
          </Button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center gap-6"
        >
          <a
            href="https://github.com/DanielWar01"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-all duration-300 hover:scale-110"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/daniel-guerra-197551301"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-all duration-300 hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:danielalejoguerra@gmail.com"
            className="p-3 rounded-full bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-all duration-300 hover:scale-110"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="cursor-pointer"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            <ArrowDown className="w-6 h-6 text-[var(--muted-foreground)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
