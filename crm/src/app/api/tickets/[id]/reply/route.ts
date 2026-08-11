import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../../lib/auth';
import { addTicketMessage } from '../../../../../lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const session = await getCurrentSession();
    const senderRole = session && (session.role === 'admin' || session.role === 'superadmin') ? 'staff' : 'customer';
    const senderName = session?.name || session?.username || 'Customer';

    const updated = await addTicketMessage(id, {
      sender: senderRole,
      senderName,
      text: text.trim(),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
