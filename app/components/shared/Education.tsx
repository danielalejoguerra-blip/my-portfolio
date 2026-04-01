"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, Award, MapPin, X, BookOpen, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Section, Badge } from "@/app/components/ui";
import type { Education as EducationItem } from "@/types";

interface EducationProps {
  educationItems?: EducationItem[] | null;
}

type CardItem = {
  id: number | string;
  degree: string;
  institution: string;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  period: string;
  location: string | null;
  gpa: number | null;
  achievements: string[];
  description: string;
  htmlContent: string;
  image: string | null;
};

function formatPeriod(start?: string | null, end?: string | null): string {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    if (!m) return y;
    return new Date(`${y}-${m}-01`).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `${fmt(start)} – Present`;
  return "";
}

export default function Education({ educationItems: backendEducation }: EducationProps) {
  const t = useTranslations("education");
  const [selected, setSelected] = useState<CardItem | null>(null);

  const fallbackItems: CardItem[] = [
    {
      id: "fb1",
      degree: t("items.edu1.degree"),
      institution: t("items.edu1.institution"),
      fieldOfStudy: null,
      startDate: null,
      endDate: null,
      period: t("items.edu1.period"),
      location: null,
      gpa: null,
      achievements: [],
      description: t("items.edu1.description"),
      htmlContent: "",
      image: null,
    },
    {
      id: "fb2",
      degree: t("items.edu2.degree"),
      institution: t("items.edu2.institution"),
      fieldOfStudy: null,
      startDate: null,
      endDate: null,
      period: t("items.edu2.period"),
      location: null,
      gpa: null,
      achievements: [],
      description: t("items.edu2.description"),
      htmlContent: "",
      image: null,
    },
  ];

  const fromBackend: CardItem[] = (backendEducation || []).map((item) => {
    const meta = (item.metadata || {}) as Record<string, unknown>;
    const institution = typeof meta.institution === "string" ? meta.institution : t("items.edu1.institution");
    const fieldOfStudy = typeof meta.field_of_study === "string" ? meta.field_of_study : null;
    const startDate = typeof meta.start_date === "string" ? meta.start_date : null;
    const endDate = typeof meta.end_date === "string" ? meta.end_date : null;
    const period = formatPeriod(startDate, endDate) || String(new Date(item.created_at).getFullYear());
    const location = typeof meta.location === "string" ? meta.location : null;
    const gpa = typeof meta.gpa === "number" ? meta.gpa : null;
    const achievements = Array.isArray(meta.achievements) ? (meta.achievements as string[]) : [];
    const image = item.images && item.images.length > 0 ? item.images[0] : null;

    return {
      id: item.id,
      degree: item.title,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      period,
      location,
      gpa,
      achievements,
      description: item.description || "",
      htmlContent: item.content || "",
      image,
    };
  });

  const items = fromBackend.length > 0 ? fromBackend : fallbackItems;

  return (
    <>
      <Section id="education" title={t("title")} subtitle={t("subtitle")}>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((edu, index) => (
            <motion.div
              key={String(edu.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-(--card) border border-(--card-border) rounded-xl overflow-hidden hover:shadow-xl hover:border-(--primary)/30 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelected(edu)}
            >
              {edu.image ? (
                <div className="relative h-40 w-full">
                  <Image src={edu.image} alt={edu.degree} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ) : (
                <div className="h-28 flex items-center justify-center bg-linear-to-br from-(--gradient-start)/20 via-(--gradient-mid)/20 to-(--gradient-end)/20">
                  <GraduationCap className="w-10 h-10 text-(--primary)/30 group-hover:text-(--primary)/60 transition-colors" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-(--primary)/10 text-(--primary) shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {edu.achievements.length > 0 && (
                      <div className="mb-3">
                        <Badge variant="primary">
                          <Award className="w-3 h-3 mr-1" />
                          {edu.achievements[0]}
                        </Badge>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-(--foreground) mb-1 group-hover:text-(--primary) transition-colors">
                      {edu.degree}
                    </h3>

                    {edu.fieldOfStudy && (
                      <p className="text-sm text-(--muted-foreground) mb-1">{edu.fieldOfStudy}</p>
                    )}

                    <p className="text-(--primary) font-medium mb-2">{edu.institution}</p>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-(--muted-foreground) mb-3">
                      {edu.period && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {edu.period}
                        </span>
                      )}
                      {edu.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {edu.location}
                        </span>
                      )}
                      {edu.gpa && (
                        <span className="flex items-center gap-1.5">
                          <Star className="w-4 h-4" />
                          GPA {edu.gpa}
                        </span>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-(--muted-foreground) text-sm leading-relaxed line-clamp-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-(--card) border border-(--card-border) rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image ? (
                <div className="relative h-48 w-full rounded-t-2xl overflow-hidden">
                  <Image src={selected.image} alt={selected.degree} fill className="object-cover" sizes="512px" />
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center bg-linear-to-br from-(--gradient-start)/20 via-(--gradient-mid)/20 to-(--gradient-end)/20 rounded-t-2xl">
                  <GraduationCap className="w-12 h-12 text-(--primary)/40" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-(--foreground)">{selected.degree}</h2>
                    <p className="text-(--primary) font-medium mt-0.5">{selected.institution}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-full hover:bg-(--muted) transition-colors shrink-0 text-(--muted-foreground)"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-(--muted-foreground) mb-4">
                  {selected.period && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> {selected.period}
                    </span>
                  )}
                  {selected.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {selected.location}
                    </span>
                  )}
                  {selected.gpa && (
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4" /> GPA {selected.gpa}
                    </span>
                  )}
                </div>

                {selected.fieldOfStudy && (
                  <div className="mb-4">
                    <Badge variant="outline">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {selected.fieldOfStudy}
                    </Badge>
                  </div>
                )}

                {selected.achievements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide mb-2">Achievements</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.achievements.map((a, i) => (
                        <Badge key={i} variant="primary">
                          <Award className="w-3 h-3 mr-1" /> {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.description && (
                  <p className="text-(--muted-foreground) text-sm leading-relaxed mb-4">{selected.description}</p>
                )}

                {selected.htmlContent && (
                  <div
                    className="text-(--muted-foreground) text-sm leading-relaxed
                      [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4
                      [&_a]:text-(--primary) [&_a]:underline
                      [&_strong]:font-semibold [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: selected.htmlContent }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
