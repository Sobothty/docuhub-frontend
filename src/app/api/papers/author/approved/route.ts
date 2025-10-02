import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.docuhub.me';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const direction = searchParams.get('direction') || 'desc';
    
    console.log('🚀 Proxying author approved papers request to external API');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie') || '';
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/papers/author/approved?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': cookieHeader,
        },
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('❌ External API error:', response.status, response.statusText);
        return NextResponse.json(
          { 
            papers: {
              content: [],
              totalElements: 0,
              totalPages: 0,
              size: parseInt(size),
              number: parseInt(page)
            },
            message: 'Failed to fetch approved papers',
            error: response.statusText
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('✅ Successfully fetched author approved papers:', data.papers?.content?.length || 0, 'papers');
      
      return NextResponse.json(data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
      
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      const error = fetchError as Error & { name?: string; code?: string };
      console.error('❌ Network error:', error.message);
      
      return NextResponse.json({
        papers: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: parseInt(size),
          number: parseInt(page)
        },
        message: 'Network error, please try again',
        error: error.message || 'Unknown error'
      }, {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
  } catch (error) {
    console.error('❌ API Route error:', error);
    return NextResponse.json({
      papers: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0
      },
      message: 'Server error',
      error: (error as Error).message
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
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