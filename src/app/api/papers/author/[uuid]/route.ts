import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.docuhub.me';

export async function PUT(request: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const { uuid } = params;
    const body = await request.json();
    const cookieHeader = request.headers.get('cookie') || '';
    
    console.log('🚀 Updating paper via external API:', uuid);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/author/${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error:', response.status, errorText);
      return NextResponse.json(
        { 
          message: 'Failed to update paper',
          error: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully updated paper');
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('❌ API Route error:', error);
    return NextResponse.json({
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

export async function DELETE(request: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const { uuid } = params;
    const cookieHeader = request.headers.get('cookie') || '';
    
    console.log('🚀 Deleting paper via external API:', uuid);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/author/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error:', response.status, errorText);
      return NextResponse.json(
        { 
          message: 'Failed to delete paper',
          error: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully deleted paper');
    
    return NextResponse.json(data, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('❌ API Route error:', error);
    return NextResponse.json({
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