import type {
  BlogPost,
  Course,
  Education,
  Experience,
  Skill,
} from '@/types';

const API_URL = process.env.REACT_API_HOST;

async function fetchPublicList<T>(path: string, limit: number): Promise<T[]> {
  try {
    if (!API_URL) return [];
    const response = await fetch(`${API_URL}${path}?limit=${limit}&offset=0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) return [];
    const data = await response.json();
    return (data.items || []) as T[];
  } catch {
    return [];
  }
}

export async function getPublicSkills(limit: number = 40): Promise<Skill[]> {
  const items = await fetchPublicList<Skill>('/skills', limit);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicExperience(limit: number = 20): Promise<Experience[]> {
  const items = await fetchPublicList<Experience>('/experience', limit);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicEducation(limit: number = 20): Promise<Education[]> {
  const items = await fetchPublicList<Education>('/education', limit);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicCourses(limit: number = 20): Promise<Course[]> {
  const items = await fetchPublicList<Course>('/courses', limit);
  return items.filter((item) => item.visible && !item.deleted_at);
}

export async function getPublicBlog(limit: number = 20): Promise<BlogPost[]> {
  const items = await fetchPublicList<BlogPost>('/blog', limit);
  return items.filter((item) => item.visible && !item.deleted_at);
}
