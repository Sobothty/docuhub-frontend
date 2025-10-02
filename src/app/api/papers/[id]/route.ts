import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.docuhub.me';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🚀 Proxying request for paper ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('❌ External API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch paper', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched paper:', data.paper?.title || 'No title found');
    console.log('📋 Full API response:', JSON.stringify(data, null, 2));
    
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