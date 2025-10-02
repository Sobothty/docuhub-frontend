import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const externalApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/${id}`;
    
    console.log(' Proxying request for user ID:', id);

    // Try multiple sources for the access token: Authorization header or cookie set by our login route
    const incomingAuth = request.headers.get('authorization');
    const cookieToken = request.cookies.get('access_token')?.value;
    const bearer = incomingAuth || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(bearer ? { Authorization: bearer } : {}),
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error('❌ External API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch user', status: response.status },
        { status: response.status }
      );
    }

    const user = await response.json();
    console.log('✅ Successfully fetched user:', user.fullName || 'Unknown');

    return NextResponse.json(user, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('❌ API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}