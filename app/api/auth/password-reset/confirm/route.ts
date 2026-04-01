// ============================================
// Password Reset Confirm - Proxy al backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { detail: 'Content-Type debe ser application/json' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { detail: 'Body JSON inválido o vacío' },
        { status: 400 }
      );
    }

    if (!body.email || !body.code || !body.new_password) {
      return NextResponse.json(
        { detail: 'Email, código y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/auth/password-reset/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        code: body.code,
        new_password: body.new_password,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      { detail: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
