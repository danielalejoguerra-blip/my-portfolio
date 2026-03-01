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
export async function getPublicProjects(limit: number = 20): Promise<Project[]> {
  try {
    const response = await fetch(
      `${API_URL}/projects?limit=${limit}&offset=0`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
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
