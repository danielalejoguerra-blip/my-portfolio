import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPublicProjectBySlug, getPublicProjectSlugs } from "@/app/lib/projects.server";
import { locales } from "@/app/i18n/config";
import ProjectDetail from "./ProjectDetail";

export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublicProjectSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getPublicProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
