import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPublicProjectBySlug } from "@/app/lib/projects.server";
import ProjectDetail from "./ProjectDetail";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
