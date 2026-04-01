// ============================================
// Password Reset Request - Proxy al backend
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

    if (!body.email) {
      return NextResponse.json(
        { detail: 'Email es requerido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { detail: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
