// ============================================
// Skill Service - Cliente para la API
// ============================================

import api from './api';
import type {
  Skill,
  SkillCreate,
  SkillUpdate,
  SkillListResponse,
  SkillQueryParams,
  SkillAdminQueryParams,
} from '@/types';

export const skillService = {
  // ─── Públicos (sin auth) ───────────────────

  async getAll(params?: SkillQueryParams): Promise<SkillListResponse> {
    const response = await api.get<SkillListResponse>('/skills', { params });
    return response.data;
  },

  async getBySlug(slug: string): Promise<Skill> {
    const response = await api.get<Skill>(`/skills/${slug}`);
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  async adminGetAll(params?: SkillAdminQueryParams): Promise<SkillListResponse> {
    const response = await api.get<SkillListResponse>('/skills/admin/all', { params });
    return response.data;
  },

  async adminGetById(id: number): Promise<Skill> {
    const response = await api.get<Skill>(`/skills/admin/${id}`);
    return response.data;
  },

  async create(data: SkillCreate): Promise<Skill> {
    const response = await api.post<Skill>('/skills', data);
    return response.data;
  },

  async update(id: number, data: SkillUpdate): Promise<Skill> {
    const response = await api.put<Skill>(`/skills/${id}`, data);
    return response.data;
  },

  async remove(id: number, hard: boolean = false): Promise<void> {
    await api.delete(`/skills/${id}`, { params: { hard } });
  },

  async restore(id: number): Promise<Skill> {
    const response = await api.post<Skill>(`/skills/${id}/restore`);
    return response.data;
  },
};

export default skillService;
