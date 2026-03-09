'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import LanguageIcon from '@mui/icons-material/LanguageRounded';
import CheckIcon from '@mui/icons-material/CheckRounded';
import { locales, type Locale } from '@/app/i18n/config';
import { setLocaleCookie } from '@/app/actions/setLocale';

const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

const localeFlags: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇺🇸',
};

export default function DashboardLanguageSelector() {
  const t = useTranslations('dashboard.topBar');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  const handleSelect = (newLocale: Locale) => {
    if (newLocale === locale) {
      handleClose();
      return;
    }
    handleClose();
    startTransition(async () => {
      await setLocaleCookie(newLocale);
      router.refresh();
    });
  };

  return (
    <>
      <Tooltip title={t('language')} placement="bottom">
        <IconButton
          onClick={handleOpen}
          size="small"
          disabled={isPending}
          sx={{
            borderRadius: '10px',
            color: 'text.secondary',
            border: '1px solid var(--glass-border)',
            bgcolor: anchor ? (t) => alpha(t.palette.text.primary, 0.05) : 'transparent',
            '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.06) },
            px: 1,
            gap: 0.5,
          }}
        >
          {isPending ? (
            <CircularProgress size={15} color="inherit" />
          ) : (
            <LanguageIcon sx={{ fontSize: 17 }} />
          )}
          <Typography
            component="span"
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: '0.72rem',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {localeFlags[locale]}
          </Typography>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              minWidth: 150,
              borderRadius: '14px',
              border: '1px solid var(--glass-border)',
              bgcolor: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid var(--glass-border)' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} lineHeight={1}>
            {t('selectLanguage')}
          </Typography>
        </Box>

        <Box sx={{ p: 0.75 }}>
          {locales.map((loc) => (
            <MenuItem
              key={loc}
              dense
              selected={loc === locale}
              onClick={() => handleSelect(loc)}
              sx={{
                borderRadius: '8px',
                gap: 1,
                fontSize: '0.8rem',
                fontWeight: loc === locale ? 700 : 400,
                justifyContent: 'space-between',
                '&.Mui-selected': {
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                  '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
              </Box>
              {loc === locale && (
                <CheckIcon sx={{ fontSize: 14, color: 'primary.main' }} />
              )}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </>
  );
}
