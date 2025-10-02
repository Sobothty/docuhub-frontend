import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '');
  const target = base ? `${base}/auth/keycloak/login` : 'https://api.docuhub.me/api/v1/auth/keycloak/login';
  return NextResponse.redirect(target, { status: 307 });
}
