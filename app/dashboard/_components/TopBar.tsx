'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/MenuRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeRounded';
import CircleIcon from '@mui/icons-material/Circle';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const t = useTranslations('dashboard.sidebar');
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes('/personal-info')) return t('items.personalInfo');
    if (pathname.includes('/users')) return t('items.users');
    if (pathname.includes('/projects')) return t('items.projects');
    if (pathname.includes('/experience')) return t('items.experience');
    if (pathname.includes('/education')) return t('items.education');
    if (pathname.includes('/courses')) return t('items.courses');
    if (pathname.includes('/blog')) return t('items.blog');
    if (pathname.includes('/skills')) return t('items.skills');
    if (pathname.includes('/analytics')) return t('items.analytics');
    return t('items.home');
  };

  const initials = (user?.full_name || user?.username || 'AD')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        display: { xs: 'flex', md: 'none' },
        bgcolor: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            color: 'text.primary',
            bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
            '&:hover': { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.08) },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '8px',
            background: 'var(--gradient-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 16, color: '#fff' }} />
        </Box>

        <Typography variant="subtitle2" fontWeight={700} color="text.primary" noWrap sx={{ flex: 1, letterSpacing: '-0.01em' }}>
          {getPageTitle()}
        </Typography>

        <Chip
          icon={<CircleIcon sx={{ fontSize: '8px !important', color: 'success.main' }} />}
          label="Online"
          size="small"
          variant="outlined"
          sx={{ height: 26, fontSize: '0.65rem', fontWeight: 600, borderColor: (theme) => alpha(theme.palette.success.main, 0.3) }}
        />

        <Avatar
          src={user?.avatar_url || undefined}
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.65rem',
            fontWeight: 700,
            background: 'var(--gradient-accent)',
            color: '#fff',
            boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          {initials}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
