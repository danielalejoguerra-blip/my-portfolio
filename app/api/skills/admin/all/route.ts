// ============================================
// Skills Admin List - GET all
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.REACT_API_HOST;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    const includeHidden = searchParams.get('include_hidden') || 'true';
    const includeDeleted = searchParams.get('include_deleted') || 'false';

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(
      `${API_URL}/skills/admin/all?limit=${limit}&offset=${offset}&include_hidden=${includeHidden}&include_deleted=${includeDeleted}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader }, cache: 'no-store' }
    );

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Skills admin GET all error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
