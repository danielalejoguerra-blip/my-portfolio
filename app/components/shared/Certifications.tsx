"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section, Badge } from "@/app/components/ui";

export default function Certifications() {
  const t = useTranslations("certifications");

  const certifications = [
    {
      name: t("items.cert1.name"),
      platform: t("items.cert1.platform"),
      year: t("items.cert1.year"),
    },
    {
      name: t("items.cert2.name"),
      platform: t("items.cert2.platform"),
      year: t("items.cert2.year"),
    },
    {
      name: t("items.cert3.name"),
      platform: t("items.cert3.platform"),
      year: t("items.cert3.year"),
    },
  ];

  return (
    <Section
      id="certifications"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-[var(--radius-xl)] p-6 hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-[var(--gradient-start)]/20 to-[var(--gradient-end)]/20 text-[var(--primary)] mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8" />
              </div>
              
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                {cert.name}
              </h3>
              
              <Badge variant="secondary" className="mb-2">
                {cert.platform}
              </Badge>
              
              <p className="text-sm text-[var(--muted-foreground)]">
                {cert.year}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
