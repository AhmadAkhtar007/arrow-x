import { NextResponse } from 'next/server';
import { getPaymentSettings } from '../../../lib/db';

export async function GET() {
  try {
    const settings = await getPaymentSettings();
    return NextResponse.json({
      success: true,
      settings: {
        btcAddress: settings.btcAddress,
        btcQrUrl: settings.btcQrUrl,
        solAddress: settings.solAddress,
        solQrUrl: settings.solQrUrl,
        usdtTrc20Address: settings.usdtTrc20Address,
        usdtTrc20QrUrl: settings.usdtTrc20QrUrl,
        giftCardLinks: settings.giftCardLinks,
      },
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch payment settings.' }, { status: 500 });
  }
}
