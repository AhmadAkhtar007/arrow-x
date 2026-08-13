import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { AUTH_COOKIE_NAME, signToken } from '../../../../lib/auth';
import { upsertOAuthCustomer } from '../../../../lib/db';
import { sanitizeReturnUrl } from '../../../../lib/customerAuth';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  const returnUrl = sanitizeReturnUrl(requestUrl.searchParams.get('returnUrl'));
  const providerParam = requestUrl.searchParams.get('provider') || 'google';

  const failureRedirect = new URL('/login', req.url);
  failureRedirect.searchParams.set('returnUrl', returnUrl);

  if (!code) {
    const errorDescription = requestUrl.searchParams.get('error_description') || 'No authorization code received.';
    failureRedirect.searchParams.set('oauthError', errorDescription);
    return NextResponse.redirect(failureRedirect);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      console.error('Supabase code exchange error:', error?.message);
      failureRedirect.searchParams.set('oauthError', error?.message || 'Authentication code exchange failed.');
      return NextResponse.redirect(failureRedirect);
    }

    const authUser = data.user;
    const email = authUser.email;
    if (!email) {
      failureRedirect.searchParams.set('oauthError', 'No verified email returned from authentication provider.');
      return NextResponse.redirect(failureRedirect);
    }

    const provider = (authUser.app_metadata?.provider || providerParam) as 'google' | 'discord';
    const metadata = authUser.user_metadata || {};
    
    // Auto-extract full name, Discord username, and profile details from standard Supabase metadata
    const name = 
      metadata.full_name || 
      metadata.name || 
      metadata.global_name ||
      metadata.custom_claims?.global_name || 
      metadata.preferred_username || 
      email.split('@')[0];

    const discordHandle = provider === 'discord'
      ? (
          metadata.preferred_username ||
          metadata.user_name ||
          metadata.username ||
          metadata.custom_claims?.username ||
          metadata.global_name ||
          metadata.full_name ||
          metadata.name
        )
      : undefined;

    // Synchronize customer profile
    const user = await upsertOAuthCustomer({
      email,
      name,
      provider,
      providerId: authUser.id,
      discordHandle,
    });

    // Generate authenticated JWT session
    const jwt = await signToken(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: 'customer',
      },
      '365d'
    );

    // Redirect to customer portal or original requested checkout/order page
    const successRedirect = new URL(returnUrl, req.nextUrl.origin);
    const response = NextResponse.redirect(successRedirect);

    response.cookies.set(AUTH_COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Supabase OAuth callback exception:', err);
    failureRedirect.searchParams.set('oauthError', err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
    return NextResponse.redirect(failureRedirect);
  }
}
