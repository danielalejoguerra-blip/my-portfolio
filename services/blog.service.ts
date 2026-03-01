// ============================================
// Blog Service - Cliente para la API
// ============================================

import api from './api';
import type {
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  BlogPostListResponse,
  BlogQueryParams,
  BlogAdminQueryParams,
} from '@/types';

export const blogService = {
  // ─── Públicos (sin auth) ───────────────────

  async getAll(params?: BlogQueryParams): Promise<BlogPostListResponse> {
    const response = await api.get<BlogPostListResponse>('/blog', { params });
    return response.data;
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    const response = await api.get<BlogPost>(`/blog/${slug}`);
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  async adminGetAll(params?: BlogAdminQueryParams): Promise<BlogPostListResponse> {
    const response = await api.get<BlogPostListResponse>('/blog/admin/all', { params });
    return response.data;
  },

  async adminGetById(id: number): Promise<BlogPost> {
    const response = await api.get<BlogPost>(`/blog/admin/${id}`);
    return response.data;
  },

  async create(data: BlogPostCreate): Promise<BlogPost> {
    const response = await api.post<BlogPost>('/blog', data);
    return response.data;
  },

  async update(id: number, data: BlogPostUpdate): Promise<BlogPost> {
    const response = await api.put<BlogPost>(`/blog/${id}`, data);
    return response.data;
  },

  async remove(id: number, hard: boolean = false): Promise<void> {
    await api.delete(`/blog/${id}`, { params: { hard } });
  },

  async restore(id: number): Promise<BlogPost> {
    const response = await api.post<BlogPost>(`/blog/${id}/restore`);
    return response.data;
  },
};

export default blogService;
