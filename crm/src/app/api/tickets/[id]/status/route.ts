import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../../lib/auth';
import { updateTicketStatus, getTicketById } from '../../../../../lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
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

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ['Open', 'Pending Staff', 'HWID Approved', 'Resolved', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400, headers: corsHeaders }
      );
    }

    const session = await getCurrentSession();
    const existingTicket = await getTicketById(id);
    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404, headers: corsHeaders });
    }

    const isStaff = session && (session.role === 'admin' || session.role === 'superadmin');
    const isOwner = session && session.role === 'customer' && session.email?.toLowerCase() === existingTicket.customerEmail.toLowerCase();

    // Customers can only mark their own tickets as Resolved or Closed
    if (!isStaff && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized to update ticket status.' }, { status: 403, headers: corsHeaders });
    }

    if (!isStaff && isOwner && status !== 'Resolved' && status !== 'Closed') {
      return NextResponse.json({ error: 'Customers may only mark tickets as Resolved or Closed.' }, { status: 403, headers: corsHeaders });
    }

    const staffName = isStaff ? (session.username || session.name || 'Staff') : undefined;
    const updated = await updateTicketStatus(id, status, staffName);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update ticket status.' }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, ticket: updated }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
