// ============================================
// Analytics Pageview - POST pageview
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

export async function POST(request: NextRequest) {
  try {
    if (!API_URL) {
      return NextResponse.json({ message: 'REACT_API_HOST no está configurado' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('page_slug');
    if (!pageSlug) {
      return NextResponse.json({ message: 'page_slug es requerido' }, { status: 422 });
    }

    const qs = new URLSearchParams({ page_slug: pageSlug });
    const contentType = searchParams.get('content_type');
    const contentId = searchParams.get('content_id');
    if (contentType) qs.set('content_type', contentType);
    if (contentId) qs.set('content_id', contentId);

    const cookie = request.headers.get('cookie');

    const response = await fetch(`${API_URL}/analytics/pageview?${qs.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    const contentTypeHeader = response.headers.get('content-type') || '';
    const isJson = contentTypeHeader.includes('application/json');
    const data = isJson ? await response.json() : { message: await response.text() };

    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Analytics pageview POST error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
