import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { getOrders, getOrdersByCustomerEmail, createOrder } from '../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');
    const emailQuery = searchParams.get('email');

    const session = await getCurrentSession();

    // 1. If admin, return all orders
    if (session && (session.role === 'admin' || session.role === 'superadmin')) {
      const orders = await getOrders();
      return NextResponse.json({ success: true, orders });
    }

    // 2. If single order query by ID
    if (orderId) {
      const allOrders = await getOrders();
      const found = allOrders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
      if (!found) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: found });
    }

    // 3. If query by customer email
    if (emailQuery) {
      const customerOrders = await getOrdersByCustomerEmail(emailQuery);
      return NextResponse.json({ success: true, orders: customerOrders });
    }

    // 4. If customer is logged in, return their orders
    if (session && session.role === 'customer' && session.email) {
      const customerOrders = await getOrdersByCustomerEmail(session.email);
      return NextResponse.json({ success: true, orders: customerOrders });
    }

    return NextResponse.json({ success: true, orders: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerEmail, discordHandle, gameName, planTier, amount, paymentMethod, notes } = body;

    if (!customerEmail || !gameName || !planTier || !amount || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required order fields.' }, { status: 400 });
    }

    const session = await getCurrentSession();

    const newOrder = await createOrder({
      userId: session?.id,
      customerEmail,
      discordHandle,
      gameName,
      planTier,
      amount: Number(amount),
      paymentMethod,
      notes,
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create order.' }, { status: 500 });
  }
}
