import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const session = await getServerSession(authOptions as any);
    const accessToken = (session as any)?.accessToken as string | undefined;

    const apiBase = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const url = `${apiBase}/users/${encodeURIComponent(params.uuid)}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json(
        { error: 'Failed to fetch user', status: res.status, details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error', details: err?.message }, { status: 500 });
  }
}
