'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';

import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';

import { PageHeader } from '../_components';

export default function UsersPage() {
  const t = useTranslations('users');

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3}>
        <PageHeader
          icon={<GroupRoundedIcon />}
          title={t('title')}
          subtitle={t('subtitle')}
          actions={
            <Button component={Link} href="/register" variant="contained" size="small" startIcon={<PersonAddRoundedIcon />}>
              {t('addUser')}
            </Button>
          }
        />

        {/* Search / Filters */}
        <Card className="fade-in-up" sx={{ animationDelay: '100ms' }}>
          <CardContent sx={{ py: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('searchPlaceholder')}
                disabled
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
                <Typography variant="body2" color="text.secondary">{t('filterLabel')}</Typography>
                <Chip label={t('filterAll')} size="small" sx={{
                  fontWeight: 600, fontSize: '0.7rem',
                  bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                  color: 'primary.main',
                }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Empty state */}
        <Card className="fade-in-up" sx={{ animationDelay: '200ms' }}>
          <CardContent sx={{ py: 10, textAlign: 'center' }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: 3, mx: 'auto', mb: 2.5,
              background: 'var(--gradient-accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: (th) => `0 8px 32px ${alpha(th.palette.primary.main, 0.25)}`,
            }}>
              <GroupRoundedIcon sx={{ fontSize: 36, color: '#fff' }} />
            </Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>{t('emptyTitle')}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
              {t('emptyDescription')}
            </Typography>
            <Button component={Link} href="/register" variant="contained" startIcon={<VerifiedUserRoundedIcon />}>
              {t('emptyCta')}
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
