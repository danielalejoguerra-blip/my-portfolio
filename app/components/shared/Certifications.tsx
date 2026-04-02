"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, BookOpen, ExternalLink, X, Clock, Calendar, Tag, User, Github, BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Section, Card, Badge } from "@/app/components/ui";
import type { Course } from "@/types";

interface CertificationsProps {
  courses?: Course[] | null;
}

type CourseCard = {
  id: number | string;
  name: string;
  description: string;
  platform: string;
  platformUrl: string | null;
  instructor: string | null;
  instructorUrl: string | null;
  completionDate: string | null;
  expirationDate: string | null;
  durationHours: number | null;
  isExpired: boolean;
  isCertification: boolean;
  level: string | null;
  skills: string[];
  category: string | null;
  certificateUrl: string | null;
  badgeUrl: string | null;
  credentialId: string | null;
  syllabus: { title: string; topics?: string[]; duration_minutes?: number | null }[];
  htmlContent: string;
  image: string | null;
};

function isGithubUrl(url: string) {
  return /github\.com/i.test(url);
}

function LinkIcon({ url }: { url: string }) {
  if (isGithubUrl(url)) return <Github className="w-3.5 h-3.5" />;
  return <ExternalLink className="w-3.5 h-3.5" />;
}

const LEVEL_KEYS: Record<string, string> = {
  beginner: "beginner", intermediate: "intermediate", advanced: "advanced", expert: "expert",
};
const CATEGORY_KEYS: Record<string, string> = {
  backend: "backend", frontend: "frontend", mobile: "mobile", devops: "devops",
  data: "data", design: "design", security: "security", cloud: "cloud",
  soft_skills: "soft_skills", other: "other",
};

