import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
import { generateCustomerOtp } from '../../../../../lib/db';
import { buildOtpResponse } from '../../../../../lib/customerAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Native Supabase Email OTP Dispatch
    const supabase = await createClient();
    const { error: supabaseError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (supabaseError) {
      console.warn('Supabase signInWithOtp notice (falling back if needed):', supabaseError.message);
      
      // Fallback for local development or rate limit handling
      const { otpCode, isNewUser } = await generateCustomerOtp(normalizedEmail);
      console.log(`[AUTH OTP LOCAL BACKUP] Code for ${normalizedEmail}: ${otpCode}`);

      return NextResponse.json({
        success: true,
        message: `Security verification code dispatched to ${normalizedEmail}`,
        ...buildOtpResponse(otpCode, isNewUser, process.env.NODE_ENV),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Check your inbox!`,
    });
  } catch (error: any) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send verification code.' }, { status: 500 });
  }
}
