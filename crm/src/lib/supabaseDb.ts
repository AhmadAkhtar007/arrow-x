import { createClient } from '@supabase/supabase-js';
import { 
  UserAccount, 
  AdminAccount, 
  RealOrder, 
  RealSupportTicket, 
  PaymentSettings 
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtxuyzzcngfvfitywjvs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_QoiLLFll73Btg-fZxOdKvA_z4lZ3qOm';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ====================================================================
// 1. CUSTOMERS / USERS
// ====================================================================
export async function getSupabaseUsers(): Promise<UserAccount[]> {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) return [];
    return data.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      role: 'customer' as const,
      discordHandle: u.discord_handle || undefined,
      hwid: u.hwid || undefined,
      otpCode: u.otp_code || undefined,
      otpExpiresAt: u.otp_expires_at || undefined,
      createdAt: u.created_at,
    }));
  } catch {
    return [];
  }
}

export async function getSupabaseUserByEmail(email: string): Promise<UserAccount | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email.trim())
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.username,
      role: 'customer' as const,
      discordHandle: data.discord_handle || undefined,
      hwid: data.hwid || undefined,
      otpCode: data.otp_code || undefined,
      otpExpiresAt: data.otp_expires_at || undefined,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

export async function upsertSupabaseUser(user: UserAccount): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase().trim(),
      username: user.username,
      role: user.role,
      discord_handle: user.discordHandle || null,
      hwid: user.hwid || null,
      otp_code: user.otpCode || null,
      otp_expires_at: user.otpExpiresAt || null,
      created_at: user.createdAt || new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

// ====================================================================
// 2. ORDERS & TRANSACTIONS
// ====================================================================
export async function getSupabaseOrders(customerEmail?: string): Promise<RealOrder[]> {
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (customerEmail) {
      query = query.ilike('customer_email', customerEmail.trim());
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((o: any) => ({
      id: o.id,
      customerEmail: o.customer_email,
      customerName: o.customer_name,
      discordHandle: o.customer_discord || undefined,
      gameName: o.game_name,
      planTier: o.plan_tier,
      amount: Number(o.amount),
      paymentMethod: o.payment_method || 'CRYPTO',
      paymentStatus: o.payment_status === 'VERIFIED' ? 'VERIFIED' : o.payment_status === 'REJECTED' ? 'REJECTED' : 'VERIFICATION_PENDING',
      fulfillmentStatus: o.fulfillment_status === 'DISPATCHED' ? 'DISPATCHED' : o.fulfillment_status === 'CLAIMED' ? 'CLAIMED' : 'PENDING',
      licenseKey: o.license_key || undefined,
      rejectionReason: o.rejection_reason || undefined,
      status: o.fulfillment_status === 'DISPATCHED' ? 'Completed' : o.fulfillment_status === 'CLAIMED' ? 'Claimed' : 'Pending',
      createdAt: o.created_at,
      updatedAt: 'Just now',
      product: {
        productId: o.game_id,
        productName: o.game_name,
        variantId: 'standard',
        variantName: o.plan_tier,
        offerId: 'standard',
        offerLabel: o.plan_tier,
        amountUsd: Number(o.amount),
      },
      proof: {
        txHash: o.crypto_tx_id || undefined,
        giftCardCode: o.gift_card_code || undefined,
      },
    }));
  } catch {
    return [];
  }
}

export async function upsertSupabaseOrder(order: RealOrder): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      customer_email: order.customerEmail,
      customer_name: order.customerName || order.customerEmail.split('@')[0],
      customer_discord: order.discordHandle || null,
      game_id: order.product?.productId || order.gameName.toLowerCase().replace(/\s+/g, '-'),
      game_name: order.gameName,
      plan_tier: order.planTier,
      amount: order.amount,
      currency: 'USD',
      payment_method: order.paymentMethod || 'CRYPTO',
      crypto_tx_id: order.proof?.txHash || null,
      gift_card_code: order.proof?.giftCardCode || null,
      payment_status: order.paymentStatus === 'VERIFIED' ? 'VERIFIED' : order.paymentStatus === 'REJECTED' ? 'REJECTED' : 'PENDING',
      fulfillment_status: order.fulfillmentStatus === 'DISPATCHED' ? 'DISPATCHED' : order.fulfillmentStatus === 'CLAIMED' ? 'CLAIMED' : 'UNCLAIMED',
      license_key: order.licenseKey || null,
      rejection_reason: order.rejectionReason || null,
      created_at: order.createdAt || new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

// ====================================================================
// 3. SUPPORT TICKETS
// ====================================================================
export async function getSupabaseTickets(customerEmail?: string): Promise<RealSupportTicket[]> {
  try {
    let query = supabase.from('support_tickets').select(`
      *,
      ticket_messages (*)
    `).order('created_at', { ascending: false });

    if (customerEmail) {
      query = query.ilike('customer_email', customerEmail.trim());
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((t: any) => ({
      id: t.id,
      orderId: t.order_id || undefined,
      customerEmail: t.customer_email,
      customerName: t.customer_name,
      discordHandle: t.discord_handle || undefined,
      subject: t.subject,
      status: t.status,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      messages: (t.ticket_messages || []).map((m: any) => ({
        id: m.id,
        sender: m.sender_role as 'customer' | 'staff',
        senderName: m.sender_name,
        text: m.text,
        timestamp: m.timestamp,
      })),
    }));
  } catch {
    return [];
  }
}

// ====================================================================
// 4. PAYMENT SETTINGS
// ====================================================================
export async function getSupabasePaymentSettings(): Promise<PaymentSettings | null> {
  try {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) return null;
    return {
      btcAddress: data.btc_address,
      btcQrUrl: data.btc_qr_url || undefined,
      solAddress: data.sol_address,
      solQrUrl: data.sol_qr_url || undefined,
      usdtTrc20Address: data.usdt_trc20_address,
      usdtTrc20QrUrl: data.usdt_trc20_qr_url || undefined,
      giftCardLinks: Array.isArray(data.gift_card_links) ? (data.gift_card_links as any) : [],
    };
  } catch {
    return null;
  }
}
