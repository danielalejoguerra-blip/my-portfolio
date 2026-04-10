import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPublicBlogBySlug, getPublicBlogSlugs } from "@/app/lib/content.server";
import { locales } from "@/app/i18n/config";
import BlogDetail from "./BlogDetail";

export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublicBlogSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPublicBlogBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} />;
}
