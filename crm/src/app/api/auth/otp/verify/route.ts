import { NextRequest, NextResponse } from 'next/server';
import { verifyCustomerOtp } from '../../../../../lib/db';
import { signToken, AUTH_COOKIE_NAME } from '../../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, name, discordHandle } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and 6-digit code are required.' }, { status: 400 });
    }

    const user = await verifyCustomerOtp(email, code, name, discordHandle);

    const token = await signToken({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: 'customer',
    }, '365d');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        discordHandle: user.discordHandle,
        role: 'customer',
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('OTP Verify error:', error);
    return NextResponse.json({ error: error.message || 'Invalid verification code.' }, { status: 400 });
  }
}
