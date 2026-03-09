"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/app/components/ui";
import type { Skill } from "@/types";

interface SkillsProps {
  skills?: Skill[] | null;
}

type SkillRow = { name: string; level: number };
type SkillCategory = { title: string; skills: SkillRow[] };

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

    if (!acc[category]) acc[category] = [];
    acc[category].push({ name: skill.title, level: progress });
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
      className="bg-[var(--muted)]/30"
    >
      <div className="grid md:grid-cols-2 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-[var(--radius-xl)] p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--accent)]" />
              {category.title}
            </h3>
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: categoryIndex * 0.1 + skillIndex * 0.05,
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {skill.name}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--accent)]"
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
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
