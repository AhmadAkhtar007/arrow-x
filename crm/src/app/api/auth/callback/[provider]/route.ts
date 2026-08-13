import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const target = new URL('/api/auth/callback', req.nextUrl.origin);
  req.nextUrl.searchParams.forEach((val, key) => target.searchParams.set(key, val));
  target.searchParams.set('provider', provider);
  return NextResponse.redirect(target);
}
