import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.docuhub.me';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    
    console.log('🚀 Proxying request to get pending students:', { page, size });
    
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
    
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/user-promote/pending-students?page=${page}&size=${size}`, 
      {
        method: 'GET',
        headers,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      console.error('❌ External API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch pending students', 
          status: response.status,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched pending students:', data.totalElements || 0);
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
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