// ============================================
// Register API Route - Proxy al backend
// Solo accesible para usuarios autenticados
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario esté autenticado
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Debes iniciar sesión para registrar nuevos usuarios' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { message: 'Username, email y password son requeridos' },
        { status: 400 }
      );
    }

    // Obtener CSRF token del header
    const csrfToken = request.headers.get('X-CSRF-Token');
    
    // Hacer request al backend con las cookies
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Si hay error del backend, retornarlo
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
