import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../../lib/auth';
import { addTicketMessage } from '../../../../../lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

export async function POST(req: NextRequest, { params }: RouteContext) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const { id } = await params;
    const body = await req.json();
    const { text, senderName: explicitSenderName } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400, headers: corsHeaders });
    }

    const session = await getCurrentSession();
    const isStaff = session && (session.role === 'admin' || session.role === 'superadmin');
    const senderRole = isStaff ? 'staff' : 'customer';
    
    let senderName = 'Customer';
    if (isStaff) {
      senderName = session.username || session.name || 'Staff';
    } else if (session?.name || session?.username) {
      senderName = session.name || session.username;
    } else if (explicitSenderName?.trim()) {
      senderName = explicitSenderName.trim();
    }

    const updated = await addTicketMessage(id, {
      sender: senderRole,
      senderName,
      text: text.trim(),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, ticket: updated }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
