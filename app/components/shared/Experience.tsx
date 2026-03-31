"use client";

import { motion } from "framer-motion";
import { Building2, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Section, Badge } from "@/app/components/ui";
import type { Experience as ExperienceItem } from "@/types";

interface ExperienceProps {
  experiences?: ExperienceItem[] | null;
}

const KNOWN_KEYS = new Set(["technologies", "company", "period", "current"]);

type TimelineItem = {
  title: string;
  company: string;
  period: string;
  description: string;
  htmlContent: string;
  technologies: string[];
  current: boolean;
  image: string | null;
  extraMeta: Record<string, string>;
};

export default function Experience({ experiences: backendExperiences }: ExperienceProps) {
  const t = useTranslations("experience");

  const fallbackItems: TimelineItem[] = [
    {
      title: t("jobs.job1.title"),
      company: t("jobs.job1.company"),
      period: t("jobs.job1.period"),
      description: t("jobs.job1.description"),
      htmlContent: "",
      technologies: ["React", "TypeScript", "Node.js", "Python", "Docker", "AWS"],
      current: true,
      image: null,
      extraMeta: {},
    },
  ];

  const fromBackend: TimelineItem[] = (backendExperiences || []).map((item) => {
    const metadata = (item.metadata || {}) as Record<string, unknown>;
    const technologies = Array.isArray(metadata.technologies)
      ? (metadata.technologies as string[])
      : [];
    const company = typeof metadata.company === "string" && metadata.company.trim()
      ? metadata.company
      : t("jobs.job1.company");
    const period = typeof metadata.period === "string" && metadata.period.trim()
      ? metadata.period
      : `${new Date(item.created_at).getFullYear()} - ${item.deleted_at ? new Date(item.deleted_at).getFullYear() : t("current")}`;
    const current = typeof metadata.current === "boolean" ? metadata.current : !item.deleted_at;
    const image = item.images && item.images.length > 0 ? item.images[0] : null;
    const extraMeta: Record<string, string> = {};
    for (const [k, v] of Object.entries(metadata)) {
      if (!KNOWN_KEYS.has(k)) {
        extraMeta[k] = typeof v === "string" ? v : JSON.stringify(v);
      }
    }

    return {
      title: item.title,
      company,
      period,
      description: item.description || "",
      htmlContent: item.content || "",
      technologies,
      current,
      image,
      extraMeta,
    };
  });

  const experiences = fromBackend.length > 0 ? fromBackend : fallbackItems;

  return (
    <Section
      id="experience"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-linear-to-b from-(--gradient-start) via-(--gradient-mid) to-(--gradient-end)" />

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title + exp.company}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-(--primary) border-4 border-(--background) shadow-lg z-10">
                {exp.current && (
                  <span className="absolute inset-0 rounded-full bg-(--primary) animate-ping opacity-50" />
                )}
              </div>

              {/* Content */}
              <div className="md:w-1/2 ml-8 md:ml-0">
                <div
                  className={`bg-(--card) border border-(--card-border) rounded-xl p-6 hover:shadow-xl hover:border-(--primary)/30 transition-all duration-300 ${
                    index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                  }`}
                >
                  {exp.current && (
                    <Badge variant="primary" className="mb-4">
                      {t("current")}
                    </Badge>
                  )}

                  {/* Cover image */}
                  {exp.image && (
                    <div className="relative h-36 -mx-6 -mt-2 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-(--foreground) mb-2">
                    {exp.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-(--muted-foreground) mb-4">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {exp.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                  </div>
                  
                  {exp.description && (
                    <p className="text-(--muted-foreground) mb-4 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.htmlContent && (
                    <div
                      className="text-(--muted-foreground) mb-4 leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_a]:text-(--primary) [&_a]:underline [&_strong]:font-semibold [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: exp.htmlContent }}
                    />
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {Object.keys(exp.extraMeta).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(exp.extraMeta).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-(--card-border) text-(--muted-foreground)"
                        >
                          <span className="font-semibold text-(--primary)">{k}:</span> {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Spacer for the other side */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
