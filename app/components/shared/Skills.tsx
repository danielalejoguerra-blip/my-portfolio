"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/app/components/ui";

export default function Skills() {
  const t = useTranslations("skills");

  const skillCategories = [
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
