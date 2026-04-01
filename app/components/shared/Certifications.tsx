"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, BookOpen, ExternalLink, X, Clock, Calendar, Tag, User, Github } from "lucide-react";
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
  instructor: string | null;
  completionDate: string | null;
  durationHours: number | null;
  skills: string[];
  category: string | null;
  certificateUrl: string | null;
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

export default function Certifications({ courses: backendCourses }: CertificationsProps) {
  const t = useTranslations("certifications");
  const [selected, setSelected] = useState<CourseCard | null>(null);

  const fallback: { name: string; platform: string; year: string }[] = [
    { name: t("items.cert1.name"), platform: t("items.cert1.platform"), year: t("items.cert1.year") },
    { name: t("items.cert2.name"), platform: t("items.cert2.platform"), year: t("items.cert2.year") },
    { name: t("items.cert3.name"), platform: t("items.cert3.platform"), year: t("items.cert3.year") },
  ];

  const fromBackend: CourseCard[] = (backendCourses || []).map((course) => {
    const meta = (course.metadata || {}) as Record<string, unknown>;
    const platform = typeof meta.platform === "string" ? meta.platform : "Course";
    const instructor = typeof meta.instructor === "string" ? meta.instructor : null;
    const completionDate = typeof meta.completion_date === "string" ? meta.completion_date : null;
    const durationHours = typeof meta.duration_hours === "number" ? meta.duration_hours : null;
    const skills = Array.isArray(meta.skills) ? (meta.skills as string[]) : [];
    const category = typeof meta.category === "string" ? meta.category : null;
    const certificateUrl = typeof meta.certificate_url === "string" ? meta.certificate_url : null;
    const image = course.images && course.images.length > 0 ? course.images[0] : null;

    return {
      id: course.id,
      name: course.title,
      description: course.description || "",
      platform,
      instructor,
      completionDate,
      durationHours,
      skills,
      category,
      certificateUrl,
      htmlContent: course.content || "",
      image,
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
                    {course.image ? (
                      <Image src={course.image} alt={course.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-14 h-14 text-(--primary)/30 group-hover:text-(--primary)/60 transition-colors" />
                      </div>
                    )}
                    {course.category && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="primary">{course.category}</Badge>
                      </div>
                    )}
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
                      <Badge variant="secondary">
                        <Award className="w-3 h-3 mr-1" />
                        {course.platform}
                      </Badge>
                      {course.completionDate && <Badge variant="outline">{course.completionDate}</Badge>}
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
                      {course.skills.slice(0, 3).map((s) => (
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
                      <p className="text-(--primary) font-medium mt-0.5">{selected.platform}</p>
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
                    {selected.completionDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {selected.completionDate}
                      </span>
                    )}
                    {selected.durationHours && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {selected.durationHours}h
                      </span>
                    )}
                    {selected.instructor && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" /> {selected.instructor}
                      </span>
                    )}
                  </div>

                  {selected.category && (
                    <div className="mb-4">
                      <Badge variant="primary">{selected.category}</Badge>
                    </div>
                  )}

                  {selected.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.skills.map((s) => (
                          <Badge key={s} variant="outline">
                            <Tag className="w-3 h-3 mr-1" /> {s}
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
                      {isGithubUrl(selected.certificateUrl) ? "View on GitHub" : "View Certificate"}
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
