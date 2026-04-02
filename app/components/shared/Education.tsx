"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, Award, MapPin, X, BookOpen, Star, ExternalLink, CheckCircle2, Users, ChevronRight } from "lucide-react";
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
  degreeType: string | null;
  institution: string;
  institutionUrl: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  isOngoing: boolean;
  period: string;
  location: string | null;
  grade: string | null;
  honors: string | null;
  credentialUrl: string | null;
  coursework: string[];
  activities: { name: string; role?: string | null; description?: string | null }[];
  achievements: string[];
  achievementsDetailed: { title: string; year?: number | null; description?: string | null }[];
  description: string;
  htmlContent: string;
  image: string | null;
};

function formatPeriod(start?: string | null, end?: string | null, presentLabel = "Present"): string {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    if (!m) return y;
    return new Date(`${y}-${m}-01`).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `${fmt(start)} – ${presentLabel}`;
  return "";
}

const DEGREE_KEYS: Record<string, string> = {
  bachelor: "bachelor", master: "master", phd: "phd", associate: "associate",
  bootcamp: "bootcamp", certification: "certification", online_course: "online_course",
  high_school: "high_school", other: "other",
};

export default function Education({ educationItems: backendEducation }: EducationProps) {
  const t = useTranslations("education");
  const [selected, setSelected] = useState<CardItem | null>(null);

  const fallbackItems: CardItem[] = [
    {
      id: "fb1",
      degree: t("items.edu1.degree"),
      degreeType: null,
      institution: t("items.edu1.institution"),
      institutionUrl: null,
      fieldOfStudy: null,
      startDate: null,
      endDate: null,
      isOngoing: false,
      period: t("items.edu1.period"),
      location: null,
      grade: null,
      honors: null,
      credentialUrl: null,
      coursework: [],
      activities: [],
      achievements: [],
      achievementsDetailed: [],
      description: t("items.edu1.description"),
      htmlContent: "",
      image: null,
    },
    {
      id: "fb2",
      degree: t("items.edu2.degree"),
      degreeType: null,
      institution: t("items.edu2.institution"),
      institutionUrl: null,
      fieldOfStudy: null,
      startDate: null,
      endDate: null,
      isOngoing: false,
      period: t("items.edu2.period"),
      location: null,
      grade: null,
      honors: null,
      credentialUrl: null,
      coursework: [],
      activities: [],
      achievements: [],
      achievementsDetailed: [],
      description: t("items.edu2.description"),
      htmlContent: "",
      image: null,
    },
  ];

  const fromBackend: CardItem[] = (backendEducation || []).map((item) => {
    const startDate = item.start_date || null;
    const endDate = item.end_date || null;
    const period = formatPeriod(startDate, endDate, t("present")) || String(new Date(item.created_at).getFullYear());
    const image = item.images && item.images.length > 0 ? item.images[0] : null;

    return {
      id: item.id,
      degree: item.title,
      degreeType: item.degree_type || null,
      institution: item.institution || t("items.edu1.institution"),
      institutionUrl: item.institution_url || null,
      fieldOfStudy: item.field_of_study || null,
      startDate,
      endDate,
      isOngoing: !!item.is_ongoing,
      period,
      location: item.location || null,
      grade: item.grade || null,
      honors: item.honors || null,
      credentialUrl: item.credential_url || null,
      coursework: item.relevant_coursework || [],
      activities: item.activities || [],
      achievements: [],
      achievementsDetailed: item.achievements || [],
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
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {edu.degreeType && (
                        <Badge variant="primary">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {t(`degreeType.${DEGREE_KEYS[edu.degreeType] ?? edu.degreeType}`)}
                        </Badge>
                      )}
                      {edu.honors && (
                        <Badge variant="secondary">
                          <Award className="w-3 h-3 mr-1" />
                          {edu.honors}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-(--foreground) mb-1 group-hover:text-(--primary) transition-colors">
                      {edu.degree}
                    </h3>

                    {edu.fieldOfStudy && (
                      <p className="text-sm text-(--muted-foreground) mb-1">{edu.fieldOfStudy}</p>
                    )}

                    {edu.institutionUrl
                      ? <a href={edu.institutionUrl} target="_blank" rel="noopener noreferrer" className="text-(--primary) font-medium mb-2 inline-flex items-center gap-1 hover:underline">
                          {edu.institution} <ExternalLink className="w-3 h-3" />
                        </a>
                      : <p className="text-(--primary) font-medium mb-2">{edu.institution}</p>
                    }

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
                      {edu.grade && (
                        <span className="flex items-center gap-1.5">
                          <Star className="w-4 h-4" />
                          {edu.grade}
                        </span>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-(--muted-foreground) text-sm leading-relaxed line-clamp-2">
                        {edu.description}
                      </p>
                    )}

                    {edu.coursework.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {edu.coursework.slice(0, 5).map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                        {edu.coursework.length > 5 && (
                          <Badge variant="outline" className="text-xs">+{edu.coursework.length - 5}</Badge>
                        )}
                      </div>
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

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selected.degreeType && (
                    <Badge variant="primary">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {t(`degreeType.${DEGREE_KEYS[selected.degreeType] ?? selected.degreeType}`)}
                    </Badge>
                  )}
                  {selected.honors && (
                    <Badge variant="secondary">
                      <Award className="w-3 h-3 mr-1" />{selected.honors}
                    </Badge>
                  )}
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
                  {selected.grade && (
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4" /> {selected.grade}
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

                {selected.coursework.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide mb-2">{t("coursework")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.coursework.map((c) => (
                        <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.activities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide mb-2">{t("activities")}</p>
                    <div className="space-y-1.5">
                      {selected.activities.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <ChevronRight className="w-3.5 h-3.5 text-(--primary) shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-(--foreground)">{a.name}</span>
                            {a.role && <span className="text-(--muted-foreground)"> · {a.role}</span>}
                            {a.description && <p className="text-(--muted-foreground) mt-0.5">{a.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.achievementsDetailed.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide mb-2">{t("achievements")}</p>
                    <div className="space-y-2">
                      {selected.achievementsDetailed.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-(--primary)/5 border border-(--primary)/15">
                          <Award className="w-4 h-4 text-(--primary) shrink-0 mt-0.5" />
                          <div className="text-xs min-w-0">
                            <span className="font-semibold text-(--foreground)">{a.title}</span>
                            {a.year && <span className="text-(--muted-foreground)"> · {a.year}</span>}
                            {a.description && <p className="text-(--muted-foreground) mt-0.5">{a.description}</p>}
                          </div>
                        </div>
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

                {selected.credentialUrl && (
                  <a
                    href={selected.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--primary) text-white text-sm hover:opacity-90 transition-opacity w-full justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("viewCredential")}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
