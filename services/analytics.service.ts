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

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizePageSlug = (slug: string): string => {
  const trimmed = (slug || '').trim();
  if (!trimmed || trimmed === '/') return '/home';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

function normalizeSummary(raw: unknown): AnalyticsSummary {
  const data = (raw || {}) as Record<string, unknown>;

  const topPagesRaw = Array.isArray(data.top_pages) ? data.top_pages : [];
  const topReferrersRaw = Array.isArray(data.top_referrers) ? data.top_referrers : [];
  const topCountriesRaw = Array.isArray(data.top_countries) ? data.top_countries : [];
  const viewsByDateRaw = (data.views_by_date || null) as Record<string, unknown> | null;

  const normalizedTopPages = topPagesRaw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      page_slug: String(row.page_slug ?? row.page ?? '—'),
      views: toNumber(row.views ?? row.count ?? row.view_count),
    };
  });

  const totalViewsFromTopPages = normalizedTopPages.reduce((sum, item) => sum + item.views, 0);
  const totalViewsFromByDate = viewsByDateRaw
    ? (Object.values(viewsByDateRaw) as unknown[]).reduce<number>((sum, value) => sum + toNumber(value), 0)
    : 0;

  const totalViewsCandidate =
    data.total_views ?? data.total_page_views ?? (totalViewsFromTopPages > 0 ? totalViewsFromTopPages : totalViewsFromByDate);

  const normalizedTotalViews = toNumber(
    totalViewsCandidate
  );

  const normalizedUniquePages = toNumber(
    data.unique_pages ?? data.unique_visitors ?? normalizedTopPages.length
  );

  const normalizedTotalEvents = toNumber(
    data.total_events ?? data.total_page_views ?? normalizedTotalViews
  );

  return {
    total_views: normalizedTotalViews,
    unique_pages: normalizedUniquePages,
    total_events: normalizedTotalEvents,
    top_pages: normalizedTopPages,
    top_referrers: topReferrersRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        referrer: String(row.referrer ?? '—'),
        count: toNumber(row.count ?? row.views ?? row.view_count),
      };
    }),
    top_countries: topCountriesRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        country: String(row.country ?? '—'),
        count: toNumber(row.count ?? row.views ?? row.view_count),
      };
    }),
    period_start: String(data.period_start ?? new Date().toISOString()),
    period_end: String(data.period_end ?? new Date().toISOString()),
    days: toNumber(data.days),
  };
}

function normalizeTopContent(raw: unknown): TopContentResponse {
  const data = (raw || {}) as Record<string, unknown>;
  const itemsRaw = Array.isArray(data.items) ? data.items : [];

  return {
    items: itemsRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        content_type: String(row.content_type ?? 'unknown'),
        content_id: toNumber(row.content_id),
        title: row.title == null ? null : String(row.title),
        views: toNumber(row.views ?? row.view_count),
      };
    }),
    period_start: String(data.period_start ?? new Date().toISOString()),
    period_end: String(data.period_end ?? new Date().toISOString()),
  };
}

function normalizeViewsByDate(raw: unknown): ViewsByDateResponse {
  const data = (raw || {}) as Record<string, unknown>;
  const itemsRaw = Array.isArray(data.items) ? data.items : [];

  return {
    items: itemsRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        date: String(row.date ?? row.bucket ?? ''),
        views: toNumber(row.views ?? row.count ?? row.view_count),
      };
    }),
    granularity: String(data.granularity ?? 'day'),
    period_start: String(data.period_start ?? new Date().toISOString()),
    period_end: String(data.period_end ?? new Date().toISOString()),
  };
}

function normalizeEvents(raw: unknown): AnalyticsEvent[] {
  const base = Array.isArray(raw)
    ? raw
    : (raw as Record<string, unknown>)?.items && Array.isArray((raw as Record<string, unknown>).items)
      ? ((raw as Record<string, unknown>).items as unknown[])
      : [];

  return base.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: toNumber(row.id),
      event_type: String(row.event_type ?? 'unknown'),
      page_slug: row.page_slug == null ? null : String(row.page_slug),
      content_type: row.content_type == null ? null : String(row.content_type),
      content_id: row.content_id == null ? null : toNumber(row.content_id),
      referrer: row.referrer == null ? null : String(row.referrer),
      country: row.country == null ? null : String(row.country),
      metadata: (row.metadata as Record<string, unknown>) ?? null,
      created_at: String(row.created_at ?? new Date().toISOString()),
    };
  });
}

export const analyticsService = {
  // ─── Públicos (sin auth) ───────────────────

  async track(data: AnalyticsEventCreate): Promise<AnalyticsEvent> {
    const response = await api.post<AnalyticsEvent>('/analytics/track', data);
    return response.data;
  },

  async pageview(params: { page_slug: string; content_type?: string; content_id?: number }): Promise<AnalyticsEvent> {
    const normalizedParams = {
      ...params,
      page_slug: normalizePageSlug(params.page_slug),
    };
    const response = await api.post<AnalyticsEvent>('/analytics/pageview', null, { params: normalizedParams });
    return response.data;
  },

  // ─── Admin (requieren auth) ────────────────

  async getSummary(params?: AnalyticsSummaryParams): Promise<AnalyticsSummary> {
    const response = await api.get('/analytics/summary', { params });
    return normalizeSummary(response.data);
  },

  async getTopContent(params?: TopContentParams): Promise<TopContentResponse> {
    const response = await api.get('/analytics/top-content', { params });
    return normalizeTopContent(response.data);
  },

  async getViewsByDate(params?: ViewsByDateParams): Promise<ViewsByDateResponse> {
    const response = await api.get('/analytics/views-by-date', { params });
    return normalizeViewsByDate(response.data);
  },

  async getEvents(params?: AnalyticsEventsParams): Promise<AnalyticsEvent[]> {
    const response = await api.get('/analytics/events', { params });
    return normalizeEvents(response.data);
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
