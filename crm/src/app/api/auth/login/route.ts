import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUsername } from '../../../../lib/db';
import { verifyPassword, signToken, AUTH_COOKIE_NAME, getAuthCookieConfig } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    // 1. Admin Login (LivingLegend & Staff)
    const admin = await getAdminByUsername(identifier);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const token = await signToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    }, '4h');

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieConfig(12 * 60 * 60));

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
