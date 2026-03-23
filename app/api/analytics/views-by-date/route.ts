// ============================================
// Analytics Views By Date - GET views-by-date
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';
    const granularity = searchParams.get('granularity') || 'day';

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(
      `${API_URL}/analytics/views-by-date?days=${days}&granularity=${granularity}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader }, cache: 'no-store' }
    );

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Analytics views-by-date GET error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
