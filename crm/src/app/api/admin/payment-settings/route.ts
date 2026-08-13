import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getPaymentSettings, updatePaymentSettings } from '../../../../lib/db';
import { validateGiftCardLinks, type GiftCardLink } from '@arrowx/shared/orders';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized admin access required.' }, { status: 403 });
    }

    const settings = await getPaymentSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch payment settings.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { btcAddress, btcQrUrl, solAddress, solQrUrl, usdtTrc20Address, usdtTrc20QrUrl, giftCardLinks } = body;

    if (giftCardLinks !== undefined) {
      if (!Array.isArray(giftCardLinks)) {
        return NextResponse.json({ error: 'Gift-card links must be an array.' }, { status: 400 });
      }
      const validation = validateGiftCardLinks(giftCardLinks);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const updated = await updatePaymentSettings({
      ...(btcAddress !== undefined && { btcAddress: btcAddress.trim() }),
      ...(btcQrUrl !== undefined && { btcQrUrl: btcQrUrl.trim() }),
      ...(solAddress !== undefined && { solAddress: solAddress.trim() }),
      ...(solQrUrl !== undefined && { solQrUrl: solQrUrl.trim() }),
      ...(usdtTrc20Address !== undefined && { usdtTrc20Address: usdtTrc20Address.trim() }),
      ...(usdtTrc20QrUrl !== undefined && { usdtTrc20QrUrl: usdtTrc20QrUrl.trim() }),
      ...(giftCardLinks !== undefined && {
        giftCardLinks: (giftCardLinks as GiftCardLink[])
          .map((link: GiftCardLink) => ({ denominationUsd: link.denominationUsd, purchaseUrl: link.purchaseUrl.trim() }))
          .sort((a: GiftCardLink, b: GiftCardLink) => a.denominationUsd - b.denominationUsd),
      }),
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update payment settings.' }, { status: 500 });
  }
}
