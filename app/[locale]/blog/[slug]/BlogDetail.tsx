"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/app/components/ui";
import { getShimmerDataURL } from "@/app/lib/utils";
import type { BlogPost } from "@/types";

interface BlogDetailProps {
  post: BlogPost;
}

export default function BlogDetail({ post }: BlogDetailProps) {
  const locale = useLocale();
  const t = useTranslations("blogDetail");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const tags = post.tags || [];
  const category = post.category || null;
  const readingTime = post.reading_time_minutes || null;
  const featured = post.featured ?? false;
  const canonicalUrl = post.canonical_url || null;
  const images = post.images || [];
  const shimmerUrl = getShimmerDataURL();

  const publishDate = post.published_at || post.created_at;
  const formattedDate = new Date(publishDate).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      {/* Back */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          href={`/${locale}#blog`}
          className="inline-flex items-center gap-2 text-sm text-(--muted-foreground) hover:text-(--primary) transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToBlog")}
        </Link>
      </div>

      {/* Hero image */}
      {images.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border border-(--card-border)"
            onClick={() => setSelectedImage(0)}
          >
            <Image
              src={images[0]}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              placeholder="blur"
              blurDataURL={shimmerUrl}
            />
            {featured && (
              <div className="absolute top-4 left-4">
                <Badge variant="primary">{t("featured")}</Badge>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Article */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Category + tags */}
          {(category || tags.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category && <Badge variant="primary">{category}</Badge>}
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-(--muted-foreground) mb-6 pb-6 border-b border-(--card-border)">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            {readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readingTime} {t("minRead")}
              </span>
            )}
            {canonicalUrl && (
              <a
                href={canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-(--primary) transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t("original")}
              </a>
            )}
          </div>

          {/* Description */}
          {post.description && (
            <p className="text-(--muted-foreground) text-lg leading-relaxed mb-8 font-medium">
              {post.description}
            </p>
          )}

          {/* Content */}
          {post.content && (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none
                text-(--foreground) leading-relaxed
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:text-(--muted-foreground) [&_p]:mb-4
                [&_a]:text-(--primary) [&_a]:underline [&_a]:underline-offset-2
                [&_strong]:font-semibold [&_strong]:text-(--foreground)
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:mb-1
                [&_blockquote]:border-l-4 [&_blockquote]:border-(--primary) [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-(--muted-foreground)
                [&_code]:bg-(--muted) [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-(--muted) [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Image gallery */}
          {images.length > 1 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">{t("gallery")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer border border-(--card-border) hover:border-(--primary)/50 transition-colors"
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`${post.title} - ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={shimmerUrl}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
                  }}
                  aria-label="Next"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage]}
                alt={`${post.title} - ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={shimmerUrl}
              />
            </motion.div>

            {images.length > 1 && (
              <div className="absolute bottom-4 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${i === selectedImage ? "bg-white" : "bg-white/30"}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
