// ============================================
// Course Service - Cliente para la API
// ============================================

import api from './api';
import type {
  Course,
  CourseCreate,
  CourseUpdate,
  CourseListResponse,
  CourseQueryParams,
  CourseAdminQueryParams,
} from '@/types';

export const courseService = {
  // ─── Públicos (sin auth) ───────────────────

  async getAll(params?: CourseQueryParams): Promise<CourseListResponse> {
    const response = await api.get<CourseListResponse>('/courses', { params });
    return response.data;
  },

  async getBySlug(slug: string): Promise<Course> {
    const response = await api.get<Course>(`/courses/${slug}`);
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  async adminGetAll(params?: CourseAdminQueryParams): Promise<CourseListResponse> {
    const response = await api.get<CourseListResponse>('/courses/admin/all', { params });
    return response.data;
  },

  async adminGetById(id: number): Promise<Course> {
    const response = await api.get<Course>(`/courses/admin/${id}`);
    return response.data;
  },

  async create(data: CourseCreate): Promise<Course> {
    const response = await api.post<Course>('/courses', data);
    return response.data;
  },

  async update(id: number, data: CourseUpdate): Promise<Course> {
    const response = await api.put<Course>(`/courses/${id}`, data);
    return response.data;
  },

  async remove(id: number, hard: boolean = false): Promise<void> {
    await api.delete(`/courses/${id}`, { params: { hard } });
  },

  async restore(id: number): Promise<Course> {
    const response = await api.post<Course>(`/courses/${id}/restore`);
    return response.data;
  },
};

export default courseService;
