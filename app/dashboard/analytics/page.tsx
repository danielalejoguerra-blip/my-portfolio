'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { analyticsService, connectAnalyticsRealtime } from '@/services';
import type {
  AnalyticsSummary,
  TopContentResponse,
  ViewsByDateResponse,
  ViewsByDateItem,
  TopContentItem,
  AnalyticsEvent,
} from '@/types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LinearProgress from '@mui/material/LinearProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { alpha } from '@mui/material/styles';

import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import WebRoundedIcon from '@mui/icons-material/WebRounded';
import TouchAppRoundedIcon from '@mui/icons-material/TouchAppRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';

import { PageHeader } from '../_components';

export default function AnalyticsPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.analytics');

  const [days, setDays] = useState<number>(30);
  const [granularity, setGranularity] = useState<'hour' | 'day' | 'week' | 'month'>('day');

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topContent, setTopContent] = useState<TopContentResponse | null>(null);
  const [viewsByDate, setViewsByDate] = useState<ViewsByDateResponse | null>(null);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [realtimeError, setRealtimeError] = useState<string | null>(null);

  const fetchDataRef = useRef<() => Promise<void>>(async () => undefined);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, topContentRes, viewsByDateRes, eventsRes] = await Promise.all([
        analyticsService.getSummary({ days }),
        analyticsService.getTopContent({ days, limit: 10 }),
        analyticsService.getViewsByDate({ days, granularity }),
        analyticsService.getEvents({ days, limit: 20 }),
      ]);
      setSummary(summaryRes);
      setTopContent(topContentRes);
      setViewsByDate(viewsByDateRes);
      setRecentEvents(eventsRes);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar analíticas';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [days, granularity]);

  fetchDataRef.current = fetchData;

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) return;
    refreshTimerRef.current = setTimeout(() => {
      refreshTimerRef.current = null;
      void fetchDataRef.current();
    }, 900);
  }, []);

  useEffect(() => {
    if (!authLoading) fetchData();
  }, [authLoading, fetchData]);

  useEffect(() => {
    if (authLoading) return;

    const disconnect = connectAnalyticsRealtime({
      onConnect: () => {
        setRealtimeConnected(true);
        setRealtimeError(null);
      },
      onDisconnect: () => setRealtimeConnected(false),
      onError: (err) => {
        setRealtimeConnected(false);
        const message = err instanceof Error ? err.message : 'Socket connection error';
        setRealtimeError(message);
      },
      onEvent: (event) => {
        setRecentEvents((prev) => {
          const deduped = [event, ...prev.filter((item) => item.id !== event.id)];
          return deduped.slice(0, 20);
        });
        scheduleRefresh();
      },
      onSummary: (nextSummary) => {
        setSummary(nextSummary);
      },
      onTopContent: (nextTop) => {
        setTopContent(nextTop);
      },
    });

    return () => {
      disconnect();
      setRealtimeConnected(false);
      setRealtimeError(null);
    };
  }, [authLoading, scheduleRefresh]);

  useEffect(() => {
    if (authLoading) return;
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);

    pollingTimerRef.current = setInterval(() => {
      void fetchDataRef.current();
    }, 15000);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    };
  }, [authLoading]);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatCountryLabel = (country: string | null | undefined) => {
    if (!country) return 'Unknown';
    const normalized = country.trim().toLowerCase();
    if (normalized === 'local') return 'Local';
    if (normalized === 'unknown') return 'Unknown';
    return country;
  };

  const formatContentLabel = (event: AnalyticsEvent) => {
    if (!event.content_type) return 'Inferred by route';
    if (event.content_id == null) return event.content_type;
    return `${event.content_type} #${event.content_id}`;
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const maxViews = viewsByDate?.items ? Math.max(...viewsByDate.items.map((i: ViewsByDateItem) => i.views), 1) : 1;

  const summaryCards = [
    { icon: <VisibilityRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />, label: t('totalViews'), value: summary?.total_views?.toLocaleString() ?? '0' },
    { icon: <WebRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />, label: t('uniquePages'), value: summary?.unique_pages?.toLocaleString() ?? '0' },
    { icon: <TouchAppRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />, label: t('totalEvents'), value: summary?.total_events?.toLocaleString() ?? '0' },
    { icon: <CalendarTodayRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />, label: t('periodRange'), value: summary ? `${formatDate(summary.period_start)} — ${formatDate(summary.period_end)}` : '—', isDate: true },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3}>
        <PageHeader
          icon={<AnalyticsRoundedIcon />}
          title={t('title')}
          subtitle={t('subtitle')}
          actions={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Chip
                icon={realtimeConnected ? <WifiRoundedIcon /> : <WifiOffRoundedIcon />}
                label={realtimeConnected ? 'Realtime' : 'Offline'}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: (th) => alpha(realtimeConnected ? th.palette.success.main : th.palette.warning.main, 0.12),
                  color: realtimeConnected ? 'success.main' : 'warning.main',
                  '& .MuiChip-icon': {
                    color: realtimeConnected ? 'success.main' : 'warning.main',
                  },
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>{t('period')}</InputLabel>
                <Select value={days} label={t('period')} onChange={(e) => setDays(e.target.value as number)}>
                  <MenuItem value={7}>7 {t('days')}</MenuItem>
                  <MenuItem value={14}>14 {t('days')}</MenuItem>
                  <MenuItem value={30}>30 {t('days')}</MenuItem>
                  <MenuItem value={90}>90 {t('days')}</MenuItem>
                  <MenuItem value={365}>365 {t('days')}</MenuItem>
                </Select>
              </FormControl>
              <ToggleButtonGroup size="small" value={granularity} exclusive onChange={(_, v) => { if (v) setGranularity(v); }}>
                <ToggleButton value="hour">{t('hour')}</ToggleButton>
                <ToggleButton value="day">{t('day')}</ToggleButton>
                <ToggleButton value="week">{t('week')}</ToggleButton>
                <ToggleButton value="month">{t('month')}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          }
        />

        {error && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>}
        {realtimeError && <Alert severity="warning" sx={{ borderRadius: 2.5 }}>{`Realtime: ${realtimeError}`}</Alert>}

        {/* Summary cards */}
        {summary && (
          <Grid container spacing={2.5}>
            {summaryCards.map((card, index) => (
              <Grid key={`${card.label}-${index}`} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card className="fade-in-up" sx={{
                  height: '100%', animationDelay: `${index * 80}ms`,
                  position: 'relative', overflow: 'hidden',
                  '&::before': {
                    content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'var(--gradient-accent)',
                  },
                }}>
                  <CardContent sx={{ pt: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Box sx={{
                        width: 38, height: 38, borderRadius: 2,
                        background: 'var(--gradient-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: (th) => `0 4px 14px ${alpha(th.palette.primary.main, 0.3)}`,
                      }}>
                        {card.icon}
                      </Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{card.label}</Typography>
                    </Stack>
                    {card.isDate ? (
                      <Typography variant="body2" fontWeight={600}>{card.value}</Typography>
                    ) : (
                      <Typography variant="h4" fontWeight={700}>{card.value}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Views by date chart */}
        {viewsByDate && viewsByDate.items.length > 0 && (
          <Card className="fade-in-up" sx={{ animationDelay: '350ms' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: 1.5,
                  background: 'var(--gradient-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TrendingUpRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>{t('viewsOverTime')}</Typography>
              </Stack>
              <Stack spacing={0.75}>
                {viewsByDate.items.map((item: ViewsByDateItem, idx: number) => (
                  <Stack key={`${item.date}-${idx}`} direction="row" alignItems="center" spacing={1.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 75, textAlign: 'right', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {formatDate(item.date)}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.views / maxViews) * 100}
                        sx={{ height: 10, borderRadius: 1.5, bgcolor: (th) => alpha(th.palette.primary.main, 0.06) }}
                      />
                    </Box>
                    <Typography variant="caption" fontWeight={700} sx={{ minWidth: 40, textAlign: 'right' }}>
                      {item.views}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Ranking grids */}
        <Grid container spacing={2.5}>
          {/* Top pages */}
          {summary && summary.top_pages && summary.top_pages.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card className="fade-in-up" sx={{ height: '100%', animationDelay: '400ms' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <WebRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>{t('topPages')}</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {summary.top_pages.map((page: { page_slug: string; views: number }, idx: number) => (
                      <Stack key={`${page.page_slug}-${idx}`} direction="row" alignItems="center" spacing={1.5} sx={{
                        p: 1, borderRadius: 2,
                        bgcolor: (th) => alpha(th.palette.divider, 0.04),
                        border: '1px solid', borderColor: 'divider',
                      }}>
                        <Typography variant="caption" fontWeight={700} sx={{
                          width: 24, height: 24, borderRadius: 1,
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.1),
                          color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {idx + 1}
                        </Typography>
                        <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>{page.page_slug}</Typography>
                        <Chip label={`${page.views}`} size="small" sx={{
                          fontWeight: 700, bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: 'primary.main',
                        }} />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Top content */}
          {topContent && topContent.items && topContent.items.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card className="fade-in-up" sx={{ height: '100%', animationDelay: '460ms' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <EmojiEventsRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>{t('topContent')}</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {topContent.items.map((item: TopContentItem, idx: number) => (
                      <Stack key={`${item.content_type}-${item.content_id}-${idx}`} direction="row" alignItems="center" spacing={1.5} sx={{
                        p: 1, borderRadius: 2,
                        bgcolor: (th) => alpha(th.palette.divider, 0.04),
                        border: '1px solid', borderColor: 'divider',
                      }}>
                        <Typography variant="caption" fontWeight={700} sx={{
                          width: 24, height: 24, borderRadius: 1,
                          bgcolor: (th) => alpha(th.palette.secondary.main, 0.1),
                          color: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {idx + 1}
                        </Typography>
                        <Stack sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" noWrap fontWeight={600}>{item.title || `#${item.content_id}`}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{item.content_type}</Typography>
                        </Stack>
                        <Chip label={`${item.views}`} size="small" sx={{
                          fontWeight: 700, bgcolor: (th) => alpha(th.palette.secondary.main, 0.08), color: 'secondary.main',
                        }} />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Top referrers */}
          {summary && summary.top_referrers && summary.top_referrers.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card className="fade-in-up" sx={{ height: '100%', animationDelay: '520ms' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LinkRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>{t('topReferrers')}</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {summary.top_referrers.map((ref: { referrer: string; count: number }, idx: number) => (
                      <Stack key={`${ref.referrer}-${idx}`} direction="row" alignItems="center" spacing={1.5} sx={{
                        p: 1, borderRadius: 2,
                        bgcolor: (th) => alpha(th.palette.divider, 0.04),
                        border: '1px solid', borderColor: 'divider',
                      }}>
                        <Typography variant="caption" fontWeight={700} sx={{
                          width: 24, height: 24, borderRadius: 1,
                          bgcolor: (th) => alpha(th.palette.warning.main, 0.1),
                          color: 'warning.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {idx + 1}
                        </Typography>
                        <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>{ref.referrer}</Typography>
                        <Chip label={`${ref.count}`} size="small" sx={{
                          fontWeight: 700, bgcolor: (th) => alpha(th.palette.warning.main, 0.08), color: 'warning.main',
                        }} />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Top countries */}
          {summary && summary.top_countries && summary.top_countries.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card className="fade-in-up" sx={{ height: '100%', animationDelay: '580ms' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PublicRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>{t('topCountries')}</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {summary.top_countries.map((c: { country: string; count: number }, idx: number) => (
                      <Stack key={`${c.country}-${idx}`} direction="row" alignItems="center" spacing={1.5} sx={{
                        p: 1, borderRadius: 2,
                        bgcolor: (th) => alpha(th.palette.divider, 0.04),
                        border: '1px solid', borderColor: 'divider',
                      }}>
                        <Typography variant="caption" fontWeight={700} sx={{
                          width: 24, height: 24, borderRadius: 1,
                          bgcolor: (th) => alpha(th.palette.info.main, 0.1),
                          color: 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {idx + 1}
                        </Typography>
                        <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>{formatCountryLabel(c.country)}</Typography>
                        <Chip label={`${c.count}`} size="small" sx={{
                          fontWeight: 700, bgcolor: (th) => alpha(th.palette.info.main, 0.08), color: 'info.main',
                        }} />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Recent events table */}
        {recentEvents.length > 0 && (
          <Card className="fade-in-up" sx={{ animationDelay: '640ms' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TouchAppRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>{t('recentEvents')}</Typography>
              </Stack>
              <Divider sx={{ mb: 1, borderColor: 'var(--glass-border)' }} />
              <TableContainer component={Paper} elevation={0} sx={{
                maxHeight: 400, borderRadius: 2,
                border: '1px solid', borderColor: 'divider',
                bgcolor: (th) => alpha(th.palette.background.default, 0.5),
              }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>{t('table.type')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>{t('table.page')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>{t('table.content')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>{t('table.country')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>{t('table.date')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEvents.map((event, idx) => (
                      <TableRow key={`${event.id}-${event.created_at}-${idx}`} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Chip label={event.event_type} size="small" sx={{
                            fontWeight: 600, fontSize: '0.7rem',
                            bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                            color: 'primary.main',
                          }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" noWrap sx={{ maxWidth: 200, display: 'block', fontWeight: 500 }}>
                            {event.page_slug || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={500}>{formatContentLabel(event)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={500}>{formatCountryLabel(event.country)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{formatDateTime(event.created_at)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!summary && !error && (
          <Card className="fade-in-up" sx={{ animationDelay: '150ms' }}>
            <CardContent sx={{ py: 10, textAlign: 'center' }}>
              <Box sx={{
                width: 72, height: 72, borderRadius: 3, mx: 'auto', mb: 2.5,
                background: 'var(--gradient-accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: (th) => `0 8px 32px ${alpha(th.palette.primary.main, 0.25)}`,
              }}>
                <AnalyticsRoundedIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>{t('emptyTitle')}</Typography>
              <Typography variant="body2" color="text.secondary">{t('emptyDescription')}</Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
