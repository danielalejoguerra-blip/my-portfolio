// ============================================
// Experience Restore - POST restore
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RouteParams = {
  params: Promise<{ experience_id: string }>;
};

/**
 * POST /api/experience/admin/:experience_id/restore — Restaurar experiencia soft-deleted
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { experience_id } = await params;

    const cookieHeader = request.headers.get('cookie') || '';
    const csrfToken = request.headers.get('X-CSRF-Token') || '';

    const response = await fetch(
      `${API_URL}/experience/${experience_id}/restore`,
      {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
          'X-CSRF-Token': csrfToken,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Experience restore error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
