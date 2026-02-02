"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section, Badge } from "@/app/components/ui";

export default function Education() {
  const t = useTranslations("education");

  const educationItems = [
    {
      degree: t("items.edu1.degree"),
      institution: t("items.edu1.institution"),
      period: t("items.edu1.period"),
      description: t("items.edu1.description"),
      honors: true,
    },
    {
      degree: t("items.edu2.degree"),
      institution: t("items.edu2.institution"),
      period: t("items.edu2.period"),
      description: t("items.edu2.description"),
      honors: false,
    },
  ];

  return (
    <Section
      id="education"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid md:grid-cols-2 gap-6">
        {educationItems.map((edu, index) => (
          <motion.div
            key={edu.degree + edu.institution}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-[var(--radius-xl)] p-6 hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                {edu.honors && (
                  <Badge variant="primary" className="mb-3">
                    <Award className="w-3 h-3 mr-1" />
                    Grado de Honor
                  </Badge>
                )}
                
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  {edu.degree}
                </h3>
                
                <p className="text-[var(--primary)] font-medium mb-2">
                  {edu.institution}
                </p>
                
                <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-3">
                  <Calendar className="w-4 h-4" />
                  {edu.period}
                </div>
                
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
