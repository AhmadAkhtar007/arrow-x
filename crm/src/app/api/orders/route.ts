import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { getOrders, getOrdersByCustomerEmail, getOrderById, createOrder, getPaymentSettings } from '../../../lib/db';
import { 
  resolveOrderSelection, 
  validatePaymentProof, 
  isPaymentMethod,
  findGiftCardPurchaseLink,
} from '@arrowx/shared/orders';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');
    const emailQuery = searchParams.get('email');

    const session = await getCurrentSession();

    // 1. Admin access: full visibility
    if (session && (session.role === 'admin' || session.role === 'superadmin')) {
      if (orderId) {
        const found = await getOrderById(orderId);
        if (!found) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
        return NextResponse.json({ success: true, order: found });
      }
      if (emailQuery) {
        const customerOrders = await getOrdersByCustomerEmail(emailQuery);
        return NextResponse.json({ success: true, orders: customerOrders });
      }
      const allOrders = await getOrders();
      return NextResponse.json({ success: true, orders: allOrders });
    }

    // 2. Customer access: restricted to own orders only
    if (session && session.role === 'customer' && session.email) {
      if (orderId) {
        const found = await getOrderById(orderId);
        if (!found || found.customerEmail.toLowerCase() !== session.email.toLowerCase()) {
          return NextResponse.json({ error: 'Order not found or unauthorized.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, order: found });
      }
      const customerOrders = await getOrdersByCustomerEmail(session.email);
      return NextResponse.json({ success: true, orders: customerOrders });
    }

    // 3. Unauthenticated single order lookup (for public tracking redirect by exact ID with sanitized response)
    if (orderId) {
      const found = await getOrderById(orderId);
      if (!found) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      // Return safe public tracking view (omit sensitive internal notes)
      return NextResponse.json({
        success: true,
        order: {
          id: found.id,
          gameName: found.gameName,
          planTier: found.planTier,
          amount: found.amount,
          paymentMethod: found.paymentMethod,
          paymentStatus: found.paymentStatus,
          fulfillmentStatus: found.fulfillmentStatus,
          status: found.status,
          licenseKey: found.licenseKey,
          createdAt: found.createdAt,
          updatedAt: found.updatedAt,
        },
      });
    }

    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.email) {
      return NextResponse.json(
        { error: 'Please log in to your ArrowX account to complete checkout.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { 
      productId, 
      variantId, 
      offerId, 
      paymentMethod, 
      txHash, 
      screenshotUrl, 
      giftCardCode, 
      discordHandle, 
      notes 
    } = body;

    if (!productId || !variantId || !offerId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required order selection or payment method.' },
        { status: 400 }
      );
    }

    // 1. Server-authoritative selection and price resolution
    const selection = resolveOrderSelection(productId, variantId, offerId);
    if (!selection) {
      return NextResponse.json(
        { error: 'Invalid product, variant, or duration selected.' },
        { status: 400 }
      );
    }

    // 2. Validate payment method
    if (!isPaymentMethod(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method selected.' },
        { status: 400 }
      );
    }

    if (paymentMethod === 'GIFT_CARD') {
      const paymentSettings = await getPaymentSettings();
      if (!findGiftCardPurchaseLink(selection.amountUsd, paymentSettings.giftCardLinks || [])) {
        return NextResponse.json(
          { error: 'Gift-card payment is unavailable for this order. Please choose a crypto payment method or contact support.' },
          { status: 400 },
        );
      }
    }

    // 3. Validate payment proof
    const proofValidation = validatePaymentProof(paymentMethod, {
      txHash,
      screenshotUrl,
      giftCardCode,
    });

    if (!proofValidation.valid) {
      return NextResponse.json(
        { error: proofValidation.error || 'Invalid payment verification proof.' },
        { status: 400 }
      );
    }

    // 4. Create immutable order record with verification pending
    const newOrder = await createOrder({
      userId: session.id,
      customerName: session.name || session.username,
      customerEmail: session.email,
      discordHandle: discordHandle?.trim(),
      product: selection,
      paymentMethod,
      proof: {
        txHash: txHash?.trim() || undefined,
        screenshotUrl: screenshotUrl?.trim() || undefined,
        giftCardCode: giftCardCode?.trim() || undefined,
      },
      notes: notes?.trim(),
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create order.' }, { status: 500 });
  }
}
