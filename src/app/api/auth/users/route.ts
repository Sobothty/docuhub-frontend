import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const externalApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/users`;
    
    console.log('🚀 Proxying request to external API:', externalApiUrl);

    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error('❌ External API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch users', status: response.status },
        { status: response.status }
      );
    }

    const users = await response.json();
    console.log('✅ Successfully fetched users:', users.length, 'users');

    return NextResponse.json(users, {
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