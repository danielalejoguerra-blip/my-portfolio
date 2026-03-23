'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { authService } from '@/services';
import { AxiosError } from 'axios';
import type { Theme } from '@mui/material/styles';

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
import IconButton from '@mui/material/IconButton';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Fade from '@mui/material/Fade';
import Link from '@mui/material/Link';

import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import NextLink from 'next/link';

export default function PasswordResetPage() {
  const t = useTranslations('auth.passwordReset');

  // Step 0: email input, Step 1: code + new password
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // --- Step 1: Email form ---
  const emailSchema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
  });
  type EmailFormData = z.infer<typeof emailSchema>;

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmitEmail = async (data: EmailFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset({ email: data.email });
      setEmail(data.email);
      setSuccess(t('codeSent'));
      setActiveStep(1);
    } catch {
      setError(t('errorServer'));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Code + new password form ---
  const confirmSchema = z.object({
    code: z
      .string()
      .min(1, t('codeRequired'))
      .regex(/^\d{6}$/, t('codePattern')),
    new_password: z
      .string()
      .min(1, t('newPasswordRequired'))
      .min(8, t('newPasswordMin'))
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('newPasswordPattern')),
    confirm_password: z.string().min(1, t('confirmPasswordRequired')),
  }).refine((data) => data.new_password === data.confirm_password, {
    message: t('passwordMatch'),
    path: ['confirm_password'],
  });
  type ConfirmFormData = z.infer<typeof confirmSchema>;

  const confirmForm = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
  });

  // --- OTP input handlers ---
  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    const code = newValues.join('');
    confirmForm.setValue('code', code, { shouldValidate: code.length === 6 });

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otpValues, confirmForm]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otpValues]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newValues = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setOtpValues(newValues);
    confirmForm.setValue('code', newValues.join(''), { shouldValidate: newValues.join('').length === 6 });
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  }, [confirmForm]);

  const onSubmitConfirm = async (data: ConfirmFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await authService.confirmPasswordReset({
        email,
        code: data.code,
        new_password: data.new_password,
      });
      setSuccess(t('success'));
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 410) {
          setError(t('errorExpired'));
        } else if (err.response?.status === 400) {
          setError(t('errorInvalid'));
        } else {
          setError(t('errorServer'));
        }
      } else {
        setError(t('errorServer'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setOtpValues(Array(6).fill(''));
    confirmForm.setValue('code', '');
    try {
      await authService.requestPasswordReset({ email });
      setSuccess(t('codeSent'));
    } catch {
      setError(t('errorServer'));
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [t('stepEmail'), t('stepCode')];

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
        {/* Left: info panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 4, md: 5 } }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(99,102,241,0.1)' }}>
                  <LockResetRoundedIcon sx={{ color: 'primary.main' }} />
                </Avatar>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  {t('badge')}
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{t('title')}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>{t('subtitle')}</Typography>

              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(99,102,241,0.1)' }}>
                    <ShieldRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">{t('feature1Title')}</Typography>
                    <Typography variant="body2" color="text.secondary">{t('feature1Desc')}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(139,92,246,0.1)' }}>
                    <TimerRoundedIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">{t('feature2Title')}</Typography>
                    <Typography variant="body2" color="text.secondary">{t('feature2Desc')}</Typography>
                  </Box>
                </Stack>
              </Stack>

              <Box sx={{ mt: 5 }}>
                <Link
                  component={NextLink}
                  href="/login"
                  underline="hover"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
                  {t('backToLogin')}
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 4, md: 5 } }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(99,102,241,0.1)' }}>
                  <LockResetRoundedIcon sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('badge')}</Typography>
                  <Typography variant="h6" fontWeight={600}>{t('title')}</Typography>
                </Box>
              </Stack>

              {/* Stepper */}
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Alerts */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  severity="success"
                  sx={{ mb: 3 }}
                  icon={<CheckCircleRoundedIcon />}
                  onClose={() => setSuccess(null)}
                >
                  {success}
                </Alert>
              )}

              {/* Step 1: Email */}
              {activeStep === 0 && (
                <Fade in>
                  <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label={t('emailLabel')}
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        error={!!emailForm.formState.errors.email}
                        helperText={emailForm.formState.errors.email?.message}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <EmailRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                        {...emailForm.register('email')}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={18} /> : undefined}
                      >
                        {isLoading ? t('sendingCode') : t('sendCode')}
                      </Button>
                    </Stack>
                  </form>
                </Fade>
              )}

              {/* Step 2: Code + New Password */}
              {activeStep === 1 && (
                <Fade in>
                  <form onSubmit={confirmForm.handleSubmit(onSubmitConfirm)}>
                    <Stack spacing={3}>
                      {/* OTP Code Input */}
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 1.5, color: 'text.secondary' }}>
                          {t('codeLabel')}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }} onPaste={handleOtpPaste}>
                          {Array.from({ length: 6 }).map((_, i) => (
                            <Box
                              key={i}
                              component="input"
                              ref={(el: HTMLInputElement | null) => { otpRefs.current[i] = el; }}
                              value={otpValues[i]}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(i, e.target.value)}
                              onKeyDown={(e: React.KeyboardEvent) => handleOtpKeyDown(i, e)}
                              inputMode="numeric"
                              autoComplete={i === 0 ? 'one-time-code' : 'off'}
                              maxLength={1}
                              sx={{
                                width: 48,
                                height: 56,
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: confirmForm.formState.errors.code
                                  ? 'error.main'
                                  : otpValues[i]
                                    ? 'primary.main'
                                    : 'divider',
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                textAlign: 'center',
                                outline: 'none',
                                caretColor: 'primary.main',
                                transition: 'all 0.2s ease',
                                '&:focus': {
                                  borderColor: 'primary.main',
                                  boxShadow: (theme: Theme) => `0 0 0 3px ${theme.palette.primary.main}25`,
                                },
                                '&:hover:not(:focus)': {
                                  borderColor: 'text.secondary',
                                },
                              }}
                            />
                          ))}
                        </Stack>
                        {confirmForm.formState.errors.code && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                            {confirmForm.formState.errors.code.message}
                          </Typography>
                        )}
                        {/* Hidden input for react-hook-form */}
                        <input type="hidden" {...confirmForm.register('code')} />
                      </Box>

                      <TextField
                        fullWidth
                        label={t('newPasswordLabel')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('newPasswordPlaceholder')}
                        error={!!confirmForm.formState.errors.new_password}
                        helperText={confirmForm.formState.errors.new_password?.message}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                                >
                                  {showPassword
                                    ? <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                                    : <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                                  }
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                        {...confirmForm.register('new_password')}
                      />

                      <TextField
                        fullWidth
                        label={t('confirmPasswordLabel')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('confirmPasswordPlaceholder')}
                        error={!!confirmForm.formState.errors.confirm_password}
                        helperText={confirmForm.formState.errors.confirm_password?.message}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                  size="small"
                                  aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
                                >
                                  {showConfirmPassword
                                    ? <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                                    : <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                                  }
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                        {...confirmForm.register('confirm_password')}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={18} /> : undefined}
                      >
                        {isLoading ? t('resetting') : t('resetPassword')}
                      </Button>

                      <Button
                        variant="text"
                        size="small"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        sx={{ alignSelf: 'center' }}
                      >
                        {t('resendCode')}
                      </Button>
                    </Stack>
                  </form>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
