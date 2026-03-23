// ============================================
// Education Restore - POST restore
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

type RouteParams = {
  params: Promise<{ education_id: string }>;
};

/**
 * POST /api/education/admin/:education_id/restore — Restaurar entrada soft-deleted
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { education_id } = await params;

    const cookieHeader = request.headers.get('cookie') || '';
    const csrfToken = request.headers.get('X-CSRF-Token') || '';

    const response = await fetch(
      `${API_URL}/education/${education_id}/restore`,
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
    console.error('Education restore error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
