import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { getTickets, createTicket } from '../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const session = await getCurrentSession();

    const allTickets = await getTickets();

    // 1. Admin returns all
    if (session && (session.role === 'admin' || session.role === 'superadmin')) {
      return NextResponse.json({ success: true, tickets: allTickets });
    }

    // 2. Customer query by email
    if (email) {
      const filtered = allTickets.filter((t) => t.customerEmail.toLowerCase() === email.toLowerCase());
      return NextResponse.json({ success: true, tickets: filtered });
    }

    // 3. Customer session
    if (session && session.role === 'customer' && session.email) {
      const filtered = allTickets.filter((t) => t.customerEmail.toLowerCase() === session.email!.toLowerCase());
      return NextResponse.json({ success: true, tickets: filtered });
    }

    return NextResponse.json({ success: true, tickets: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerEmail, discordHandle, category, subject, initialMessage } = body;

    if (!customerEmail || !subject || !initialMessage) {
      return NextResponse.json({ error: 'Email, subject, and message are required.' }, { status: 400 });
    }

    const newTicket = await createTicket({
      orderId,
      customerEmail,
      discordHandle,
      category: category || 'General Question',
      subject,
      initialMessage,
    });

    return NextResponse.json({ success: true, ticket: newTicket }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit ticket.' }, { status: 500 });
  }
}
