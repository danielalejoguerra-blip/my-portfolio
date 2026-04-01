import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPublicBlogBySlug } from "@/app/lib/content.server";
import BlogDetail from "./BlogDetail";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPublicBlogBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} />;
}
