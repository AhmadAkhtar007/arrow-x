import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
import { verifyCustomerOtp, upsertOAuthCustomer } from '../../../../../lib/db';
import { signToken, AUTH_COOKIE_NAME } from '../../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, name, discordHandle } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    let authenticatedUser: any = null;

    // 1. Attempt Native Supabase OTP Verification
    const supabase = await createClient();
    const { data: supabaseAuth, error: supabaseError } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: trimmedCode,
      type: 'email',
    });

    if (!supabaseError && supabaseAuth?.user) {
      const user = await upsertOAuthCustomer({
        email: normalizedEmail,
        name: name || normalizedEmail.split('@')[0],
        provider: 'google', // Generic verified email
        providerId: supabaseAuth.user.id,
        discordHandle,
      });
      authenticatedUser = user;
    } else {
      // 2. Fallback to local DB verification
      try {
        const user = await verifyCustomerOtp(normalizedEmail, trimmedCode, name, discordHandle);
        authenticatedUser = user;
      } catch (localError: any) {
        throw new Error(supabaseError?.message || localError.message || 'Invalid verification code.');
      }
    }

    const token = await signToken({
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      username: authenticatedUser.username,
      email: authenticatedUser.email,
      role: 'customer',
    }, '365d');

    const response = NextResponse.json({
      success: true,
      user: {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        discordHandle: authenticatedUser.discordHandle,
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
