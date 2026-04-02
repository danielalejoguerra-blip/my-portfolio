// ============================================
// Project Service - Cliente para la API
// ============================================

import api from './api';
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListResponse,
  ProjectQueryParams,
  ProjectAdminQueryParams,
} from '@/types';

export const projectService = {
  // ─── Públicos (sin auth) ───────────────────

  /**
   * Lista proyectos publicados
   */
  async getAll(params?: ProjectQueryParams): Promise<ProjectListResponse> {
    const response = await api.get<ProjectListResponse>('/projects', { params });
    return response.data;
  },

  /**
   * Obtiene un proyecto publicado por slug
   */
  async getBySlug(slug: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${slug}`);
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  /**
   * Lista todos los proyectos (incluye ocultos y borrados)
   */
  async adminGetAll(params?: ProjectAdminQueryParams): Promise<ProjectListResponse> {
    const response = await api.get<ProjectListResponse>('/projects/admin/all', { params });
    return response.data;
  },

  /**
   * Obtiene cualquier proyecto por ID (admin)
   */
  async adminGetById(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/admin/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo proyecto
   */
  async create(data: ProjectCreate): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  /**
   * Actualiza un proyecto existente
   */
  async update(id: number, data: ProjectUpdate): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un proyecto (soft delete por defecto)
   */
  async remove(id: number, hard: boolean = false): Promise<void> {
    await api.delete(`/projects/${id}`, { params: { hard } });
  },

  /**
   * Restaura un proyecto soft-deleted
   */
  async restore(id: number): Promise<Project> {
    const response = await api.post<Project>(`/projects/${id}/restore`);
    return response.data;
  },
};

export default projectService;
