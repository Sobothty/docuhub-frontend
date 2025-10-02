import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock session response - replace with actual auth logic
    const mockSession = {
      user: null,
      isAuthenticated: false,
      expires: null
    };

    return NextResponse.json(mockSession, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ Session API error:', error);
    return NextResponse.json(
      { error: 'Failed to get session', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
