// ============================================
// Personal Info Service - Cliente para la API
// ============================================

import api from './api';
import type {
  PersonalInfo,
  PersonalInfoCreate,
  PersonalInfoUpdate,
  PersonalInfoListResponse,
  PersonalInfoQueryParams,
  PersonalInfoAdminQueryParams,
} from '@/types';

export const personalInfoService = {
  // ─── Públicos (sin auth) ───────────────────

  /**
   * Lista registros publicados
   */
  async getAll(params?: PersonalInfoQueryParams): Promise<PersonalInfoListResponse> {
    const response = await api.get<PersonalInfoListResponse>('/personal-info', { params });
    return response.data;
  },

  /**
   * Obtiene un registro publicado por ID
   */
  async getById(id: number): Promise<PersonalInfo> {
    const response = await api.get<PersonalInfo>(`/personal-info/${id}`);
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  /**
   * Lista todos los registros (incluye ocultos y borrados)
   */
  async adminGetAll(params?: PersonalInfoAdminQueryParams): Promise<PersonalInfoListResponse> {
    const response = await api.get<PersonalInfoListResponse>('/personal-info/admin/all', { params });
    return response.data;
  },

  /**
   * Obtiene cualquier registro por ID (admin)
   */
  async adminGetById(id: number): Promise<PersonalInfo> {
    const response = await api.get<PersonalInfo>(`/personal-info/admin/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo registro
   */
  async create(data: PersonalInfoCreate): Promise<PersonalInfo> {
    const response = await api.post<PersonalInfo>('/personal-info', data);
    return response.data;
  },

  /**
   * Actualiza un registro existente
   */
  async update(id: number, data: PersonalInfoUpdate): Promise<PersonalInfo> {
    const response = await api.put<PersonalInfo>(`/personal-info/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un registro (soft delete por defecto)
   */
  async remove(id: number, hard: boolean = false): Promise<void> {
    await api.delete(`/personal-info/${id}`, { params: { hard } });
  },

  /**
   * Restaura un registro soft-deleted
   */
  async restore(id: number): Promise<PersonalInfo> {
    const response = await api.post<PersonalInfo>(`/personal-info/${id}/restore`);
    return response.data;
  },
};

export default personalInfoService;
