'use client';

import { RegisterForm } from '@/app/components/forms';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

export default function RegisterPage() {
  const t = useTranslations('auth.register');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', top: -160, right: -160, width: 384, height: 384, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.06, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -160, left: -160, width: 384, height: 384, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.06, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <Grid container spacing={3} sx={{ maxWidth: 1100, position: 'relative', zIndex: 1 }}>
        {/* Left panel */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 4, md: 5 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(59,130,246,0.1)' }}>
                  <VerifiedUserRoundedIcon sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('badge')}</Typography>
                  <Typography variant="h5" fontWeight={700}>{t('title')}</Typography>
                </Box>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>{t('subtitle')}</Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(59,130,246,0.1)' }}>
                  <AutoAwesomeRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{t('feature1Title')}</Typography>
                  <Typography variant="body2" color="text.secondary">{t('feature1Desc')}</Typography>
                </Box>
              </Stack>

              <Box sx={{ mt: 'auto', pt: 4 }}>
                <Button component={Link} href="/dashboard" startIcon={<ArrowBackRoundedIcon />} size="small">
                  {t('backToDashboard')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: register form */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card variant="outlined" sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 4, md: 5 } }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(59,130,246,0.1)' }}>
                  <PersonAddRoundedIcon sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('formBadge')}</Typography>
                  <Typography variant="h6" fontWeight={600}>{t('formTitle')}</Typography>
                </Box>
              </Stack>

              <RegisterForm />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
