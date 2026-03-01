'use client';

import * as React from 'react';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

/* ─── Palette tokens ─── */
const tokens = {
  light: {
    primary: '#6366f1',         // Indigo-500
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    secondary: '#ec4899',       // Pink-500
    secondaryLight: '#f472b6',
    secondaryDark: '#db2777',
    bg: '#f8fafc',
    paper: '#ffffff',
    paperGlass: 'rgba(255,255,255,0.72)',
    surfaceFloat: 'rgba(255,255,255,0.55)',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    divider: 'rgba(148,163,184,0.18)',
    border: 'rgba(148,163,184,0.22)',
    shadowCard: '0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.06)',
    shadowElevated: '0 8px 32px rgba(0,0,0,0.10)',
    gradientHero: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(236,72,153,0.06) 100%)',
    gradientAccent: 'linear-gradient(135deg, #6366f1, #ec4899)',
  },
  dark: {
    primary: '#818cf8',         // Indigo-400
    primaryLight: '#a5b4fc',
    primaryDark: '#6366f1',
    secondary: '#f472b6',
    secondaryLight: '#f9a8d4',
    secondaryDark: '#ec4899',
    bg: '#0b0f1a',
    paper: '#111827',
    paperGlass: 'rgba(17,24,39,0.72)',
    surfaceFloat: 'rgba(30,41,59,0.55)',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    divider: 'rgba(148,163,184,0.10)',
    border: 'rgba(148,163,184,0.12)',
    shadowCard: '0 1px 3px rgba(0,0,0,0.20), 0 4px 24px rgba(0,0,0,0.24)',
    shadowElevated: '0 8px 32px rgba(0,0,0,0.40)',
    gradientHero: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(236,72,153,0.08) 100%)',
    gradientAccent: 'linear-gradient(135deg, #818cf8, #f472b6)',
  },
};

function buildTheme(mode: 'light' | 'dark') {
  const t = tokens[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: t.primary, light: t.primaryLight, dark: t.primaryDark, contrastText: '#fff' },
      secondary: { main: t.secondary, light: t.secondaryLight, dark: t.secondaryDark, contrastText: '#fff' },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.textPrimary, secondary: t.textSecondary },
      divider: t.divider,
      error: { main: '#f43f5e' },
      warning: { main: '#f59e0b' },
      info: { main: '#06b6d4' },
      success: { main: '#10b981' },
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h4: { fontWeight: 800, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.015em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, fontSize: '0.8rem' },
      body2: { lineHeight: 1.7 },
      caption: { lineHeight: 1.5 },
      overline: { fontWeight: 700, letterSpacing: '0.08em' },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            '--glass-bg': t.paperGlass,
            '--glass-border': t.border,
            '--shadow-card': t.shadowCard,
            '--shadow-elevated': t.shadowElevated,
            '--gradient-hero': t.gradientHero,
            '--gradient-accent': t.gradientAccent,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
          },
          sizeSmall: { borderRadius: 10, padding: '6px 16px', fontSize: '0.8rem' },
          sizeMedium: { borderRadius: 12, padding: '8px 22px' },
          sizeLarge: { borderRadius: 14, padding: '12px 28px' },
          contained: {
            background: t.gradientAccent,
            boxShadow: `0 2px 12px ${alpha(t.primary, 0.35)}`,
            '&:hover': {
              background: t.gradientAccent,
              filter: 'brightness(1.1)',
              boxShadow: `0 4px 20px ${alpha(t.primary, 0.45)}`,
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderColor: t.border,
            backdropFilter: 'blur(12px)',
            '&:hover': {
              borderColor: t.primary,
              backgroundColor: alpha(t.primary, 0.06),
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${t.border}`,
            background: t.paperGlass,
            backdropFilter: 'blur(16px)',
            boxShadow: t.shadowCard,
            transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
            backgroundImage: 'none',
            '&:hover': {
              boxShadow: t.shadowElevated,
              borderColor: alpha(t.primary, 0.25),
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, borderRadius: 10 },
          outlined: {
            borderColor: t.border,
            backdropFilter: 'blur(8px)',
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s ease',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(t.primary, 0.4),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 1.5,
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            border: `1px solid ${t.border}`,
            background: t.paperGlass,
            backdropFilter: 'blur(24px)',
            boxShadow: t.shadowElevated,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
            backgroundImage: 'none',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            marginLeft: 8,
            marginRight: 8,
            transition: 'all 0.18s ease',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backdropFilter: 'blur(8px)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 10,
            fontSize: '0.75rem',
            fontWeight: 500,
            backdropFilter: 'blur(12px)',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: t.divider },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: t.divider,
          },
          head: {
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: t.textSecondary,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: {
            borderColor: t.border,
            borderRadius: 20,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: { padding: 8 },
          switchBase: {
            '&.Mui-checked': { color: '#fff' },
            '&.Mui-checked + .MuiSwitch-track': {
              background: t.gradientAccent,
              opacity: 1,
            },
          },
          track: { borderRadius: 12, opacity: 0.2 },
          thumb: { boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 8, height: 8 },
          bar: { borderRadius: 8 },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 700,
          },
        },
      },
    },
  });
}

/* ─── Global styles for glass effects & scrollbar ─── */
const globalCSS = {
  '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap')",
  '*::-webkit-scrollbar': { width: 6, height: 6 },
  '*::-webkit-scrollbar-track': { background: 'transparent' },
  '*::-webkit-scrollbar-thumb': {
    background: 'rgba(148,163,184,0.25)',
    borderRadius: 3,
    '&:hover': { background: 'rgba(148,163,184,0.4)' },
  },
  '::selection': { background: 'rgba(99,102,241,0.25)' },
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(12px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '-200% center' },
    '100%': { backgroundPosition: '200% center' },
  },
  '@keyframes pulse-glow': {
    '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' },
    '50%': { boxShadow: '0 0 0 8px rgba(99,102,241,0)' },
  },
  '.fade-in-up': {
    animation: 'fadeInUp 0.45s cubic-bezier(.4,0,.2,1) both',
  },
  '.glass-surface': {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--glass-border)',
  },
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Default to 'light' on server; update on client after mount to avoid hydration mismatch
  // (useMediaQuery returns false on server but may differ on client → replaced with useEffect)
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setMode(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const theme = React.useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalCSS} />
      {children}
    </ThemeProvider>
  );
}
