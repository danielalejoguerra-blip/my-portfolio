"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Folder } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Section, Card, Badge } from "@/app/components/ui";
import type { Project } from "@/types";

// Tipo interno para el render
interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  image: string | null;
  technologies: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
}

interface ProjectsProps {
  projects?: Project[] | null;
}

export default function Projects({ projects: backendProjects }: ProjectsProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  // Map backend data → internal render type
  const fromBackend: ProjectItem[] = (backendProjects || []).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description || '',
    image: p.images && p.images.length > 0 ? p.images[0] : null,
    technologies: Array.isArray((p.metadata as Record<string, unknown>)?.technologies)
      ? ((p.metadata as Record<string, unknown>).technologies as string[])
      : [],
    github: ((p.metadata as Record<string, unknown>)?.github as string) || null,
    live: ((p.metadata as Record<string, unknown>)?.live as string) || null,
    featured: ((p.metadata as Record<string, unknown>)?.featured as boolean) || false,
  }));

  // Fallback: hardcoded i18n projects when backend returns nothing
  const fallbackProjects: ProjectItem[] = [
    {
      slug: "crm-personalizado",
      title: t("items.project1.title"),
      description: t("items.project1.description"),
      image: null,
      technologies: ["React", "TypeScript", "Node.js", "SQL Server"],
      github: null,
      live: null,
      featured: true,
    },
    {
      slug: "ai-audit-system",
      title: t("items.project2.title"),
      description: t("items.project2.description"),
      image: null,
      technologies: ["Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
    },
    {
      slug: "scalable-rest-api",
      title: t("items.project3.title"),
      description: t("items.project3.description"),
      image: null,
      technologies: ["React", "Firebase", "Tailwind CSS", "WebSockets"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
    },
    {
      slug: "dashboard-analytics",
      title: t("items.project4.title"),
      description: t("items.project4.description"),
      image: null,
      technologies: ["Node.js", "Express", "MongoDB", "JWT"],
      github: "https://github.com",
      live: null,
      featured: false,
    },
    {
      slug: "process-automation",
      title: t("items.project5.title"),
      description: t("items.project5.description"),
      image: null,
      technologies: ["React", "Chart.js", "Python", "FastAPI"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false,
    },
    {
      slug: "personal-portfolio",
      title: t("items.project6.title"),
      description: t("items.project6.description"),
      image: null,
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com",
      live: "/",
      featured: false,
    },
  ];

  // Use backend data if available, otherwise fallback
  const projects = fromBackend.length > 0 ? fromBackend : fallbackProjects;

  return (
    <Section
      id="projects"
      title={t("title")}
      subtitle={t("subtitle")}
      className="bg-[var(--muted)]/30"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/${locale}/projects/${project.slug}`}>
            <Card
              className="h-full flex flex-col group cursor-pointer"
              whileHover={{ y: -5 }}
            >
              {/* Project image */}
              <div className="relative h-48 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-[var(--gradient-start)]/20 via-[var(--gradient-mid)]/20 to-[var(--gradient-end)]/20 rounded-t-[var(--radius-xl)] overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Folder className="w-16 h-16 text-[var(--primary)]/30" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--foreground)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[var(--background)] rounded-full hover:scale-110 transition-transform"
                      aria-label="Ver código en GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[var(--background)] rounded-full hover:scale-110 transition-transform"
                      aria-label="Ver proyecto en vivo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="primary">{t("featured")}</Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
