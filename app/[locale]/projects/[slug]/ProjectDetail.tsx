"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/app/components/ui";
import type { Project } from "@/types";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const t = useTranslations("projectDetail");
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const metadata = (project.metadata as Record<string, unknown>) || {};
  const technologies = Array.isArray(metadata.technologies)
    ? (metadata.technologies as string[])
    : [];
  const github = (metadata.github as string) || null;
  const live = (metadata.live as string) || null;
  const images = project.images || [];

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header / Back */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          href={`/${locale}#projects`}
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToProjects")}
        </Link>
      </div>

      {/* Main image */}
      {images.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-video rounded-[var(--radius-xl)] overflow-hidden cursor-pointer border border-[var(--card-border)]"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={images[0]}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1024px"
              priority
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Title & Links */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
            <div className="flex gap-3">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] border border-[var(--border)] text-sm hover:bg-[var(--muted)] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  {t("viewCode")}
                </a>
              )}
              {live && (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] bg-[var(--primary)] text-white text-sm hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t("viewLive")}
                </a>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
            <Calendar className="w-4 h-4" />
            {new Date(project.created_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {technologies.map((tech) => (
                <Badge key={tech} variant="primary">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">{t("description")}</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                {project.description}
              </p>
            </div>
          )}

          {/* Content (rich text / markdown) */}
          {project.content && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">{t("details")}</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
                {project.content}
              </div>
            </div>
          )}

          {/* Image gallery */}
          {images.length > 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t("gallery")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative aspect-video rounded-[var(--radius-lg)] overflow-hidden cursor-pointer border border-[var(--card-border)] hover:border-[var(--primary)]/50 transition-colors"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={img}
                      alt={`${project.title} - ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label={t("close")}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                  className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                  aria-label={t("previous")}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                  aria-label={t("next")}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-[90vw] h-[80vh] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage]}
                alt={`${project.title} - ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            {/* Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
