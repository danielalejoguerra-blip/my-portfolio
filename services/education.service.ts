// ============================================
// Education Service - Cliente para la API
// ============================================

import api from './api';
import type {
  Education,
  EducationCreate,
  EducationUpdate,
  EducationListResponse,
  EducationQueryParams,
  EducationAdminQueryParams,
} from '@/types';

export const educationService = {
  // ─── Públicos (sin auth) ───────────────────

  /**
   * Lista entradas de educación publicadas
   */
  async getAll(params?: EducationQueryParams): Promise<EducationListResponse> {
    const response = await api.get<EducationListResponse>('/education', { params });
    return response.data;
  },

  /**
   * Obtiene una entrada de educación publicada por slug
   */
  async getBySlug(slug: string): Promise<Education> {
    const response = await api.get<Education>(`/education/${slug}`);
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  /**
   * Lista todas las entradas de educación (incluye ocultas y borradas)
   */
  async adminGetAll(params?: EducationAdminQueryParams): Promise<EducationListResponse> {
    const response = await api.get<EducationListResponse>('/education/admin/all', { params });
    return response.data;
  },

  /**
   * Obtiene cualquier entrada de educación por ID (admin)
   */
  async adminGetById(id: number): Promise<Education> {
    const response = await api.get<Education>(`/education/admin/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva entrada de educación
   */
  async create(data: EducationCreate): Promise<Education> {
    const response = await api.post<Education>('/education', data);
    return response.data;
  },

  /**
   * Actualiza una entrada de educación existente
   */
  async update(id: number, data: EducationUpdate): Promise<Education> {
    const response = await api.put<Education>(`/education/admin/${id}`, data);
    return response.data;
  },

  /**
   * Elimina una entrada de educación (soft delete por defecto)
   */
  async remove(id: number, hard: boolean = false): Promise<void> {
    await api.delete(`/education/admin/${id}`, { params: { hard } });
  },

  /**
   * Restaura una entrada de educación soft-deleted
   */
  async restore(id: number): Promise<Education> {
    const response = await api.post<Education>(`/education/admin/${id}/restore`);
    return response.data;
  },
};

export default educationService;
