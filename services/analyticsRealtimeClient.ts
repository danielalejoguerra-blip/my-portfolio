import { io, type Socket } from 'socket.io-client';
import type {
  AnalyticsEvent,
  AnalyticsSummary,
  TopContentResponse,
  RealtimeSummaryPayload,
  RealtimeTopContentPayload,
} from '@/types';

type RealtimeHandlers = {
  onEvent?: (event: AnalyticsEvent) => void;
  onSummary?: (summary: AnalyticsSummary) => void;
  onTopContent?: (top: TopContentResponse) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
};

const toNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

function normalizeSummary(payload: RealtimeSummaryPayload): AnalyticsSummary {
  const topPages = Array.isArray(payload.top_pages)
    ? payload.top_pages.map((item) => ({
        page_slug: String(item.page_slug ?? item.page ?? '—'),
        views: toNumber(item.views),
      }))
    : [];

  const topReferrers = Array.isArray(payload.top_referrers)
    ? payload.top_referrers.map((item) => ({
        referrer: String(item.referrer ?? '—'),
        count: toNumber(item.count ?? item.views),
      }))
    : [];

  const topCountries = Array.isArray(payload.top_countries)
    ? payload.top_countries.map((item) => ({
        country: String(item.country ?? '—'),
        count: toNumber(item.count ?? item.views),
      }))
    : payload.views_by_country
      ? Object.entries(payload.views_by_country)
          .map(([country, count]) => ({ country, count: toNumber(count) }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      : [];

  const totalViewsFromTopPages = topPages.reduce((sum, item) => sum + item.views, 0);
  const totalViewsFromByDate = payload.views_by_date
    ? Object.values(payload.views_by_date).reduce((sum, value) => sum + toNumber(value), 0)
    : 0;

  const totalViewsCandidate =
    payload.total_views ?? payload.total_page_views ?? (totalViewsFromTopPages > 0 ? totalViewsFromTopPages : totalViewsFromByDate);

  const normalizedTotalViews = toNumber(
    totalViewsCandidate
  );

  const normalizedUniquePages = toNumber(
    payload.unique_pages ?? payload.unique_visitors ?? topPages.length
  );

  const normalizedTotalEvents = toNumber(
    payload.total_events ?? payload.total_page_views ?? normalizedTotalViews
  );

  return {
    total_views: normalizedTotalViews,
    unique_pages: normalizedUniquePages,
    total_events: normalizedTotalEvents,
    top_pages: topPages,
    top_referrers: topReferrers,
    top_countries: topCountries,
    period_start: String(payload.period_start ?? new Date().toISOString()),
    period_end: String(payload.period_end ?? new Date().toISOString()),
    days: toNumber(payload.days),
  };
}

function normalizeTopContent(payload: RealtimeTopContentPayload): TopContentResponse {
  return {
    items: (payload.items || []).map((item) => ({
      content_type: String(item.content_type),
      content_id: toNumber(item.content_id),
      title: item.title ?? null,
      views: toNumber(item.views ?? item.view_count),
    })),
    period_start: String(payload.period_start ?? new Date().toISOString()),
    period_end: String(payload.period_end ?? new Date().toISOString()),
  };
}

function buildSocketConfig() {
  const socketUrl =
    process.env.NEXT_PUBLIC_ANALYTICS_SOCKET_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:5003';

  const socketPathRaw =
    process.env.NEXT_PUBLIC_ANALYTICS_SOCKET_PATH ||
    process.env.NEXT_PUBLIC_SOCKETIO_PATH ||
    '/socket.io';

  const socketPath = socketPathRaw.startsWith('/') ? socketPathRaw : `/${socketPathRaw}`;

  const namespaceRaw = process.env.NEXT_PUBLIC_ANALYTICS_NAMESPACE || '/analytics';
  const namespace = namespaceRaw.startsWith('/') ? namespaceRaw : `/${namespaceRaw}`;

  return { socketUrl, socketPath, namespace };
}

export function connectAnalyticsRealtime(handlers: RealtimeHandlers): () => void {
  const { socketUrl, socketPath, namespace } = buildSocketConfig();
  if (!socketUrl) {
    handlers.onError?.(new Error('Missing analytics socket URL'));
    return () => undefined;
  }

  const socket: Socket = io(`${socketUrl}${namespace}`, {
    path: socketPath,
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => handlers.onConnect?.());
  socket.on('disconnect', () => handlers.onDisconnect?.());
  socket.on('connect_error', (error) => handlers.onError?.(error));

  socket.on('analytics:event', (payload: AnalyticsEvent) => {
    handlers.onEvent?.(payload);
  });

  socket.on('analytics:summary', (payload: RealtimeSummaryPayload) => {
    handlers.onSummary?.(normalizeSummary(payload));
  });

  socket.on('analytics:top_content', (payload: RealtimeTopContentPayload) => {
    handlers.onTopContent?.(normalizeTopContent(payload));
  });

  return () => {
    socket.removeAllListeners();
    socket.disconnect();
  };
}
