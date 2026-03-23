'use client';

// ============================================
// LoginForm - Formulario de inicio de sesión
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks';
import FormInput from './FormInput';
import Button from '@/app/components/ui/Button';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

// Schema de validación
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  // Mensaje de redirección si existe
  const message = searchParams.get('message');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    
    try {
      await login(data);
      router.push(callbackUrl);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mensaje de información */}
      {message && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-400">{message}</p>
        </div>
      )}

      {/* Error del servidor */}
      {serverError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-400">{serverError}</p>
        </div>
      )}

      {/* Campo Email */}
      <div className="relative">
        <FormInput
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Mail className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
      </div>

      {/* Campo Password */}
      <div className="relative">
        <FormInput
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Lock className="absolute right-4 top-10 w-5 h-5 text-[var(--muted-foreground)]" />
      </div>

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
            Iniciando sesión...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </Button>
    </form>
  );
}
