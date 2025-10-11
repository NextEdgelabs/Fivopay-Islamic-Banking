import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple authentication check
    // In production, you would validate against a database
    if (email === 'admin@fivopay.com' && password === 'password') {
      const user = {
        id: '1',
        email: 'admin@fivopay.com',
        name: 'Admin',
        role: 'admin',
      };

      // Create response with user data
      const response = NextResponse.json({
        success: true,
        user,
      });

      // Set HTTP-only cookie for session
      response.cookies.set('fivopay-session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
