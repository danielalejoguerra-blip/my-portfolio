"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Calendar, MapPin, Briefcase, Laptop, Users,
  ChevronDown, ExternalLink, Award, CheckCircle2, Globe,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Section, Badge } from "@/app/components/ui";
import type { Experience as ExperienceItem } from "@/types";

interface ExperienceProps {
  experiences?: ExperienceItem[] | null;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return "";
  const [y, m] = d.split("-");
  if (!m) return y;
  return new Date(`${y}-${m}-01`).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function fmtPeriod(start?: string | null, end?: string | null, isCurrent?: boolean, currentLabel = "Present"): string {
  if (!start) return "";
  const s = fmtDate(start);
  if (isCurrent) return `${s} – ${currentLabel}`;
  if (end) return `${s} – ${fmtDate(end)}`;
  return s;
}

const EMPLOYMENT_KEYS: Record<string, string> = {
  full_time: "full_time", part_time: "part_time", contract: "contract",
  freelance: "freelance", internship: "internship", volunteer: "volunteer", other: "other",
};
const WORK_MODE_KEYS: Record<string, string> = {
  remote: "remote", on_site: "on_site", hybrid: "hybrid",
};

export default function Experience({ experiences: backendExperiences }: ExperienceProps) {
  const t = useTranslations("experience");
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  const hasBe = backendExperiences && backendExperiences.length > 0;

  const fallback = [
    {
      id: "fb1", title: t("jobs.job1.title"), company: t("jobs.job1.company"),
      period: t("jobs.job1.period"), description: t("jobs.job1.description"),
      technologies: ["React", "TypeScript", "Node.js", "Python", "Docker", "AWS"],
    },
  ];

  return (
    <Section id="experience" title={t("title")} subtitle={t("subtitle")}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-linear-to-b from-(--gradient-start) via-(--gradient-mid) to-(--gradient-end) opacity-30" />

        <div className="space-y-10">
          {hasBe
            ? backendExperiences!.map((exp, index) => {
                const period = fmtPeriod(exp.start_date, exp.end_date, exp.is_current, t("current"));
                const techs = exp.tech_stack || [];
                const expanded = expandedId === exp.id;
                const hasExtra = (exp.responsibilities && exp.responsibilities.length > 0)
                  || (exp.achievements && exp.achievements.length > 0)
                  || !!exp.content;

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10">
                      <div className="relative w-5 h-5 rounded-full bg-(--primary) border-4 border-(--background) shadow-lg shadow-(--primary)/30">
                        {exp.is_current && (
                          <span className="absolute inset-0 rounded-full bg-(--primary) animate-ping opacity-40" />
                        )}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="md:w-1/2 ml-10 md:ml-0">
                      <div className={`bg-(--card) border border-(--card-border) rounded-2xl overflow-hidden group hover:shadow-xl hover:border-(--primary)/30 transition-all duration-300 ${index % 2 === 0 ? "md:mr-10" : "md:ml-10"}`}>

                        {/* Cover image */}
                        {exp.images && exp.images.length > 0 && (
                          <div className="relative h-32 w-full overflow-hidden">
                            <Image
                              src={exp.images[0]} alt={exp.title} fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                          </div>
                        )}

                        <div className="p-5">
                          {/* Header */}
                          <div className="flex items-start gap-3 mb-3">
                            {/* Logo or icon */}
                            <div className="shrink-0 mt-0.5">
                              {exp.company_logo_url ? (
                                <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-(--card-border) bg-(--background)">
                                  <Image src={exp.company_logo_url} alt={exp.company || ""} fill className="object-contain p-1.5" sizes="44px" />
                                </div>
                              ) : (
                                <div className="w-11 h-11 rounded-xl bg-(--primary)/10 flex items-center justify-center text-(--primary)">
                                  <Briefcase className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {exp.is_current && (
                                <div className="mb-1.5"><Badge variant="primary">{t("current")}</Badge></div>
                              )}
                              <h3 className="text-lg font-bold text-(--foreground) leading-tight group-hover:text-(--primary) transition-colors">
                                {exp.title}
                              </h3>
                              {exp.company && (
                                exp.company_url
                                  ? <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="text-(--primary) font-semibold text-sm hover:underline inline-flex items-center gap-1 mt-0.5">
                                      <Building2 className="w-3.5 h-3.5" />{exp.company} <ExternalLink className="w-3 h-3" />
                                    </a>
                                  : <p className="text-(--primary) font-semibold text-sm flex items-center gap-1 mt-0.5">
                                      <Building2 className="w-3.5 h-3.5" />{exp.company}
                                    </p>
                              )}
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-(--muted-foreground)">
                            {period && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 shrink-0" />{period}
                              </span>
                            )}
                            {exp.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />{exp.location}
                              </span>
                            )}
                            {exp.department && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 shrink-0" />{exp.department}
                              </span>
                            )}
                          </div>

                          {/* Badges */}
                          {(exp.employment_type || exp.work_mode) && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {exp.employment_type && (
                                <Badge variant="outline">
                                  <Briefcase className="w-3 h-3 mr-1" />
                                  {t(`employmentType.${EMPLOYMENT_KEYS[exp.employment_type] ?? exp.employment_type}`)}
                                </Badge>
                              )}
                              {exp.work_mode && (
                                <Badge variant="secondary">
                                  <Laptop className="w-3 h-3 mr-1" />
                                  {t(`workMode.${WORK_MODE_KEYS[exp.work_mode] ?? exp.work_mode}`)}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Description */}
                          {exp.description && (
                            <p className="text-sm text-(--muted-foreground) leading-relaxed mb-3">{exp.description}</p>
                          )}

                          {/* Tech stack */}
                          {techs.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {techs.map((tech) => (
                                <Badge key={tech.name} variant="secondary">{tech.name}</Badge>
                              ))}
                            </div>
                          )}

                          {/* Expand toggle */}
                          {hasExtra && (
                            <button
                              onClick={() => setExpandedId(expanded ? null : exp.id)}
                              className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-(--primary) hover:opacity-75 transition-opacity"
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                              {expanded ? t("showLess") : t("showMore")}
                            </button>
                          )}

                          {/* Expanded */}
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 space-y-4 border-t border-(--card-border) mt-3">
                                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                                    <div>
                                      <p className="text-xs font-bold text-(--foreground) mb-2 uppercase tracking-wider">{t("responsibilities")}</p>
                                      <ul className="space-y-1.5">
                                        {exp.responsibilities.map((r, i) => (
                                          <li key={i} className="flex items-start gap-2 text-xs text-(--muted-foreground)">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-(--primary) shrink-0 mt-0.5" />
                                            {r}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {exp.achievements && exp.achievements.length > 0 && (
                                    <div>
                                      <p className="text-xs font-bold text-(--foreground) mb-2 uppercase tracking-wider">{t("achievements")}</p>
                                      <div className="space-y-2">
                                        {exp.achievements.map((a, i) => (
                                          <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-(--primary)/5 border border-(--primary)/15">
                                            <Award className="w-4 h-4 text-(--primary) shrink-0 mt-0.5" />
                                            <div className="text-xs min-w-0">
                                              <span className="font-semibold text-(--foreground)">{a.label}</span>
                                              {a.value && <span className="text-(--muted-foreground)"> — {a.value}</span>}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {exp.content && (
                                    <div
                                      className="text-xs text-(--muted-foreground) leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_a]:text-(--primary) [&_a]:underline [&_strong]:font-semibold [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold"
                                      dangerouslySetInnerHTML={{ __html: exp.content }}
                                    />
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                );
              })
            : fallback.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative flex flex-col md:flex-row gap-8"
                >
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10">
                    <div className="relative w-5 h-5 rounded-full bg-(--primary) border-4 border-(--background) shadow-lg">
                      <span className="absolute inset-0 rounded-full bg-(--primary) animate-ping opacity-40" />
                    </div>
                  </div>
                  <div className="md:w-1/2 ml-10 md:ml-10">
                    <div className="bg-(--card) border border-(--card-border) rounded-2xl p-5 hover:shadow-xl hover:border-(--primary)/30 transition-all duration-300">
                      <div className="mb-2"><Badge variant="primary">{t("current")}</Badge></div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-(--primary)/10 flex items-center justify-center text-(--primary) shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-(--foreground)">{exp.title}</h3>
                          <p className="text-(--primary) font-semibold text-sm">{exp.company}</p>
                        </div>
                      </div>
                      <p className="text-xs text-(--muted-foreground) flex items-center gap-1 mb-2">
                        <Calendar className="w-3.5 h-3.5" />{exp.period}
                      </p>
                      <p className="text-sm text-(--muted-foreground) leading-relaxed">{exp.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))
          }
        </div>
      </div>
    </Section>
  );
}

