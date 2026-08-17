import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { getTickets, getTicketById, createTicket } from '../../../lib/db';
import { parseSupportRequest } from '../../../lib/supportRequest';

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
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
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('id');
    const email = searchParams.get('email');
    const session = await getCurrentSession();

    // 1. Direct query by Ticket ID
    if (ticketId) {
      const ticket = await getTicketById(ticketId.trim());
      if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found.' }, { status: 404, headers: corsHeaders });
      }
      return NextResponse.json({ success: true, ticket, tickets: [ticket] }, { headers: corsHeaders });
    }

    // 2. Admin returns all tickets
    if (session && (session.role === 'admin' || session.role === 'superadmin')) {
      const allTickets = await getTickets();
      return NextResponse.json({ success: true, tickets: allTickets }, { headers: corsHeaders });
    }

    // 3. Customer query by email
    if (email) {
      const tickets = await getTickets(email.trim());
      return NextResponse.json({ success: true, tickets }, { headers: corsHeaders });
    }

    // 4. Customer session
    if (session && session.role === 'customer' && session.email) {
      const tickets = await getTickets(session.email);
      return NextResponse.json({ success: true, tickets }, { headers: corsHeaders });
    }

    return NextResponse.json({ success: true, tickets: [] }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const payload = await req.json();
    const session = await getCurrentSession();

    // Auto-attach user details if session exists
    if (session && session.role === 'customer') {
      if (!payload.customerEmail && session.email) payload.customerEmail = session.email;
      if (!payload.customerName && (session.name || session.username)) payload.customerName = session.name || session.username;
    }

    const newTicket = await createTicket(parseSupportRequest(payload));
    return NextResponse.json({ success: true, ticket: newTicket }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    const message = error.message || 'Failed to submit ticket.';
    return NextResponse.json(
      { error: message }, 
      { status: message === 'Email, subject, and message are required.' ? 400 : 500, headers: corsHeaders }
    );
  }
}
