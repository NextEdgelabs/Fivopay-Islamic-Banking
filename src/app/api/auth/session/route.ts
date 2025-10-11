import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('fivopay-session');

    if (sessionCookie?.value) {
      try {
        const user = JSON.parse(sessionCookie.value);
        return NextResponse.json({
          authenticated: true,
          user,
        });
      } catch (parseError) {
        console.error('Session parse error:', parseError);
        return NextResponse.json({
          authenticated: false,
          user: null,
        });
      }
    }

    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}
