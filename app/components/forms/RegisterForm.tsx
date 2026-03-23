'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';

import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';

export default function RegisterForm() {
  const t = useTranslations('auth.registerForm');
  const { register: registerUser, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  const registerSchema = z.object({
    username: z
      .string()
      .min(1, t('errors.usernameRequired'))
      .min(3, t('errors.usernameMin'))
      .max(30, t('errors.usernameMax'))
      .regex(/^[a-zA-Z0-9_]+$/, t('errors.usernamePattern')),
    email: z
      .string()
      .min(1, t('errors.emailRequired'))
      .email(t('errors.emailInvalid')),
    password: z
      .string()
      .min(1, t('errors.passwordRequired'))
      .min(8, t('errors.passwordMin'))
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('errors.passwordPattern')),
    confirmPassword: z.string().min(1, t('errors.confirmRequired')),
    full_name: z.string().optional(),
    bio: z.string().max(500, t('errors.bioMax')).optional(),
    location: z.string().max(100, t('errors.locationMax')).optional(),
    website: z.string().url(t('errors.websiteInvalid')).optional().or(z.literal('')),
    company: z.string().max(100, t('errors.companyMax')).optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('errors.passwordMatch'),
    path: ['confirmPassword'],
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      bio: '',
      location: '',
      website: '',
      company: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSuccess(false);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const cleanData = Object.fromEntries(
        Object.entries(registerData).filter(([, value]) => value !== '')
      );
      await registerUser(cleanData as typeof registerData);
      setSuccess(true);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError(t('errors.serverError'));
      }
    }
  };

  const endAdornment = (icon: React.ReactNode) => (
    <InputAdornment position="end">{icon}</InputAdornment>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {success && <Alert severity="success">{t('success')}</Alert>}
        {serverError && <Alert severity="error">{serverError}</Alert>}

        {/* Required fields */}
        <Typography variant="overline" color="text.secondary">{t('requiredInfo')}</Typography>

        <TextField
          fullWidth
          label={t('fields.username')}
          placeholder={t('placeholders.username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          slotProps={{ input: { endAdornment: endAdornment(<PersonRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />) } }}
          {...register('username')}
        />
        <TextField
          fullWidth
          label={t('fields.email')}
          type="email"
          placeholder={t('placeholders.email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          slotProps={{ input: { endAdornment: endAdornment(<EmailRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />) } }}
          {...register('email')}
        />
        <TextField
          fullWidth
          label={t('fields.password')}
          type="password"
          placeholder={t('placeholders.password')}
          error={!!errors.password}
          helperText={errors.password?.message || t('passwordHelper')}
          slotProps={{ input: { endAdornment: endAdornment(<LockRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />) } }}
          {...register('password')}
        />
        <TextField
          fullWidth
          label={t('fields.confirmPassword')}
          type="password"
          placeholder={t('placeholders.confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          slotProps={{ input: { endAdornment: endAdornment(<LockRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />) } }}
          {...register('confirmPassword')}
        />

        {/* Toggle optional fields */}
        <Button
          type="button"
          variant="text"
          size="small"
          onClick={() => setShowOptional(!showOptional)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {showOptional ? t('toggleHide') : t('toggleShow')}
        </Button>

        {/* Optional fields */}
        <Collapse in={showOptional}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2.5}>
              <Typography variant="overline" color="text.secondary">{t('optionalInfo')}</Typography>
              <TextField
                fullWidth
                size="small"
                label={t('fields.fullName')}
                placeholder={t('placeholders.fullName')}
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                slotProps={{ input: { endAdornment: endAdornment(<PersonRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />) } }}
                {...register('full_name')}
              />
              <TextField
                fullWidth
                size="small"
                label={t('fields.bio')}
                placeholder={t('placeholders.bio')}
                error={!!errors.bio}
                helperText={errors.bio?.message}
                slotProps={{ input: { endAdornment: endAdornment(<DescriptionRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />) } }}
                {...register('bio')}
              />
              <TextField
                fullWidth
                size="small"
                label={t('fields.location')}
                placeholder={t('placeholders.location')}
                error={!!errors.location}
                helperText={errors.location?.message}
                slotProps={{ input: { endAdornment: endAdornment(<PlaceRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />) } }}
                {...register('location')}
              />
              <TextField
                fullWidth
                size="small"
                label={t('fields.website')}
                placeholder={t('placeholders.website')}
                error={!!errors.website}
                helperText={errors.website?.message}
                slotProps={{ input: { endAdornment: endAdornment(<LanguageRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />) } }}
                {...register('website')}
              />
              <TextField
                fullWidth
                size="small"
                label={t('fields.company')}
                placeholder={t('placeholders.company')}
                error={!!errors.company}
                helperText={errors.company?.message}
                slotProps={{ input: { endAdornment: endAdornment(<BusinessRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />) } }}
                {...register('company')}
              />
            </Stack>
          </Paper>
        </Collapse>

        {/* Submit */}
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
  );
}
