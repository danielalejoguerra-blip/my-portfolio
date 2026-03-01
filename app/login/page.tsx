'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { authService } from '@/services';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginSchema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
    password: z.string().min(1, t('passwordRequired')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(data);
      window.location.href = '/dashboard/welcome';
    } catch {
      setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Decorative background blobs */}
      <Box sx={{ position: 'absolute', top: -160, right: -160, width: 384, height: 384, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.06, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -160, left: -160, width: 384, height: 384, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.06, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <Grid container spacing={3} sx={{ maxWidth: 960, position: 'relative', zIndex: 1 }}>
        {/* Left: features panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 4, md: 5 } }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(59,130,246,0.1)' }}>
                  <VerifiedUserRoundedIcon sx={{ color: 'primary.main' }} />
                </Avatar>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  {t('adminBadge')}
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{t('title')}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>{t('subtitle')}</Typography>

              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(59,130,246,0.1)' }}>
                    <AutoAwesomeRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">{t('feature1Title')}</Typography>
                    <Typography variant="body2" color="text.secondary">{t('feature1Desc')}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(139,92,246,0.1)' }}>
                    <LanguageRoundedIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">{t('feature2Title')}</Typography>
                    <Typography variant="body2" color="text.secondary">{t('feature2Desc')}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: login form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 4, md: 5 } }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(59,130,246,0.1)' }}>
                  <SecurityRoundedIcon sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('adminPanel')}</Typography>
                  <Typography variant="h6" fontWeight={600}>{t('formTitle')}</Typography>
                </Box>
              </Stack>

              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label={t('emailLabel')}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <EmailRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...register('email')}
                  />
                  <TextField
                    fullWidth
                    label={t('passwordLabel')}
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <LockRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...register('password')}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={18} /> : undefined}
                  >
                    {isLoading ? t('loading') : t('submit')}
                  </Button>
                </Stack>
              </form>

              <Typography variant="caption" display="block" textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
                {t('adminOnly')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
