"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Section, Badge } from "@/app/components/ui";
import type { Education as EducationItem } from "@/types";

interface EducationProps {
  educationItems?: EducationItem[] | null;
}

const KNOWN_KEYS = new Set(["institution", "period", "honors"]);

type CardItem = {
  degree: string;
  institution: string;
  period: string;
  description: string;
  htmlContent: string;
  honors: boolean;
  image: string | null;
  extraMeta: Record<string, string>;
};

export default function Education({ educationItems: backendEducation }: EducationProps) {
  const t = useTranslations("education");

  const fallbackEducationItems: CardItem[] = [
    {
      degree: t("items.edu1.degree"),
      institution: t("items.edu1.institution"),
      period: t("items.edu1.period"),
      description: t("items.edu1.description"),
      htmlContent: "",
      honors: true,
      image: null,
      extraMeta: {},
    },
    {
      degree: t("items.edu2.degree"),
      institution: t("items.edu2.institution"),
      period: t("items.edu2.period"),
      description: t("items.edu2.description"),
      htmlContent: "",
      honors: false,
      image: null,
      extraMeta: {},
    },
  ];

  const fromBackend: CardItem[] = (backendEducation || []).map((item) => {
    const metadata = (item.metadata || {}) as Record<string, unknown>;
    const institution = typeof metadata.institution === "string" && metadata.institution.trim()
      ? metadata.institution
      : t("items.edu1.institution");
    const period = typeof metadata.period === "string" && metadata.period.trim()
      ? metadata.period
      : `${new Date(item.created_at).getFullYear()}`;
    const honors = typeof metadata.honors === "boolean" ? metadata.honors : false;
    const image = item.images && item.images.length > 0 ? item.images[0] : null;
    const extraMeta: Record<string, string> = {};
    for (const [k, v] of Object.entries(metadata)) {
      if (!KNOWN_KEYS.has(k)) {
        extraMeta[k] = typeof v === "string" ? v : JSON.stringify(v);
      }
    }

    return {
      degree: item.title,
      institution,
      period,
      description: item.description || "",
      htmlContent: item.content || "",
      honors,
      image,
      extraMeta,
    };
  });

  const educationItems = fromBackend.length > 0 ? fromBackend : fallbackEducationItems;

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
            className="bg-(--card) border border-(--card-border) rounded-xl overflow-hidden hover:shadow-xl hover:border-(--primary)/30 transition-all duration-300"
          >
            {/* Cover image */}
            {edu.image ? (
              <div className="relative h-40 w-full">
                <Image
                  src={edu.image}
                  alt={edu.degree}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center bg-linear-to-br from-(--gradient-start)/20 via-(--gradient-mid)/20 to-(--gradient-end)/20">
                <GraduationCap className="w-10 h-10 text-(--primary)/30" />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-(--primary)/10 text-(--primary) shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  {edu.honors && (
                    <Badge variant="primary" className="mb-3">
                      <Award className="w-3 h-3 mr-1" />
                      Grado de Honor
                    </Badge>
                  )}
                  
                  <h3 className="text-lg font-bold text-(--foreground) mb-2">
                    {edu.degree}
                  </h3>
                  
                  <p className="text-(--primary) font-medium mb-2">
                    {edu.institution}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-sm text-(--muted-foreground) mb-3">
                    <Calendar className="w-4 h-4" />
                    {edu.period}
                  </div>
                  
                  {edu.description && (
                    <p className="text-(--muted-foreground) text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                  {edu.htmlContent && (
                    <div
                      className="text-(--muted-foreground) text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_a]:text-(--primary) [&_a]:underline [&_strong]:font-semibold [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: edu.htmlContent }}
                    />
                  )}

                  {Object.keys(edu.extraMeta).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(edu.extraMeta).map(([k, v]) => (
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
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
