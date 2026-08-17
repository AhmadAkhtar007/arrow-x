import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getUserByEmail } from '../../../../lib/db';

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const allowed = 
    origin.includes('arrowx.shop') || 
    origin.includes('localhost') || 
    origin.includes('127.0.0.1');

  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'https://arrowx.shop',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { headers: corsHeaders });
    }

    if (session.role === 'admin' || session.role === 'superadmin') {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          username: session.username,
          role: session.role,
        },
      }, { headers: corsHeaders });
    }

    const customer = session.email ? await getUserByEmail(session.email) : null;
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: customer?.name || session.name || session.username,
        username: session.username,
        email: session.email || '',
        discordHandle: customer?.discordHandle,
        hwid: customer?.hwid,
        role: 'customer',
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false, user: null }, { headers: corsHeaders });
  }
}
