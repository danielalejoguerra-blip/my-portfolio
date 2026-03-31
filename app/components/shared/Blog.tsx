"use client";

import { motion } from "framer-motion";
import { Calendar, ExternalLink, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Section, Card, Badge } from "@/app/components/ui";
import type { BlogPost } from "@/types";

interface BlogProps {
  posts?: BlogPost[] | null;
}

type BlogCard = {
  title: string;
  description: string;
  date: string;
  slug: string;
  category: string | null;
  featured: boolean;
  tags: string[];
  image: string | null;
};

export default function Blog({ posts }: BlogProps) {
  const t = useTranslations("dashboard.blog");
  const locale = useLocale();

  const fromBackend: BlogCard[] = (posts || []).map((post) => {
    const metadata = (post.metadata || {}) as Record<string, unknown>;
    const category = typeof metadata.category === "string" ? metadata.category : null;
    const featured = typeof metadata.featured === "boolean" ? metadata.featured : false;
    const tags = Array.isArray(metadata.tags) ? (metadata.tags as string[]) : [];
    const image = post.images && post.images.length > 0 ? post.images[0] : null;
    const dateSource = post.published_at || post.created_at;
    const date = new Date(dateSource).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    return {
      title: post.title,
      description: post.description || "",
      date,
      slug: post.slug,
      category,
      featured,
      tags,
      image,
    };
  });

  const fallbackPosts: BlogCard[] = [
    {
      title: t("title"),
      description: t("emptyDescription"),
      date: "",
      slug: "",
      category: null,
      featured: false,
      tags: [],
      image: null,
    },
  ];

  const cards = fromBackend.length > 0 ? fromBackend.slice(0, 6) : fallbackPosts;

  return (
    <Section id="blog" title={t("title")} subtitle={t("subtitle")}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((post, index) => (
          <motion.div
            key={`${post.slug || post.title}-${index}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <Card className="h-full flex flex-col group overflow-hidden" whileHover={{ y: -4 }}>
              {/* Cover image */}
              <div className="relative h-44 -mx-6 -mt-6 mb-4 bg-linear-to-br from-(--gradient-start)/20 via-(--gradient-mid)/20 to-(--gradient-end)/20 rounded-t-xl overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-(--primary)/30" />
                  </div>
                )}
                {post.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="primary">Featured</Badge>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-full bg-(--primary)/10 text-(--primary)">
                  <FileText className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-(--foreground) mb-2 group-hover:text-(--primary) transition-colors">
                {post.title}
              </h3>

              <p className="text-sm text-(--muted-foreground) mb-4 flex-1 line-clamp-3">
                {post.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </div>

                {post.slug && (
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-xs font-medium text-(--primary) hover:opacity-80"
                    aria-label="Read post"
                  >
                    <span>Read</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {(post.category || post.tags.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.category && <Badge variant="outline">{post.category}</Badge>}
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
