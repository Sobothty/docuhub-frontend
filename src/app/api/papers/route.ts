import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.docuhub.me';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    
    console.log('🚀 Proxying request to external API:', `${API_BASE_URL}/api/v1/papers/published`);
    
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/papers/published?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        next: { revalidate: 60 },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('❌ External API error:', response.status, response.statusText);
        // Return mock data for development
        return NextResponse.json({
          papers: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: parseInt(size),
            number: parseInt(page)
          },
          message: 'External API unavailable, showing empty results'
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      }

      const data = await response.json();
      console.log('✅ Successfully fetched papers:', data.papers?.content?.length || 0, 'papers');
      
      return NextResponse.json(data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
      
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      // Handle specific network errors
      const error = fetchError as Error & { name?: string; code?: string };
      if (error.name === 'AbortError') {
        console.error('❌ Request timeout');
      } else if (error.code === 'ENOTFOUND') {
        console.error('❌ DNS resolution failed for:', API_BASE_URL);
      } else {
        console.error('❌ Network error:', error.message);
      }
      
      // Return mock data instead of failing
      return NextResponse.json({
        papers: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: parseInt(size),
          number: parseInt(page)
        },
        message: 'Network error, showing empty results',
        error: error.message || 'Unknown error'
      }, {
        status: 200, // Return 200 with empty data instead of 500
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
      message: 'Server error, showing empty results',
      error: (error as Error).message
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

// Handle OPTIONS requests for CORS preflight
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