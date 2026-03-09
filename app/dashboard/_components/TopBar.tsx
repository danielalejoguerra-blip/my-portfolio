'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { usePathname, useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/MenuRounded';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import FolderIcon from '@mui/icons-material/FolderRounded';
import WorkIcon from '@mui/icons-material/WorkRounded';
import SchoolIcon from '@mui/icons-material/SchoolRounded';
import MenuBookIcon from '@mui/icons-material/MenuBookRounded';
import ArticleIcon from '@mui/icons-material/ArticleRounded';
import BuildIcon from '@mui/icons-material/BuildRounded';
import AnalyticsIcon from '@mui/icons-material/AnalyticsRounded';
import GroupIcon from '@mui/icons-material/GroupRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import DashboardLanguageSelector from './DashboardLanguageSelector';

interface TopBarProps {
  onMenuClick: () => void;
}

const PAGE_MAP: { match: string; labelKey: string; Icon: React.ElementType }[] = [
  { match: '/personal-info', labelKey: 'items.personalInfo', Icon: PersonIcon },
  { match: '/users',         labelKey: 'items.users',        Icon: GroupIcon },
  { match: '/projects',      labelKey: 'items.projects',     Icon: FolderIcon },
  { match: '/experience',    labelKey: 'items.experience',   Icon: WorkIcon },
  { match: '/education',     labelKey: 'items.education',    Icon: SchoolIcon },
  { match: '/courses',       labelKey: 'items.courses',      Icon: MenuBookIcon },
  { match: '/blog',          labelKey: 'items.blog',         Icon: ArticleIcon },
  { match: '/skills',        labelKey: 'items.skills',       Icon: BuildIcon },
  { match: '/analytics',     labelKey: 'items.analytics',    Icon: AnalyticsIcon },
];

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const t = useTranslations('dashboard.sidebar');
  const tBar = useTranslations('dashboard.topBar');
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const page = PAGE_MAP.find((p) => pathname.includes(p.match));
  const pageTitle = page ? t(page.labelKey as Parameters<typeof t>[0]) : t('items.home');
  const PageIcon = page?.Icon ?? DashboardIcon;

  const initials = (user?.full_name || user?.username || 'AD')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const displayName = user?.full_name || user?.username || 'Admin';
  const role = 'Administrator';

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ gap: 1, px: { xs: 1.5, md: 2.5 }, minHeight: { xs: 56, md: 64 } }}>

        {/* Mobile hamburger */}
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: 'text.secondary',
            borderRadius: '10px',
            '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.06) },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page icon + title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: (t) => `0 4px 12px ${alpha(t.palette.primary.main, 0.35)}`,
            }}
          >
            <PageIcon sx={{ fontSize: 17, color: '#fff' }} />
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="text.primary"
              lineHeight={1.2}
              letterSpacing="-0.02em"
              noWrap
            >
              {pageTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Dashboard
            </Typography>
          </Box>

          {/* Mobile: just title */}
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color="text.primary"
            noWrap
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            {pageTitle}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Online badge */}
        <Chip
          icon={<CircleIcon sx={{ fontSize: '7px !important' }} />}
          label="Online"
          size="small"
          sx={{
            display: { xs: 'none', md: 'flex' },
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'success.main',
            bgcolor: (t) => alpha(t.palette.success.main, 0.08),
            border: '1px solid',
            borderColor: (t) => alpha(t.palette.success.main, 0.2),
            '& .MuiChip-icon': { color: 'success.main' },
          }}
        />

        {/* Thin separator */}
        {/* Language selector */}
        <DashboardLanguageSelector />

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.5, display: { xs: 'none', md: 'block' }, borderColor: 'var(--glass-border)' }}
        />

        {/* User menu */}
        <Box ref={menuRef} sx={{ position: 'relative' }}>
          <Box
            component="button"
            onClick={() => setMenuOpen((v) => !v)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1,
              py: 0.75,
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background 0.15s',
              '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) },
            }}
          >
            <Avatar
              src={user?.avatar_url || undefined}
              sx={{
                width: 34,
                height: 34,
                fontSize: '0.7rem',
                fontWeight: 700,
                background: 'var(--gradient-accent)',
                color: '#fff',
                boxShadow: (t) => `0 0 0 2px ${alpha(t.palette.primary.main, 0.25)}`,
              }}
            >
              {initials}
            </Avatar>

            <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
              <Typography variant="caption" display="block" fontWeight={700} color="text.primary" lineHeight={1.3} noWrap>
                {displayName}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" lineHeight={1.2} noWrap sx={{ fontSize: '0.65rem' }}>
                {role}
              </Typography>
            </Box>

            <KeyboardArrowDownIcon
              sx={{
                display: { xs: 'none', md: 'block' },
                fontSize: 16,
                color: 'text.secondary',
                transition: 'transform 0.2s',
                transform: menuOpen ? 'rotate(180deg)' : 'none',
              }}
            />
          </Box>

          {/* Dropdown */}
          {menuOpen && (
            <Paper
              elevation={0}
              sx={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: 200,
                borderRadius: '14px',
                border: '1px solid var(--glass-border)',
                bgcolor: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
                animation: 'fadeInUp 0.18s ease both',
              }}
            >
              {/* User info header */}
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--glass-border)' }}>
                <Typography variant="caption" fontWeight={700} color="text.primary" display="block" noWrap>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ fontSize: '0.65rem' }}>
                  {user?.email ?? role}
                </Typography>
              </Box>

              <Box sx={{ p: 0.75 }}>
                <MenuItem
                  dense
                  sx={{ borderRadius: '8px', gap: 1, fontSize: '0.8rem' }}
                  onClick={() => setMenuOpen(false)}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <AccountCircleIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
                  </ListItemIcon>
                  {tBar('profile')}
                </MenuItem>

                <Divider sx={{ my: 0.5, borderColor: 'var(--glass-border)' }} />

                <MenuItem
                  dense
                  onClick={handleLogout}
                  sx={{
                    borderRadius: '8px',
                    gap: 1,
                    fontSize: '0.8rem',
                    color: 'error.main',
                    '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <LogoutIcon sx={{ fontSize: 17, color: 'error.main' }} />
                  </ListItemIcon>
                  {tBar('signOut')}
                </MenuItem>
              </Box>
            </Paper>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
