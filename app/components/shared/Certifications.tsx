"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Section, Card, Badge } from "@/app/components/ui";
import type { BlogPost, Course } from "@/types";

interface CertificationsProps {
  courses?: Course[] | null;
  blogPosts?: BlogPost[] | null;
}

const KNOWN_COURSE_KEYS = new Set(["platform", "provider", "year", "instructor", "duration", "url", "certificate_url"]);

type CourseCard = {
  name: string;
  description: string;
  platform: string;
  year: string;
  instructor: string | null;
  duration: string | null;
  url: string | null;
  image: string | null;
  extraMeta: Record<string, string>;
};

type CertificationItem = {
  name: string;
  platform: string;
  year: string;
};

export default function Certifications({ courses: backendCourses, blogPosts: backendBlogPosts }: CertificationsProps) {
  const t = useTranslations("certifications");

  // Rich course cards from backend
  const courseCards: CourseCard[] = (backendCourses || []).map((course) => {
    const metadata = (course.metadata || {}) as Record<string, unknown>;
    const platform = typeof metadata.platform === "string" && metadata.platform.trim()
      ? metadata.platform
      : typeof metadata.provider === "string" && metadata.provider.trim()
        ? metadata.provider
        : "Course";
    const year = typeof metadata.year === "string" && metadata.year.trim()
      ? metadata.year
      : String(new Date(course.created_at).getFullYear());
    const instructor = typeof metadata.instructor === "string" ? metadata.instructor : null;
    const duration = typeof metadata.duration === "string" ? metadata.duration : null;
    const url = typeof metadata.url === "string" ? metadata.url
      : typeof metadata.certificate_url === "string" ? metadata.certificate_url : null;
    const image = course.images && course.images.length > 0 ? course.images[0] : null;
    const extraMeta: Record<string, string> = {};
    for (const [k, v] of Object.entries(metadata)) {
      if (!KNOWN_COURSE_KEYS.has(k)) {
        extraMeta[k] = typeof v === "string" ? v : JSON.stringify(v);
      }
    }
    return {
      name: course.title,
      description: course.description || "",
      platform,
      year,
      instructor,
      duration,
      url,
      image,
      extraMeta,
    };
  });

  // Fallback simple certifications (from blog posts or hardcoded)
  const fallbackCertifications: CertificationItem[] = [
    { name: t("items.cert1.name"), platform: t("items.cert1.platform"), year: t("items.cert1.year") },
    { name: t("items.cert2.name"), platform: t("items.cert2.platform"), year: t("items.cert2.year") },
    { name: t("items.cert3.name"), platform: t("items.cert3.platform"), year: t("items.cert3.year") },
  ];

  const fromBlog: CertificationItem[] = (backendBlogPosts || []).map((post) => {
    const metadata = (post.metadata || {}) as Record<string, unknown>;
    const platform = typeof metadata.platform === "string" && metadata.platform.trim()
      ? metadata.platform : "Blog";
    const year = post.published_at
      ? String(new Date(post.published_at).getFullYear())
      : String(new Date(post.created_at).getFullYear());
    return { name: post.title, platform, year };
  });

  // Show rich course cards if backend has courses; otherwise fallback
  if (courseCards.length > 0) {
    return (
      <Section id="certifications" title={t("title")} subtitle={t("subtitle")}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseCards.map((course, index) => (
            <motion.div
              key={course.name + index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col group overflow-hidden" whileHover={{ y: -5 }}>
                {/* Cover image */}
                <div className="relative h-44 -mx-6 -mt-6 mb-4 bg-linear-to-br from-(--gradient-start)/20 via-(--gradient-mid)/20 to-(--gradient-end)/20 rounded-t-xl overflow-hidden">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-14 h-14 text-(--primary)/30" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-(--foreground) group-hover:text-(--primary) transition-colors leading-tight flex-1">
                      {course.name}
                    </h3>
                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-full bg-(--primary)/10 text-(--primary) hover:scale-110 transition-transform shrink-0"
                        aria-label="View certificate"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

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
                    {course.year && <Badge variant="outline">{course.year}</Badge>}
                    {course.instructor && <Badge variant="outline">{course.instructor}</Badge>}
                    {course.duration && <Badge variant="outline">{course.duration}</Badge>}
                    {Object.entries(course.extraMeta).map(([k, v]) => (
                      <span
                        key={k}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-(--card-border) text-(--muted-foreground)"
                      >
                        <span className="font-semibold text-(--primary)">{k}:</span> {v}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>
    );
  }

  // Fallback: simple certification badges
  const certifications = fromBlog.length > 0 ? fromBlog.slice(0, 6) : fallbackCertifications;

  return (
    <Section id="certifications" title={t("title")} subtitle={t("subtitle")}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, index) => (
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
