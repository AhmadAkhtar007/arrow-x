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

export async function generateSupabaseOtp(
  email: string, 
  name?: string
): Promise<{ otpCode: string; isNewUser: boolean; user: UserAccount }> {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await getSupabaseUserByEmail(normalizedEmail);
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  let user: UserAccount;
  let isNewUser = false;

  if (existing) {
    user = {
      ...existing,
      otpCode,
      otpExpiresAt,
    };
  } else {
    isNewUser = true;
    const defaultName = name || normalizedEmail.split('@')[0];
    user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: defaultName,
      email: normalizedEmail,
      username: defaultName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(100 + Math.random() * 900),
      role: 'customer',
      otpCode,
      otpExpiresAt,
      createdAt: new Date().toISOString(),
    };
  }

  await upsertSupabaseUser(user);
  return { otpCode, isNewUser, user };
}

export async function verifySupabaseOtp(
  email: string,
  code: string,
  name?: string,
  discordHandle?: string
): Promise<UserAccount> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await getSupabaseUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error('Account not found. Please request a new verification code.');
  }

  if (!user.otpCode || user.otpCode !== code.trim()) {
    throw new Error('Invalid verification code. Please check your code and try again.');
  }

  if (user.otpExpiresAt && new Date() > new Date(user.otpExpiresAt)) {
    throw new Error('Verification code has expired. Please request a new code.');
  }

  // Clear OTP on successful login
  const updatedUser: UserAccount = {
    ...user,
    otpCode: undefined,
    otpExpiresAt: undefined,
    name: name?.trim() ? name.trim() : user.name,
    discordHandle: discordHandle?.trim() ? discordHandle.trim() : user.discordHandle,
  };

  await upsertSupabaseUser(updatedUser);
  return updatedUser;
}

export async function upsertSupabaseOAuthCustomer(data: {
  email: string;
  name: string;
  provider: 'google' | 'discord';
  providerId: string;
  discordHandle?: string;
}): Promise<UserAccount> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = await getSupabaseUserByEmail(normalizedEmail);

  if (existing) {
    const updated: UserAccount = {
      ...existing,
      name: data.name || existing.name,
      googleId: data.provider === 'google' ? data.providerId : existing.googleId,
      discordId: data.provider === 'discord' ? data.providerId : existing.discordId,
      discordHandle: data.discordHandle || existing.discordHandle,
    };
    await upsertSupabaseUser(updated);
    return updated;
  }

  const defaultName = data.name || normalizedEmail.split('@')[0];
  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: defaultName,
    email: normalizedEmail,
    username: defaultName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(100 + Math.random() * 900),
    role: 'customer',
    googleId: data.provider === 'google' ? data.providerId : undefined,
    discordId: data.provider === 'discord' ? data.providerId : undefined,
    discordHandle: data.discordHandle,
    createdAt: new Date().toISOString(),
  };

  await upsertSupabaseUser(newUser);
  return newUser;
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

import { createCatalogGiftCardLinks } from '@arrowx/shared/orders';

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

    if (error || !data) {
      return {
        btcAddress: '156uWuAoK4MZpZGcJcXeZ4pvqetc8zrsdA',
        btcQrUrl: '/assets/payments/btc.png',
        solAddress: '6Thyxoq4WwyobyTepmiqxN6n2JpQfsFfwQpz9c1gv6m8',
        solQrUrl: '/assets/payments/sol.png',
        usdtTrc20Address: 'THYKE8YXanrBSCvFtiihVLYstNNprKUhoC',
        usdtTrc20QrUrl: '/assets/payments/usdt-trc20.png',
        giftCardLinks: createCatalogGiftCardLinks(),
      };
    }

    const customLinks = Array.isArray(data.gift_card_links) && data.gift_card_links.length > 0
      ? (data.gift_card_links as any)
      : createCatalogGiftCardLinks();

    return {
      btcAddress: data.btc_address || '156uWuAoK4MZpZGcJcXeZ4pvqetc8zrsdA',
      btcQrUrl: data.btc_qr_url || '/assets/payments/btc.png',
      solAddress: data.sol_address || '6Thyxoq4WwyobyTepmiqxN6n2JpQfsFfwQpz9c1gv6m8',
      solQrUrl: data.sol_qr_url || '/assets/payments/sol.png',
      usdtTrc20Address: data.usdt_trc20_address || 'THYKE8YXanrBSCvFtiihVLYstNNprKUhoC',
      usdtTrc20QrUrl: data.usdt_trc20_qr_url || '/assets/payments/usdt-trc20.png',
      giftCardLinks: customLinks,
    };
  } catch {
    return {
      btcAddress: '156uWuAoK4MZpZGcJcXeZ4pvqetc8zrsdA',
      btcQrUrl: '/assets/payments/btc.png',
      solAddress: '6Thyxoq4WwyobyTepmiqxN6n2JpQfsFfwQpz9c1gv6m8',
      solQrUrl: '/assets/payments/sol.png',
      usdtTrc20Address: 'THYKE8YXanrBSCvFtiihVLYstNNprKUhoC',
      usdtTrc20QrUrl: '/assets/payments/usdt-trc20.png',
      giftCardLinks: createCatalogGiftCardLinks(),
    };
  }
}
