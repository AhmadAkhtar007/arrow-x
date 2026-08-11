import { NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getUserByEmail, getAdminByUsername } from '../../../../lib/db';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    if (session.role === 'admin' || session.role === 'superadmin') {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          username: session.username,
          role: session.role,
        },
      });
    }

    const customer = session.email ? await getUserByEmail(session.email) : null;
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name || session.username,
        username: session.username,
        email: session.email || '',
        discordHandle: customer?.discordHandle,
        hwid: customer?.hwid,
        role: 'customer',
      },
    });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
