'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Shield, Mail, Lock, Loader2, AlertCircle, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { authService } from '@/services';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Schema de validación con traducciones
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
      const result = await authService.login(data);
      console.log('Login exitoso:', result);
      // Usar window.location para forzar recarga completa con cookies
      window.location.href = '/dashboard/welcome';
    } catch (err) {
      console.error('Error de login:', err);
      setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-5xl grid gap-6 md:grid-cols-2">
          <Card variant="glass" className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--muted-foreground)]">
                {t('adminBadge')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {t('title')}
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg mb-8">
              {t('subtitle')}
            </p>

            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-medium">{t('feature1Title')}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('feature1Desc')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="font-medium">{t('feature2Title')}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('feature2Desc')}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="glass" className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">{t('adminPanel')}</p>
                <h2 className="text-xl font-semibold">{t('formTitle')}</h2>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-4 py-3 pr-12 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    {...register('email')}
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    className="w-full px-4 py-3 pr-12 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    {...register('password')}
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  t('submit')
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
              {t('adminOnly')}
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
