// ============================================
// Analytics Track - POST track event
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ message: 'Content-Type debe ser application/json' }, { status: 400 });
    }

    let body;
    try { body = await request.json(); } catch {
      return NextResponse.json({ message: 'Body JSON inválido o vacío' }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Analytics track POST error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
