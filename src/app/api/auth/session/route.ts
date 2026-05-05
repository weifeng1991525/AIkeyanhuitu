import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/auth/session - Get current user session
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null, success: true });
    }

    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
      success: true,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { user: null, success: false },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session - Logout (clear cookie)
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('medai-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
