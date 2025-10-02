import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    const accessToken = (session as any)?.accessToken as string | undefined;

    if (!session || !accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated', details: 'Missing session or access token' },
        { status: 401 }
      );
    }

    // Return a local auth summary to avoid backend 5xx issues
    const user = (session as any)?.user;
    return NextResponse.json(
      {
        authenticated: true,
        accessTokenPresent: true,
        user,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error', details: err?.message || String(err) }, { status: 500 });
  }
}
