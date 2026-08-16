import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
import { sanitizeReturnUrl } from '../../../../../lib/customerAuth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (provider !== 'google' && provider !== 'discord') {
    return NextResponse.json({ error: 'Unsupported provider.' }, { status: 404 });
  }

  const returnUrl = sanitizeReturnUrl(req.nextUrl.searchParams.get('returnUrl'));

  try {
    const supabase = await createClient();
    
    const origin = process.env.NEXT_PUBLIC_APP_URL || (req.nextUrl.origin.includes('localhost') ? req.nextUrl.origin : 'https://vault.arrowx.shop');
    const callbackUrl = new URL('/api/auth/callback', origin);
    callbackUrl.searchParams.set('returnUrl', returnUrl);
    callbackUrl.searchParams.set('provider', provider);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'discord',
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
      },
    });

    if (error) {
      console.error('Supabase OAuth initialization error:', error.message);
      const target = new URL('/login', req.url);
      target.searchParams.set('returnUrl', returnUrl);
      target.searchParams.set('oauthError', `${provider === 'discord' ? 'Discord' : 'Google'} sign-in: ${error.message}`);
      return NextResponse.redirect(target);
    }

    if (data?.url) {
      return NextResponse.redirect(data.url);
    }

    throw new Error('Could not generate OAuth redirect URL.');
  } catch (err: any) {
    console.error('OAuth sign-in handler error:', err);
    const target = new URL('/login', req.url);
    target.searchParams.set('returnUrl', returnUrl);
    target.searchParams.set('oauthError', `${provider === 'discord' ? 'Discord' : 'Google'} sign-in is currently unavailable.`);
    return NextResponse.redirect(target);
  }
}
