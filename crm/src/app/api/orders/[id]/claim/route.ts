import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../../lib/auth';
import { claimOrder, unclaimOrder, getOrderById } from '../../../../../lib/db';

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
    const { action } = body; // 'claim' or 'unclaim'

    const adminDisplayName = session.name || session.username;

    let updatedOrder;
    if (action === 'unclaim') {
      updatedOrder = await unclaimOrder(id);
    } else {
      updatedOrder = await claimOrder(id, adminDisplayName);
    }

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order claim status.' }, { status: 500 });
  }
}
