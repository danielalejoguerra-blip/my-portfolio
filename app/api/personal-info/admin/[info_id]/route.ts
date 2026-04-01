// ============================================
// Personal Info Admin by ID - GET single (admin)
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RouteParams = {
  params: Promise<{ info_id: string }>;
};

/**
 * GET /api/personal-info/admin/:info_id — Obtener cualquier registro por ID (admin)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { info_id } = await params;

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(
      `${API_URL}/personal-info/admin/${info_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader,
        },
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Personal info admin GET by ID error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
