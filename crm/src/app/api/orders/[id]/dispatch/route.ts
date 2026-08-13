import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../../lib/auth';
import { dispatchOrder, getOrderById } from '../../../../../lib/db';

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

    const body = await req.json();
    const { licenseKey, notes } = body;

    if (!licenseKey || !licenseKey.trim()) {
      return NextResponse.json({ error: 'License key is required to dispatch.' }, { status: 400 });
    }

    const adminName = session.name || session.username;
    const updatedOrder = await dispatchOrder(id, licenseKey.trim(), adminName, notes);

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch order.' },
      { status: error.message?.includes('verified') ? 400 : 500 }
    );
  }
}
