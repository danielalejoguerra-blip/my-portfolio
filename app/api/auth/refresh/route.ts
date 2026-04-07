// ============================================
// Refresh API Route - Proxy al backend
// Renueva el access_token usando el refresh_token
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    // Obtener refresh token de las cookies
    const refreshToken = request.cookies.get('refresh_token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No hay token de refresh disponible' },
        { status: 401 }
      );
    }

    // Obtener CSRF token del header
    const csrfToken = request.headers.get('X-CSRF-Token');
    
    if (!csrfToken) {
      return NextResponse.json(
        { message: 'CSRF token requerido' },
        { status: 403 }
      );
    }

    // Hacer request al backend
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refresh_token=${refreshToken}`,
        'X-CSRF-Token': csrfToken,
      },
    });

    const data = await response.json();

    // Si hay error del backend, retornarlo
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Crear response con los datos
    const nextResponse = NextResponse.json(data, { status: 200 });

    // Copiar las nuevas cookies del backend usando getSetCookie() para obtener todas
    const isProduction = process.env.NODE_ENV === 'production';
    const setCookies = response.headers.getSetCookie?.() || [];
    setCookies.forEach((cookieString) => {
      const [nameValue] = cookieString.split(';');
      const firstEq = nameValue.indexOf('=');
      if (firstEq === -1) return;
      const cookieName = nameValue.substring(0, firstEq).trim();
      const cookieValue = nameValue.substring(firstEq + 1).trim();

      if (cookieName && cookieValue) {
        const isHttpOnly = cookieName === 'access_token' || cookieName === 'refresh_token';
        nextResponse.cookies.set(cookieName, cookieValue, {
          httpOnly: isHttpOnly,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
          path: '/',
          domain: isProduction ? '.danielwar.tech' : undefined,
          maxAge: cookieName === 'access_token' ? 600 : 1209600,
        });
      }
    });

    return nextResponse;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
