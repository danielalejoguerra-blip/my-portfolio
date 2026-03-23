// ============================================
// Login API Route - Proxy al backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

export async function POST(request: NextRequest) {
  try {
    // Verificar que hay body
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { message: 'Content-Type debe ser application/json' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Body JSON inválido o vacío' },
        { status: 400 }
      );
    }
    
    // Validar campos requeridos
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: 'Email y password son requeridos' },
        { status: 400 }
      );
    }

    console.log('Login request to:', `${API_URL}/auth/login`);
    console.log('Body:', { email: body.email, password: '***' });

    // Hacer request al backend
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();

    // Si hay error del backend, retornarlo
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Crear response con los datos
    const nextResponse = NextResponse.json(data, { status: 200 });

    // Copiar las cookies del backend y re-setearlas con configuración compatible
    const cookies = response.headers.getSetCookie?.() || [];
    
    // Parsear y setear cada cookie manualmente para asegurar compatibilidad
    cookies.forEach((cookieString) => {
      const [nameValue, ...attributes] = cookieString.split(';');
      const [name, value] = nameValue.split('=');
      
      if (name && value) {
        const cookieName = name.trim();
        const cookieValue = value.trim();
        
        // Determinar si es httpOnly basado en el nombre
        const isHttpOnly = cookieName === 'access_token' || cookieName === 'refresh_token';
        
        // Setear cookie con configuración compatible con localhost
        nextResponse.cookies.set(cookieName, cookieValue, {
          httpOnly: isHttpOnly,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Cambiar a 'lax' para localhost
          path: '/',
          maxAge: cookieName === 'access_token' ? 600 : 1209600, // 10min o 14 días
        });
      }
    });

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
