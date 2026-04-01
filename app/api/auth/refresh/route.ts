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

    // Copiar las nuevas cookies del backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);
      cookies.forEach((cookie) => {
        nextResponse.headers.append('Set-Cookie', cookie.trim());
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
