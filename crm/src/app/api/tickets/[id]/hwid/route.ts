import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../../lib/auth';
import { approveHwidReset } from '../../../../../lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await getCurrentSession();

    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const adminName = session.name || session.username;
    const updated = await approveHwidReset(id, adminName);

    if (!updated) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
