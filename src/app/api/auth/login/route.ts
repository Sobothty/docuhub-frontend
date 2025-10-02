import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.docuhub.me';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Proxying login request to backend');
    
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('❌ Login failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Login failed', 
          status: response.status,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Login successful');
    
    // Create response with tokens
    const loginResponse = NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

    // Set HTTP-only cookies for tokens if they exist
    if (data.access_token) {
      loginResponse.cookies.set('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.expires_in || 3600, // Default to 1 hour
        path: '/',
      });
    }

    if (data.refresh_token) {
      loginResponse.cookies.set('refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 24 hours
        path: '/',
      });
    }

    return loginResponse;
    
  } catch (error) {
    console.error('❌ API Route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
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