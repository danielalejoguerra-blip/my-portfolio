// ============================================
// Logout API Route - Proxy al backend
// Cierra la sesión y elimina las cookies
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    // Obtener access token de las cookies
    const accessToken = request.cookies.get('access_token')?.value;
    
    // Obtener CSRF token del header
    const csrfToken = request.headers.get('X-CSRF-Token');
    
    if (!csrfToken) {
      return NextResponse.json(
        { message: 'CSRF token requerido' },
        { status: 403 }
      );
    }

    // Hacer request al backend (aunque no haya token, intentar logout)
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Cookie': `access_token=${accessToken}` }),
        'X-CSRF-Token': csrfToken,
      },
    });

    await response.json();

    // Crear response
    const nextResponse = NextResponse.json(
      { message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );

    // Eliminar las cookies estableciendo fecha de expiración en el pasado
    nextResponse.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    nextResponse.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    nextResponse.cookies.set('csrf_token', '', {
      httpOnly: false, // CSRF token debe ser legible por JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    return nextResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
