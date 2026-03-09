// ============================================
// Analytics Types - Tipos de analíticas
// ============================================

// Evento de analítica (lectura)
export interface AnalyticsEvent {
  id: number;
  event_type: string;
  page_slug: string | null;
  content_type: string | null;
  content_id: number | null;
  referrer: string | null;
  country: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Datos para rastrear un evento
export interface AnalyticsEventCreate {
  event_type: string;
  page_slug?: string;
  content_type?: string;
  content_id?: number;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

// Resumen de analíticas
export interface AnalyticsSummary {
  total_views: number;
  unique_pages: number;
  total_events: number;
  top_pages: { page_slug: string; views: number }[];
  top_referrers: { referrer: string; count: number }[];
  top_countries: { country: string; count: number }[];
  period_start: string;
  period_end: string;
  days: number;
}

// Contenido más visto
export interface TopContentItem {
  content_type: string;
  content_id: number;
  title: string | null;
  views: number;
}

export interface TopContentResponse {
  items: TopContentItem[];
  period_start: string;
  period_end: string;
}

// Vistas por fecha
export interface ViewsByDateItem {
  date: string;
  views: number;
}

export interface ViewsByDateResponse {
  items: ViewsByDateItem[];
  granularity: string;
  period_start: string;
  period_end: string;
}

// Vistas de página
export interface PageViewsResponse {
  page_slug: string | null;
  views: number;
  days: number;
}

// Vistas de contenido
export interface ContentViewsResponse {
  content_type: string;
  content_id: number;
  views: number;
  days: number;
}

// Parámetros de consulta
export interface AnalyticsSummaryParams {
  days?: number;
}

export interface TopContentParams {
  content_type?: string;
  days?: number;
  limit?: number;
}

export interface ViewsByDateParams {
  days?: number;
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

export interface AnalyticsEventsParams {
  event_type?: string;
  content_type?: string;
  content_id?: number;
  days?: number;
  limit?: number;
  offset?: number;
}

export interface PageViewsParams {
  page_slug?: string;
  days?: number;
}

export interface ContentViewsPathParams {
  content_type: string;
  content_id: number;
}

export interface ContentViewsParams {
  days?: number;
}

// Realtime payloads from Socket.IO
export interface RealtimeSummaryPayload {
  total_page_views?: number;
  unique_visitors?: number;
  total_views?: number;
  unique_pages?: number;
  total_events?: number;
  top_pages?: Array<{ page_slug?: string; page?: string; views: number }>;
  top_referrers?: Array<{ referrer: string; count?: number; views?: number }>;
  top_countries?: Array<{ country: string; count?: number; views?: number }>;
  views_by_country?: Record<string, number>;
  views_by_date?: Record<string, number>;
  period_start?: string;
  period_end?: string;
  days?: number;
}

export interface RealtimeTopContentPayload {
  items: Array<{
    content_type: string;
    content_id: number;
    title?: string | null;
    views?: number;
    view_count?: number;
  }>;
  period_start?: string;
  period_end?: string;
}
