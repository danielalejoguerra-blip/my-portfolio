'use client';

// ============================================
// RegisterForm - Formulario de registro
// Solo accesible para usuarios autenticados
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import FormInput from './FormInput';
import Button from '@/app/components/ui/Button';
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle, Building, MapPin, Globe, FileText } from 'lucide-react';

export default function RegisterForm() {
  const t = useTranslations('auth.registerForm');
  const { register: registerUser, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Schema de validación con traducciones
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
      // Remover confirmPassword antes de enviar
      const { confirmPassword, ...registerData } = data;
      
      // Limpiar campos opcionales vacíos
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mensaje de éxito */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-400">
            {t('success')}
          </p>
        </div>
      )}

      {/* Error del servidor */}
      {serverError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-400">{serverError}</p>
        </div>
      )}

      {/* Campos requeridos */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
          {t('requiredInfo')}
        </h3>

        {/* Username */}
        <div className="relative">
          <FormInput
            label={t('fields.username')}
            type="text"
            placeholder={t('placeholders.username')}
            error={errors.username?.message}
            {...register('username')}
          />
          <User className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
        </div>

        {/* Email */}
        <div className="relative">
          <FormInput
            label={t('fields.email')}
            type="email"
            placeholder={t('placeholders.email')}
            error={errors.email?.message}
            {...register('email')}
          />
          <Mail className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
        </div>

        {/* Password */}
        <div className="relative">
          <FormInput
            label={t('fields.password')}
            type="password"
            placeholder={t('placeholders.password')}
            error={errors.password?.message}
            helperText={t('passwordHelper')}
            {...register('password')}
          />
          <Lock className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FormInput
            label={t('fields.confirmPassword')}
            type="password"
            placeholder={t('placeholders.confirmPassword')}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Lock className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
        </div>
      </div>

      {/* Toggle campos opcionales */}
      <button
        type="button"
        onClick={() => setShowOptional(!showOptional)}
        className="text-sm text-[var(--primary)] hover:underline"
      >
        {showOptional ? t('toggleHide') : t('toggleShow')}
      </button>

      {/* Campos opcionales */}
      {showOptional && (
        <div className="space-y-4 p-4 rounded-lg bg-[var(--secondary)]/50 border border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            {t('optionalInfo')}
          </h3>

          {/* Full Name */}
          <div className="relative">
            <FormInput
              label={t('fields.fullName')}
              type="text"
              placeholder={t('placeholders.fullName')}
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <User className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
          </div>

          {/* Bio */}
          <div className="relative">
            <FormInput
              label={t('fields.bio')}
              type="text"
              placeholder={t('placeholders.bio')}
              error={errors.bio?.message}
              {...register('bio')}
            />
            <FileText className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
          </div>

          {/* Location */}
          <div className="relative">
            <FormInput
              label={t('fields.location')}
              type="text"
              placeholder={t('placeholders.location')}
              error={errors.location?.message}
              {...register('location')}
            />
            <MapPin className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
          </div>

          {/* Website */}
          <div className="relative">
            <FormInput
              label={t('fields.website')}
              type="url"
              placeholder={t('placeholders.website')}
              error={errors.website?.message}
              {...register('website')}
            />
            <Globe className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
          </div>

          {/* Company */}
          <div className="relative">
            <FormInput
              label={t('fields.company')}
              type="text"
              placeholder={t('placeholders.company')}
              error={errors.company?.message}
              {...register('company')}
            />
            <Building className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
          </div>
        </div>
      )}

      {/* Botón Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
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
  );
}
