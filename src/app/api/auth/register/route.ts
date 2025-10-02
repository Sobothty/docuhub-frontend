import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://api.docuhub.me/api/v1';

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  fullName: string;
  userType?: 'student' | 'mentor' | 'user';
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    // Normalize incoming payload: accept both camelCase and lowercase keys
    const email: string | undefined = raw.email;
    const password: string | undefined = raw.password;
    const firstName: string | undefined = raw.firstName ?? raw.firstname;
    const lastName: string | undefined = raw.lastName ?? raw.lastname;
    const userName: string | undefined = raw.userName ?? raw.username;
    const confirmedPassword: string | undefined = raw.confirmedPassword ?? raw.confirmPassword ?? raw.confirm_password;
    const userType: 'student' | 'mentor' | 'user' | undefined = raw.userType;
    const fullName: string | undefined = raw.fullName ?? (
      firstName && lastName ? `${firstName} ${lastName}` : undefined
    );

    // Validate required fields and confirmation password
    const missing: string[] = [];
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    if (!firstName) missing.push('firstName');
    if (!lastName) missing.push('lastName');
    if (!userName) missing.push('userName');
    if (!fullName) missing.push('fullName');
    if (missing.length) {
      return NextResponse.json(
        { error: 'Missing required fields', details: missing },
        { status: 400 }
      );
    }

    if (typeof confirmedPassword === 'string' && confirmedPassword !== password) {
      return NextResponse.json(
        { error: 'Passwords do not match', details: ['password', 'confirmedPassword'] },
        { status: 400 }
      );
    }

    // At this point TS still sees possible undefined; narrow to definite strings
    const reqEmail: string = email!;
    const reqPassword: string = password!;
    const reqFirstName: string = firstName!;
    const reqLastName: string = lastName!;
    const reqUserName: string = userName!;
    const reqFullName: string = fullName!;

    // Build normalized body with definite strings
    const body: RegisterRequest = {
      email: reqEmail,
      password: reqPassword,
      firstName: reqFirstName,
      lastName: reqLastName,
      userName: reqUserName,
      fullName: reqFullName,
      userType,
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reqEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation
    if (reqPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    console.log('🚀 Attempting user registration:', { email: reqEmail, userName: reqUserName, fullName: reqFullName });

    // Add timeout for external API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: reqUserName,
          email: reqEmail,
          firstname: reqFirstName,
          lastname: reqLastName,
          password: reqPassword,
          confirmedPassword: confirmedPassword || reqPassword,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorText = '';
        let parsed: unknown = null;
        try {
          errorText = await response.text();
          try { parsed = JSON.parse(errorText); } catch {/* not json */}
        } catch {/* ignore */}
        console.error('❌ Registration API error:', response.status, parsed || errorText);

        const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
        const message = isObj(parsed) && typeof parsed.message === 'string'
          ? parsed.message
          : isObj(parsed) && typeof parsed.error === 'string'
            ? parsed.error
            : errorText || 'Registration failed';
        const details = isObj(parsed) && typeof parsed.details === 'string'
          ? parsed.details
          : `HTTP ${response.status}`;
        return NextResponse.json(
          { error: message, details },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('✅ Registration successful for:', email);

      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        user: data.user,
        token: data.token
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      const error = fetchError as Error & { name?: string; code?: string };
      
      if (error.name === 'AbortError') {
        console.error('❌ Registration request timeout');
        return NextResponse.json(
          { error: 'Registration request timed out. Please try again.' },
          { status: 408 }
        );
      } else if (error.code === 'ENOTFOUND') {
        console.error('❌ DNS resolution failed for registration API');
        return NextResponse.json(
          { error: 'Registration service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      } else {
        console.error('❌ Registration network error:', error.message);
        return NextResponse.json(
          { error: 'Network error during registration. Please check your connection and try again.' },
          { status: 503 }
        );
      }
    }

  } catch (error) {
    console.error('❌ Registration API route error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during registration',
        details: (error as Error).message 
      },
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
