"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/app/components/ui";
import type { Skill } from "@/types";

interface SkillsProps {
  skills?: Skill[] | null;
}

type SkillRow = { name: string; level: number; icon?: string };
type SkillCategory = { title: string; skills: SkillRow[] };

const COLLAPSE_THRESHOLD = 5;

const LEVEL_MAP: Record<string, number> = {
  beginner: 35,
  intermediate: 60,
  advanced: 80,
  expert: 95,
};

function toProgress(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(100, Math.max(10, Math.round(value)));
  }
  if (typeof value === "string") {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return Math.min(100, Math.max(10, Math.round(numeric)));
    }
    return LEVEL_MAP[value.trim().toLowerCase()] ?? 70;
  }
  return 70;
}

export default function Skills({ skills: backendSkills }: SkillsProps) {
  const t = useTranslations("skills");

  const fallbackCategories: SkillCategory[] = [
    {
      title: t("categories.frontend"),
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "TypeScript", level: 90 },
        { name: "Tailwind CSS", level: 95 },
        { name: "HTML/CSS", level: 95 },
      ],
    },
    {
      title: t("categories.backend"),
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Express", level: 85 },
        { name: "NestJS", level: 80 },
        { name: "Python", level: 75 },
        { name: "REST APIs", level: 90 },
      ],
    },
    {
      title: t("categories.databases"),
      skills: [
        { name: "SQL Server", level: 85 },
        { name: "PostgreSQL", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "MySQL", level: 80 },
        { name: "Redis", level: 70 },
      ],
    },
    {
      title: t("categories.tools"),
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 75 },
        { name: "AWS", level: 70 },
        { name: "Linux", level: 80 },
        { name: "CI/CD", level: 75 },
      ],
    },
  ];

  const groupedFromBackend = (backendSkills || []).reduce<Record<string, SkillRow[]>>((acc, skill) => {
    const metadata = (skill.metadata || {}) as Record<string, unknown>;
    const category = typeof metadata.category === "string" && metadata.category.trim()
      ? metadata.category.trim()
      : t("categories.tools");
    const progress = toProgress(metadata.level);
    const icon = typeof metadata.icon === "string" ? metadata.icon : undefined;

    if (!acc[category]) acc[category] = [];
    acc[category].push({ name: skill.title, level: progress, icon });
    return acc;
  }, {});

  const categoriesFromBackend: SkillCategory[] = Object.entries(groupedFromBackend)
    .map(([title, rows]) => ({ title, skills: rows }))
    .filter((item) => item.skills.length > 0);

  const skillCategories = categoriesFromBackend.length > 0 ? categoriesFromBackend : fallbackCategories;

  return (
    <Section
      id="skills"
      title={t("title")}
      subtitle={t("subtitle")}
      className="bg-(--muted)/30"
    >
      <div className="grid md:grid-cols-2 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <CategoryCard
            key={category.title}
            category={category}
            categoryIndex={categoryIndex}
          />
        ))}
      </div>
    </Section>
  );
}

function CategoryCard({ category, categoryIndex }: { category: SkillCategory; categoryIndex: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = category.skills.length > COLLAPSE_THRESHOLD;
  const visibleSkills = expanded ? category.skills : category.skills.slice(0, COLLAPSE_THRESHOLD);
  const hiddenCount = category.skills.length - COLLAPSE_THRESHOLD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
      className="bg-(--card) border border-(--card-border) rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <h3 className="text-xl font-semibold text-(--foreground) mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-linear-to-r from-(--gradient-start) to-(--accent)" />
        {category.title}
      </h3>
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {visibleSkills.map((skill, skillIndex) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, height: 0, marginTop: 0 }}
              transition={{
                duration: 0.3,
                delay: skillIndex * 0.04,
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-(--foreground) flex items-center gap-1.5">
                  {skill.icon && (
                    <span className="text-base leading-none">{skill.icon}</span>
                  )}
                  {skill.name}
                </span>
                <span className="text-xs text-(--muted-foreground)">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 bg-(--secondary) rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-(--gradient-start) to-(--accent)"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: categoryIndex * 0.1 + skillIndex * 0.05,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 w-full text-xs font-semibold py-2 rounded-lg border border-(--card-border) text-(--muted-foreground) hover:text-(--foreground) hover:border-(--accent) hover:bg-(--accent)/5 transition-all duration-200"
        >
          {expanded ? "Ver menos ▲" : `Ver más (${hiddenCount}) ▼`}
        </button>
      )}
    </motion.div>
  );
}
