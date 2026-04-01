// ============================================
// Analytics Events - GET events
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qs = new URLSearchParams();

    const days = searchParams.get('days') || '30';
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';
    qs.set('days', days);
    qs.set('limit', limit);
    qs.set('offset', offset);

    const eventType = searchParams.get('event_type');
    const contentType = searchParams.get('content_type');
    const contentId = searchParams.get('content_id');
    if (eventType) qs.set('event_type', eventType);
    if (contentType) qs.set('content_type', contentType);
    if (contentId) qs.set('content_id', contentId);

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${API_URL}/analytics/events?${qs.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Analytics events GET error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
