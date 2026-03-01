// ============================================
// Experience Service - Cliente para la API
// ============================================

import api from './api';
import type {
  Experience,
  ExperienceCreate,
  ExperienceUpdate,
  ExperienceListResponse,
  ExperienceQueryParams,
  ExperienceAdminQueryParams,
} from '@/types';

export const experienceService = {
  // ─── Públicos (sin auth) ───────────────────

  /**
   * Lista experiencias publicadas
   */
  async getAll(params?: ExperienceQueryParams): Promise<ExperienceListResponse> {
    const response = await api.get<ExperienceListResponse>('/experience', { params });
    return response.data;
  },

  /**
   * Obtiene una experiencia publicada por slug
   */
  async getBySlug(slug: string): Promise<Experience> {
    const response = await api.get<Experience>(`/experience/${slug}`);
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  /**
   * Lista todas las experiencias (incluye ocultas y borradas)
   */
  async adminGetAll(params?: ExperienceAdminQueryParams): Promise<ExperienceListResponse> {
    const response = await api.get<ExperienceListResponse>('/experience/admin/all', { params });
    return response.data;
  },

  /**
   * Obtiene cualquier experiencia por ID (admin)
   */
  async adminGetById(id: number): Promise<Experience> {
    const response = await api.get<Experience>(`/experience/admin/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva experiencia
   */
  async create(data: ExperienceCreate): Promise<Experience> {
    const response = await api.post<Experience>('/experience', data);
    return response.data;
  },

  /**
   * Actualiza una experiencia existente
   */
  async update(id: number, data: ExperienceUpdate): Promise<Experience> {
    const response = await api.put<Experience>(`/experience/admin/${id}`, data);
    return response.data;
  },

  /**
   * Elimina una experiencia (soft delete por defecto)
   */
  async remove(id: number, hard: boolean = false): Promise<void> {
    await api.delete(`/experience/admin/${id}`, { params: { hard } });
  },

  /**
   * Restaura una experiencia soft-deleted
   */
  async restore(id: number): Promise<Experience> {
    const response = await api.post<Experience>(`/experience/admin/${id}/restore`);
    return response.data;
  },
};

export default experienceService;
