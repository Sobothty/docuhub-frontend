import { NextRequest, NextResponse } from 'next/server';
import { getApiConfig, API_ENDPOINTS } from '@/config/api.config';

export async function GET(req: NextRequest) {
  const { baseUrl } = getApiConfig();

  try {
    const { search } = new URL(req.url);
    const upstreamUrl = `${baseUrl}${API_ENDPOINTS.PAPERS.PUBLISHED}${search || ''}`;

    const resp = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Include cookies if your upstream requires auth cookies
      // credentials: 'include',
      cache: 'no-store',
    });

    const contentType = resp.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!resp.ok) {
      const body = isJson ? await resp.json().catch(() => ({ error: 'Upstream JSON parse error' })) : await resp.text();
      return NextResponse.json(
        { message: 'Upstream error', status: resp.status, body },
        { status: resp.status }
      );
    }

    if (isJson) {
      const data = await resp.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const text = await resp.text();
      return new NextResponse(text, { status: 200, headers: { 'content-type': contentType } });
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { message: 'Proxy error', error: (error as Error)?.message || String(error) },
      { status: 500 }
    );
  }
}
