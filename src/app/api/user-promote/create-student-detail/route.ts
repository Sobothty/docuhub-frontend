import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.docuhub.me';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Proxying student detail creation request');
    
    const body = await request.json();
    
    // Get session/auth headers from the request
    const authCookie = request.cookies.get('Authorization')?.value || 
                      request.cookies.get('JSESSIONID')?.value;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (authCookie) {
      headers['Cookie'] = `Authorization=${authCookie}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/user-promote/create-student-detail`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('❌ External API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to create student detail', 
          status: response.status,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.text(); // Backend returns just a string message
    console.log('✅ Successfully created student detail');
    
    return NextResponse.json(
      { message: data },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
    
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