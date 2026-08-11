import { NextRequest, NextResponse } from 'next/server';
import { generateCustomerOtp } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const { otpCode, isNewUser } = await generateCustomerOtp(email, name);

    console.log(`[AUTH OTP DISPATCH] Verification code for ${email}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      isNewUser,
      otpPreview: otpCode,
    });
  } catch (error: any) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send verification code.' }, { status: 500 });
  }
}
