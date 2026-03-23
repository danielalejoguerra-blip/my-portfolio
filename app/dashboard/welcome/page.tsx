'use client';

import { useAuth } from '@/hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardRounded';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUserRounded';
import DnsIcon from '@mui/icons-material/DnsRounded';
import LockIcon from '@mui/icons-material/LockRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTimeRounded';
import ContactPageIcon from '@mui/icons-material/ContactPageRounded';
import GroupIcon from '@mui/icons-material/GroupRounded';
import PersonAddIcon from '@mui/icons-material/PersonAddRounded';
import FolderIcon from '@mui/icons-material/FolderRounded';
import { alpha } from '@mui/material/styles';

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const t = useTranslations('dashboard.welcome');

  if (isLoading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const stats = [
    { label: t('sessionTitle'), value: t('sessionActive'), icon: <VerifiedUserIcon fontSize="small" />, gradient: 'linear-gradient(135deg, #22c55e, #10b981)' },
    { label: t('system.backendTitle'), value: t('system.backendStatus'), icon: <DnsIcon fontSize="small" />, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    { label: t('system.authTitle'), value: t('system.authStatus'), icon: <LockIcon fontSize="small" />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
    { label: t('system.activityTitle'), value: t('system.activityStatus'), icon: <AccessTimeIcon fontSize="small" />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  ];

  const actions = [
    { href: '/dashboard/personal-info', icon: <ContactPageIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', title: t('actions.personalInfoTitle'), sub: t('actions.personalInfoSubtitle'), desc: t('actions.personalInfoDesc') },
    { href: '/dashboard/users', icon: <GroupIcon />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', title: t('actions.usersTitle'), sub: t('actions.usersSubtitle'), desc: t('actions.usersDesc') },
    { href: '/register', icon: <PersonAddIcon />, gradient: 'linear-gradient(135deg, #22c55e, #10b981)', title: t('actions.registerTitle'), sub: t('actions.registerSubtitle'), desc: t('actions.registerDesc') },
    { href: '/dashboard/projects', icon: <FolderIcon />, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', title: t('actions.projectsTitle'), sub: t('actions.projectsSubtitle'), desc: t('actions.projectsDesc') },
  ];

  const systemStatus = [
    { title: t('system.backendTitle'), status: t('system.backendStatus'), live: true },
    { title: t('system.authTitle'), status: t('system.authStatus'), live: true },
    { title: t('system.activityTitle'), status: t('system.activityStatus'), live: false },
  ];

  const initials = (user?.full_name || user?.username || 'AD')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3.5}>
        {/* ── Hero greeting ── */}
        <Box
          className="fade-in-up"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'var(--gradient-hero)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -80,
              right: -80,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            <Avatar
              src={user?.avatar_url || undefined}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                fontSize: '1.6rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
                border: '3px solid',
                borderColor: (th) => alpha(th.palette.common.white, 0.15),
              }}
            >
              {user?.avatar_url ? undefined : initials}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Box sx={{
                  display: 'inline-flex', p: 0.5, borderRadius: 1.5,
                  background: (th) => alpha(th.palette.primary.main, 0.12),
                }}>
                  <AutoAwesomeIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                </Box>
                <Typography variant="caption" fontWeight={700} textTransform="uppercase" letterSpacing={2} color="primary.main">
                  {t('welcomeBadge')}
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight={800} sx={{
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}>
                {t('welcomeTitle', { name: user?.full_name || user?.username || t('fallbackName') })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 480 }}>
                {t('welcomeSubtitle')}
              </Typography>
            </Box>

            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              label={t('sessionActive')}
              sx={{
                fontWeight: 600,
                alignSelf: { xs: 'flex-start', md: 'center' },
                bgcolor: (th) => alpha('#22c55e', th.palette.mode === 'dark' ? 0.15 : 0.1),
                color: '#22c55e',
                border: '1px solid',
                borderColor: (th) => alpha('#22c55e', 0.25),
                '& .MuiChip-icon': { color: '#22c55e' },
              }}
            />
          </Stack>
        </Box>

        {/* ── Stats row ── */}
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid key={stat.label} size={{ xs: 6, lg: 3 }}>
              <Card
                className="fade-in-up"
                sx={{
                  animationDelay: `${index * 80}ms`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: stat.gradient,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      background: stat.gradient,
                      color: '#fff',
                      boxShadow: `0 4px 14px ${stat.gradient.includes('#22c55e') ? 'rgba(34,197,94,0.3)' : stat.gradient.includes('#6366f1') ? 'rgba(99,102,241,0.3)' : stat.gradient.includes('#8b5cf6') ? 'rgba(139,92,246,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="caption" fontWeight={600} textTransform="uppercase" color="text.secondary" letterSpacing={0.8} sx={{ fontSize: '0.68rem' }}>
                      {stat.label}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ── Quick actions ── */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              color: '#fff',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>{t('actions.dashboardTitle')}</Typography>
          </Stack>

          <Grid container spacing={2}>
            {actions.map((action, index) => (
              <Grid key={action.href} size={{ xs: 12, sm: 6, xl: 3 }}>
                <Card
                  className="fade-in-up"
                  sx={{
                    height: '100%',
                    animationDelay: `${(index + 4) * 80}ms`,
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 'var(--shadow-elevated)',
                      '& .action-arrow': {
                        transform: 'translateX(4px)',
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={action.href}
                    sx={{
                      height: '100%',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%', mb: 1.5 }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        background: action.gradient,
                        color: '#fff',
                        boxShadow: `0 4px 14px rgba(0,0,0,0.15)`,
                        flexShrink: 0,
                      }}>
                        {action.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {action.sub}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon
                        className="action-arrow"
                        sx={{
                          color: 'text.disabled',
                          fontSize: 18,
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6,
                    }}>
                      {action.desc}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── System status ── */}
        <Card
          className="fade-in-up"
          sx={{ animationDelay: '600ms' }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  color: '#fff',
                }}>
                  <DnsIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>{t('system.title')}</Typography>
              </Stack>
              <Chip
                component={Link}
                href="/dashboard/users"
                clickable
                label={t('system.cta')}
                size="small"
                icon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                  color: 'primary.main',
                  '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) },
                }}
              />
            </Stack>

            <Grid container spacing={2}>
              {systemStatus.map((s) => (
                <Grid key={s.title} size={{ xs: 12, md: 4 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: (th) => alpha(th.palette.divider, 0.04),
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: (th) => alpha(th.palette.divider, 0.08),
                    },
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      {s.live ? (
                        <Box sx={{
                          position: 'relative',
                          width: 10,
                          height: 10,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -3,
                            borderRadius: '50%',
                            bgcolor: (th) => alpha('#22c55e', 0.2),
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            bgcolor: '#22c55e',
                            animation: 'pulse-glow 2s infinite',
                          },
                        }} />
                      ) : (
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      )}
                      <Box>
                        <Typography variant="caption" fontWeight={700} sx={{ lineHeight: 1.4 }}>{s.title}</Typography>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{s.status}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
