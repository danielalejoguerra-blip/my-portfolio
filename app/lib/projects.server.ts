// ============================================
// Projects Server Utility - Fetch SSR
// ============================================

import type { Project, ProjectListResponse } from '@/types';

const API_URL = process.env.REACT_API_HOST;

/**
 * Obtiene la lista de proyectos publicados.
 * Se usa desde Server Components para SSR.
 * Retorna array vacío si el backend no está disponible o no hay datos.
 */
export async function getPublicProjects(limit: number = 20, lang?: string): Promise<Project[]> {
  try {
    const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : '';
    const response = await fetch(
      `${API_URL}/projects?limit=${limit}&offset=0${langParam}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch projects:', response.status);
      return [];
    }

    const data: ProjectListResponse = await response.json();

    return data.items || [];
  } catch (error) {
    console.warn('Projects fetch error (backend may be offline):', error);
    return [];
  }
}

/**
 * Obtiene un proyecto por slug.
 * Se usa desde Server Components para SSR.
 * Retorna null si no se encuentra o el backend no está disponible.
 */
export async function getPublicProjectBySlug(slug: string, lang?: string): Promise<Project | null> {
  try {
    const langParam = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    const response = await fetch(
      `${API_URL}/projects/${encodeURIComponent(slug)}${langParam}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch project:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn('Project fetch error (backend may be offline):', error);
    return null;
  }
}
