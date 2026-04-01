// ============================================
// Courses Public [slug] - GET by slug
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || '';
    const langParam = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    const response = await fetch(`${API_URL}/courses/${slug}${langParam}`, {
      method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Courses GET by slug error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
