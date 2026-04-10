import type {
  BlogPost,
  Course,
  Education,
  Experience,
  Skill,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchPublicList<T>(path: string, limit: number, lang?: string): Promise<T[]> {
  try {
    if (!API_URL) return [];
    const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : '';
    const response = await fetch(`${API_URL}${path}?limit=${limit}&offset=0${langParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return (data.items || []) as T[];
  } catch {
    return [];
  }
}

export async function getPublicSkills(limit: number = 40, lang?: string): Promise<Skill[]> {
  const items = await fetchPublicList<Skill>('/skills', limit, lang);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicExperience(limit: number = 20, lang?: string): Promise<Experience[]> {
  const items = await fetchPublicList<Experience>('/experience', limit, lang);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicEducation(limit: number = 20, lang?: string): Promise<Education[]> {
  const items = await fetchPublicList<Education>('/education', limit, lang);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicCourses(limit: number = 20, lang?: string): Promise<Course[]> {
  const items = await fetchPublicList<Course>('/courses', limit, lang);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicBlog(limit: number = 20, lang?: string): Promise<BlogPost[]> {
  const items = await fetchPublicList<BlogPost>('/blog', limit, lang);
  return items.filter((item) => !item.deleted_at);
}

/**
 * Obtiene todos los slugs de posts publicados.
 * Usado en generateStaticParams para pre-construir páginas de detalle.
 */
export async function getPublicBlogSlugs(): Promise<string[]> {
  try {
    if (!API_URL) return [];
    const response = await fetch(`${API_URL}/blog?limit=100&offset=0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return ((data.items || []) as BlogPost[]).map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getPublicBlogBySlug(slug: string, lang?: string): Promise<BlogPost | null> {
  try {
    if (!API_URL) return null;
    const langParam = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    const response = await fetch(`${API_URL}/blog/${encodeURIComponent(slug)}${langParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
