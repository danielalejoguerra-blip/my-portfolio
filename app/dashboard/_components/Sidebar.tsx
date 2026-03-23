'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
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
import PersonAddIcon from '@mui/icons-material/PersonAddRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRightRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeRounded';

export const DRAWER_WIDTH = 272;
export const DRAWER_COLLAPSED = 76;

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const t = useTranslations('dashboard.sidebar');
  const pathname = usePathname();

  const initials = (user?.full_name || user?.username || 'AD')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sections: { label: string; items: NavLink[] }[] = [
    {
      label: t('sections.overview'),
      items: [
        { href: '/dashboard/welcome', label: t('items.home'), icon: <DashboardIcon /> },
      ],
    },
    {
      label: t('sections.content'),
      items: [
        { href: '/dashboard/personal-info', label: t('items.personalInfo'), icon: <PersonIcon /> },
        { href: '/dashboard/projects', label: t('items.projects'), icon: <FolderIcon /> },
        { href: '/dashboard/experience', label: t('items.experience'), icon: <WorkIcon /> },
        { href: '/dashboard/education', label: t('items.education'), icon: <SchoolIcon /> },
        { href: '/dashboard/courses', label: t('items.courses'), icon: <MenuBookIcon /> },
        { href: '/dashboard/blog', label: t('items.blog'), icon: <ArticleIcon /> },
        { href: '/dashboard/skills', label: t('items.skills'), icon: <BuildIcon /> },
        { href: '/dashboard/analytics', label: t('items.analytics'), icon: <AnalyticsIcon /> },
      ],
    },
    {
      label: t('sections.admin'),
      items: [
        { href: '/dashboard/users', label: t('items.users'), icon: <GroupIcon /> },
        { href: '/register', label: t('items.register'), icon: <PersonAddIcon /> },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <Box
        component={Link}
        href="/dashboard/welcome"
        onClick={onMobileClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1.5 : 2.5,
          py: 2.5,
          textDecoration: 'none',
          color: 'text.primary',
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'all 0.2s ease',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '14px',
            background: 'var(--gradient-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
            flexShrink: 0,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 22, color: '#fff' }} />
        </Box>
        {!collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap fontWeight={800} letterSpacing="-0.02em" sx={{ fontSize: '0.9rem' }}>
              {t('brand')}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.65rem', opacity: 0.7 }}>
              {t('brandSub')}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1.5 }}>
        {sections.map((section, sectionIdx) => (
          <Box key={section.label}>
            {!collapsed ? (
              <Typography
                sx={{
                  px: 2.5,
                  pt: sectionIdx > 0 ? 2 : 0.5,
                  pb: 0.75,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  opacity: 0.6,
                }}
              >
                {section.label}
              </Typography>
            ) : sectionIdx > 0 ? (
              <Divider sx={{ my: 1.5, mx: 2, opacity: 0.4 }} />
            ) : null}
            <List disablePadding sx={{ px: 0.5 }}>
              {section.items.map((item) => {
                const active = isActive(item.href);
                const btn = (
                  <ListItemButton
                    key={item.href}
                    component={Link}
                    href={item.href}
                    onClick={onMobileClose}
                    selected={active}
                    sx={{
                      minHeight: 42,
                      px: collapsed ? 1.5 : 1.75,
                      py: 0.7,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: '12px',
                      mx: 0.75,
                      mb: 0.25,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': active ? {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--gradient-accent)',
                        opacity: 0.12,
                        borderRadius: 'inherit',
                      } : {},
                      '&.Mui-selected': {
                        bgcolor: 'transparent',
                        color: 'primary.main',
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                        '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) },
                      },
                      '&:not(.Mui-selected):hover': {
                        bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                      },
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {/* Active indicator dot */}
                    {active && !collapsed && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 20,
                          borderRadius: '0 4px 4px 0',
                          background: 'var(--gradient-accent)',
                        }}
                      />
                    )}
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed ? 0 : 1.5,
                        justifyContent: 'center',
                        color: active ? 'primary.main' : 'text.secondary',
                        fontSize: 20,
                        '& .MuiSvgIcon-root': { fontSize: 20 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.82rem',
                          fontWeight: active ? 600 : 500,
                          letterSpacing: '-0.01em',
                        }}
                      />
                    )}
                  </ListItemButton>
                );
                return collapsed ? (
                  <Tooltip key={item.href} title={item.label} placement="right" arrow>
                    {btn}
                  </Tooltip>
                ) : (
                  btn
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Footer: user card + collapse */}
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: collapsed ? 1 : 1.25,
            borderRadius: '14px',
            background: (theme) => alpha(theme.palette.primary.main, 0.06),
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.2s ease',
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
              boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            {initials}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" fontWeight={600} noWrap display="block" sx={{ fontSize: '0.75rem' }}>
                {user?.full_name || user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ fontSize: '0.6rem', opacity: 0.7 }}>
                {user?.email}
              </Typography>
            </Box>
          )}
          {!collapsed && (
            <Tooltip title={t('logout')} arrow>
              <IconButton
                size="small"
                onClick={logout}
                sx={{
                  color: 'error.main',
                  opacity: 0.7,
                  '&:hover': { opacity: 1, bgcolor: (theme) => alpha(theme.palette.error.main, 0.08) },
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {collapsed && (
          <Tooltip title={t('logout')} arrow placement="right">
            <IconButton onClick={logout} size="small" sx={{ width: '100%', mt: 0.5, color: 'error.main', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        <Stack direction="row" justifyContent="center" sx={{ mt: 0.75 }}>
          <Tooltip title={collapsed ? t('expand') : t('collapse')} arrow placement="right">
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                '&:hover': { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.08) },
              }}
            >
              {collapsed ? <ChevronRightIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  const glassDrawerSx = {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid var(--glass-border)',
  };

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, ...glassDrawerSx },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH,
            transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            ...glassDrawerSx,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
