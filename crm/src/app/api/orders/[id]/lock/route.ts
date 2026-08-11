import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../../lib/auth';
import { claimOrder, unclaimOrder } from '../../../../../lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await getCurrentSession();

    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized admin access required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { action } = body;

    const adminName = session.name || session.username;

    let updated;
    if (action === 'unlock') {
      updated = await unclaimOrder(id);
    } else {
      updated = await claimOrder(id, adminName);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order lock status.' }, { status: 500 });
  }
}
