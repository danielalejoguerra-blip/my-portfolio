// ============================================
// Projects Admin [project_id] - GET / PUT / DELETE
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RouteParams = {
  params: Promise<{ project_id: string }>;
};

/**
 * GET /api/projects/admin/:project_id — Obtener cualquier proyecto por ID (admin)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { project_id } = await params;

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(
      `${API_URL}/projects/admin/${project_id}`,
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
    console.error('Projects admin GET by ID error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/admin/:project_id — Actualizar proyecto (auth + CSRF)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { project_id } = await params;

    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { message: 'Content-Type debe ser application/json' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Body JSON inválido o vacío' },
        { status: 400 }
      );
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const csrfToken = request.headers.get('X-CSRF-Token') || '';

    const response = await fetch(
      `${API_URL}/projects/${project_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader,
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Projects admin PUT error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/admin/:project_id — Eliminar proyecto (auth + CSRF)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { project_id } = await params;
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get('hard') || 'false';

    const cookieHeader = request.headers.get('cookie') || '';
    const csrfToken = request.headers.get('X-CSRF-Token') || '';

    const response = await fetch(
      `${API_URL}/projects/${project_id}?hard=${hard}`,
      {
        method: 'DELETE',
        headers: {
          'Cookie': cookieHeader,
          'X-CSRF-Token': csrfToken,
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Projects admin DELETE error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
