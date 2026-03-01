// ============================================
// Analytics Service - Cliente para la API
// ============================================

import api from './api';
import type {
  AnalyticsEvent,
  AnalyticsEventCreate,
  AnalyticsSummary,
  AnalyticsSummaryParams,
  TopContentResponse,
  TopContentParams,
  ViewsByDateResponse,
  ViewsByDateParams,
  AnalyticsEventsParams,
  PageViewsResponse,
  PageViewsParams,
  ContentViewsResponse,
  ContentViewsParams,
} from '@/types';

export const analyticsService = {
  // ─── Públicos (sin auth) ───────────────────

  async track(data: AnalyticsEventCreate): Promise<AnalyticsEvent> {
    const response = await api.post<AnalyticsEvent>('/analytics/track', data);
    return response.data;
  },

  async pageview(params: { page_slug: string; content_type?: string; content_id?: number }): Promise<AnalyticsEvent> {
    const response = await api.post<AnalyticsEvent>('/analytics/pageview', null, { params });
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  async getSummary(params?: AnalyticsSummaryParams): Promise<AnalyticsSummary> {
    const response = await api.get<AnalyticsSummary>('/analytics/summary', { params });
    return response.data;
  },

  async getTopContent(params?: TopContentParams): Promise<TopContentResponse> {
    const response = await api.get<TopContentResponse>('/analytics/top-content', { params });
    return response.data;
  },

  async getViewsByDate(params?: ViewsByDateParams): Promise<ViewsByDateResponse> {
    const response = await api.get<ViewsByDateResponse>('/analytics/views-by-date', { params });
    return response.data;
  },

  async getEvents(params?: AnalyticsEventsParams): Promise<AnalyticsEvent[]> {
    const response = await api.get<AnalyticsEvent[]>('/analytics/events', { params });
    return response.data;
  },

  async getPageViews(params?: PageViewsParams): Promise<PageViewsResponse> {
    const response = await api.get<PageViewsResponse>('/analytics/page-views', { params });
    return response.data;
  },

  async getContentViews(
    contentType: string,
    contentId: number,
    params?: ContentViewsParams
  ): Promise<ContentViewsResponse> {
    const response = await api.get<ContentViewsResponse>(
      `/analytics/content-views/${contentType}/${contentId}`,
      { params }
    );
    return response.data;
  },
};

export default analyticsService;
