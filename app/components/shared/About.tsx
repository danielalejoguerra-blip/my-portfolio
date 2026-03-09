"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section, Badge } from "@/app/components/ui";
import type { PersonalInfo } from "@/types";

interface AboutProps {
  personalInfo?: PersonalInfo | null;
}

export default function About({ personalInfo }: AboutProps) {
  const t = useTranslations("about");

  const metadata = (personalInfo?.metadata || {}) as Record<string, unknown>;
  const aboutYears = typeof metadata.years_experience === "number"
    ? `${metadata.years_experience}+`
    : "1+";
  const aboutProjects = typeof metadata.projects_count === "number"
    ? `${metadata.projects_count}+`
    : "3+";
  const aboutTechs = typeof metadata.technologies_count === "number"
    ? `${metadata.technologies_count}+`
    : "10+";
  const location = personalInfo?.location || t("location");
  const role = personalInfo?.headline || t("experience");
  const bio = personalInfo?.bio || null;

  const stats = [
    { number: aboutYears, label: t("stats.years") },
    { number: aboutProjects, label: t("stats.projects") },
    { number: aboutTechs, label: t("stats.technologies") },
    { number: "100%", label: t("stats.commitment") },
  ];

  return (
    <Section
      id="about"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Info side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">
              <MapPin className="w-3 h-3 mr-1.5" />
              {location}
            </Badge>
            <Badge variant="primary">
              <Calendar className="w-3 h-3 mr-1.5" />
              {role}
            </Badge>
            <Badge variant="primary">
              <Briefcase className="w-3 h-3 mr-1.5" />
              {t("available")}
            </Badge>
          </div>

          {bio ? (
            <p className="text-(--muted-foreground) text-lg leading-relaxed">
              {bio}
            </p>
          ) : (
            <>
              <p className="text-(--muted-foreground) text-lg leading-relaxed">
                {t.rich("description1", {
                  role: (chunks) => <span className="text-(--foreground) font-medium">{chunks}</span>,
                })}
              </p>

              <p className="text-(--muted-foreground) text-lg leading-relaxed">
                {t.rich("description2", {
                  company: (chunks) => <span className="text-(--primary) font-medium">{chunks}</span>,
                })}
              </p>

              <p className="text-(--muted-foreground) text-lg leading-relaxed">
                {t("description3")}
              </p>
            </>
          )}
        </motion.div>

        {/* Stats side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="bg-(--card) border border-(--card-border) rounded-xl p-6 text-center hover:border-(--primary)/30 transition-colors duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-(--gradient-start) to-(--accent) bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-(--muted-foreground)">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
