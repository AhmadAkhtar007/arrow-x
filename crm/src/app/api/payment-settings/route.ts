import { NextResponse } from 'next/server';
import { getPaymentSettings } from '../../../lib/db';
import { getSupabasePaymentSettings } from '../../../lib/supabaseDb';
import { createCatalogGiftCardLinks } from '@arrowx/shared/orders';

export async function GET() {
  try {
    const supabaseSettings = await getSupabasePaymentSettings();
    const settings = supabaseSettings || (await getPaymentSettings());
    const giftCardLinks =
      settings.giftCardLinks && settings.giftCardLinks.length > 0
        ? settings.giftCardLinks
        : createCatalogGiftCardLinks();

    return NextResponse.json({
      success: true,
      settings: {
        btcAddress: settings.btcAddress,
        btcQrUrl: settings.btcQrUrl,
        solAddress: settings.solAddress,
        solQrUrl: settings.solQrUrl,
        usdtTrc20Address: settings.usdtTrc20Address,
        usdtTrc20QrUrl: settings.usdtTrc20QrUrl,
        giftCardLinks,
      },
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch payment settings.' }, { status: 500 });
  }
}
