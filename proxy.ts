// ============================================
// Proxy - Autenticación + i18n (Next.js 16+)
// ============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/app/i18n/config';

// Crear middleware de internacionalización
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/admin'];

// Rutas de autenticación (solo para usuarios NO autenticados)
const authRoutes = ['/login'];

// Rutas que requieren autenticación para registro
const registerRoutes = ['/register'];

// Rutas que NO deben pasar por i18n middleware
const nonI18nRoutes = ['/login', '/register', '/dashboard', '/admin', '/api'];

// Nueva API de Next.js 16: usar "proxy" en lugar de "middleware"
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorar rutas de API y archivos estáticos
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Verificar si el usuario está autenticado (tiene access_token)
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si es una ruta de auth (login)
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si es la ruta de registro
  const isRegisterRoute = registerRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si es ruta protegida y no está autenticado, redirigir a login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es ruta de registro y no está autenticado, redirigir a login
  if (isRegisterRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('message', 'Debes iniciar sesión para registrar usuarios');
    return NextResponse.redirect(loginUrl);
  }

  // Si es ruta de auth (login) y ya está autenticado, redirigir a dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si es una ruta que no necesita i18n, continuar sin aplicar el middleware
  const isNonI18nRoute = nonI18nRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isNonI18nRoute) {
    return NextResponse.next();
  }

  // Aplicar middleware de internacionalización solo para rutas públicas (portfolio)
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - _next files
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