export default function Certifications({ courses: backendCourses }: CertificationsProps) {
  const t = useTranslations("certifications");
  const [selected, setSelected] = useState<CourseCard | null>(null);

  const fallback: { name: string; platform: string; year: string }[] = [
    { name: t("items.cert1.name"), platform: t("items.cert1.platform"), year: t("items.cert1.year") },
    { name: t("items.cert2.name"), platform: t("items.cert2.platform"), year: t("items.cert2.year") },
    { name: t("items.cert3.name"), platform: t("items.cert3.platform"), year: t("items.cert3.year") },
  ];

  const fromBackend: CourseCard[] = (backendCourses || []).map((course) => {
    const image = course.images && course.images.length > 0 ? course.images[0] : null;
    return {
      id: course.id,
      name: course.title,
      description: course.description || "",
      platform: course.platform || "Course",
      platformUrl: course.platform_url || null,
      instructor: course.instructor || null,
      instructorUrl: course.instructor_url || null,
      completionDate: course.completion_date || null,
      expirationDate: course.expiration_date || null,
      durationHours: course.duration_hours || null,
      isExpired: !!course.is_expired,
      isCertification: !!course.is_certification,
      level: course.level || null,
      skills: (course.skills_gained || []).map((s) => s.name),
      category: course.category || null,
      certificateUrl: course.certificate_url || null,
      badgeUrl: course.badge_url || null,
      credentialId: course.credential_id || null,
      syllabus: course.syllabus || [],
      htmlContent: course.content || "",
      image: course.certificate_image_url || image,
    };
  });

  if (fromBackend.length > 0) {
    return (
      <>
        <Section id="certifications" title={t("title")} subtitle={t("subtitle")}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fromBackend.map((course, index) => (
              <motion.div
                key={String(course.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelected(course)}
              >
                <Card className="h-full flex flex-col group overflow-hidden cursor-pointer" whileHover={{ y: -5 }}>
                  <div className="relative h-44 -mx-6 -mt-6 mb-4 bg-linear-to-br from-(--gradient-start)/20 via-(--gradient-mid)/20 to-(--gradient-end)/20 rounded-t-xl overflow-hidden">
                    {course.badgeUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <Image src={course.badgeUrl} alt={course.name} width={120} height={120} className="object-contain drop-shadow-lg" />
                      </div>
                    ) : course.image ? (
                      <Image src={course.image} alt={course.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-14 h-14 text-(--primary)/30 group-hover:text-(--primary)/60 transition-colors" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {course.isCertification && (
                        <Badge variant="primary">
                          <BadgeCheck className="w-3 h-3 mr-1" />{t("certified")}
                        </Badge>
                      )}
                      {course.level && (
                        <Badge variant="secondary">{t(`level.${LEVEL_KEYS[course.level] ?? course.level}`)}</Badge>
                      )}
                      {!course.isCertification && course.category && (
                        <Badge variant="outline">{t(`category.${CATEGORY_KEYS[course.category] ?? course.category}`)}</Badge>
                      )}
                    </div>
                    {course.certificateUrl && (
                      <a
                        href={course.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-(--primary)/10 text-(--primary) hover:scale-110 transition-transform"
                        aria-label="View certificate"
                      >
                        <LinkIcon url={course.certificateUrl} />
                      </a>
                    )}
                    {course.isExpired && (
                      <div className="absolute bottom-0 inset-x-0 bg-orange-500/90 text-white text-center text-xs py-1 font-medium">{t("expired")}</div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-(--foreground) group-hover:text-(--primary) transition-colors leading-tight mb-2">
                      {course.name}
                    </h3>

                    {course.description && (
                      <p className="text-xs text-(--muted-foreground) mb-3 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {course.platformUrl
                        ? <a href={course.platformUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <Badge variant="secondary" className="hover:opacity-80 transition-opacity cursor-pointer">
                              <Award className="w-3 h-3 mr-1" />{course.platform} <ExternalLink className="w-2.5 h-2.5 ml-1" />
                            </Badge>
                          </a>
                        : <Badge variant="secondary"><Award className="w-3 h-3 mr-1" />{course.platform}</Badge>
                      }
                      {course.completionDate && <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />{course.completionDate}</Badge>}
                      {course.instructor && (
                        <Badge variant="outline">
                          <User className="w-3 h-3 mr-1" />
                          {course.instructor}
                        </Badge>
                      )}
                      {course.durationHours && (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.durationHours}h
                        </Badge>
                      )}
                      {course.skills.slice(0, 4).map((s) => (
                        <Badge key={s} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Detail Modal */}
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
                    <Image src={selected.image} alt={selected.name} fill className="object-cover" sizes="512px" />
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center bg-linear-to-br from-(--gradient-start)/20 via-(--gradient-mid)/20 to-(--gradient-end)/20 rounded-t-2xl">
                    <BookOpen className="w-12 h-12 text-(--primary)/40" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-(--foreground)">{selected.name}</h2>
                      {selected.platformUrl
                        ? <a href={selected.platformUrl} target="_blank" rel="noopener noreferrer" className="text-(--primary) font-medium mt-0.5 inline-flex items-center gap-1 hover:underline">
                            {selected.platform} <ExternalLink className="w-3 h-3" />
                          </a>
                        : <p className="text-(--primary) font-medium mt-0.5">{selected.platform}</p>
                      }
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-2 rounded-full hover:bg-(--muted) transition-colors shrink-0 text-(--muted-foreground)"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selected.isCertification && (
                      <Badge variant="primary"><BadgeCheck className="w-3 h-3 mr-1" />{t("certification")}</Badge>
                    )}
                    {selected.level && <Badge variant="secondary">{t(`level.${LEVEL_KEYS[selected.level] ?? selected.level}`)}</Badge>}
                    {selected.category && <Badge variant="outline">{t(`category.${CATEGORY_KEYS[selected.category] ?? selected.category}`)}</Badge>}
                    {selected.isExpired && <Badge variant="outline" className="text-orange-500 border-orange-500">{t("expired")}</Badge>}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-(--muted-foreground) mb-4">
                    {selected.completionDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {selected.completionDate}
                      </span>
                    )}
                    {selected.expirationDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {t("expires", { date: selected.expirationDate })}
                      </span>
                    )}
                    {selected.durationHours && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {selected.durationHours}h
                      </span>
                    )}
                    {selected.instructor && (
                      selected.instructorUrl
                        ? <a href={selected.instructorUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-(--primary) transition-colors">
                            <User className="w-4 h-4" /> {selected.instructor} <ExternalLink className="w-3 h-3" />
                          </a>
                        : <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" /> {selected.instructor}
                          </span>
                    )}
                    {selected.credentialId && (
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4" /> {t("credentialId", { id: selected.credentialId })}
                      </span>
                    )}
                  </div>

                  {selected.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide mb-2">{t("skills")}</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.skills.map((s) => (
                          <Badge key={s} variant="outline">
                            <Tag className="w-3 h-3 mr-1" /> {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.syllabus.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide mb-2">{t("syllabus")}</p>
                      <div className="space-y-1.5">
                        {selected.syllabus.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className="w-5 h-5 rounded-full bg-(--primary)/10 text-(--primary) flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                            <div className="min-w-0">
                              <span className="font-medium text-(--foreground)">{item.title}</span>
                              {item.duration_minutes && <span className="ml-2 text-(--muted-foreground)">({Math.round(item.duration_minutes / 60 * 10) / 10}h)</span>}
                              {item.topics && item.topics.length > 0 && (
                                <p className="text-(--muted-foreground) mt-0.5">{item.topics.join(" · ")}</p>
                              )}
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
                      className="text-(--muted-foreground) text-sm leading-relaxed mb-4
                        [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4
                        [&_a]:text-(--primary) [&_a]:underline
                        [&_strong]:font-semibold [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: selected.htmlContent }}
                    />
                  )}

                  {selected.certificateUrl && (
                    <a
                      href={selected.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--primary) text-white text-sm hover:opacity-90 transition-opacity w-full justify-center"
                    >
                      <LinkIcon url={selected.certificateUrl} />
                      {isGithubUrl(selected.certificateUrl) ? t("viewOnGithub") : t("viewCertificate")}
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

  // Fallback: simple badge grid
  return (
    <Section id="certifications" title={t("title")} subtitle={t("subtitle")}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fallback.map((cert, index) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-(--card) border border-(--card-border) rounded-xl p-6 hover:shadow-xl hover:border-(--primary)/30 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-linear-to-br from-(--gradient-start)/20 to-(--gradient-end)/20 text-(--primary) mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-(--foreground) mb-2">{cert.name}</h3>
              <Badge variant="secondary" className="mb-2">{cert.platform}</Badge>
              <p className="text-sm text-(--muted-foreground)">{cert.year}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
