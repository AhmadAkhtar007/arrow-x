import { NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getUsers } from '../../../../lib/db';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const users = await getUsers();
    const customers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      discordHandle: user.discordHandle,
      role: user.role,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
