// ============================================
// Analytics Content Views - GET content-views/{content_type}/{content_id}
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RouteParams = { params: Promise<{ content_type: string; content_id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { content_type, content_id } = await params;
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(
      `${API_URL}/analytics/content-views/${content_type}/${content_id}?days=${days}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader }, cache: 'no-store' }
    );

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Analytics content-views GET error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
