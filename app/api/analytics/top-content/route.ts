// ============================================
// Analytics Top Content - GET top-content
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';
    const limit = searchParams.get('limit') || '10';
    const contentType = searchParams.get('content_type');

    const qs = new URLSearchParams({ days, limit });
    if (contentType) qs.set('content_type', contentType);

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${API_URL}/analytics/top-content?${qs.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Analytics top-content GET error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
