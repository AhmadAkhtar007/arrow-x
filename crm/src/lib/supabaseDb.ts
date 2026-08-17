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

export async function getSupabaseUserById(id: string): Promise<UserAccount | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id.trim())
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

export async function updateSupabaseCustomerProfile(
  userId: string,
  updates: { name?: string; username?: string; discordHandle?: string; hwid?: string }
): Promise<UserAccount | null> {
  try {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.username !== undefined) payload.username = updates.username.trim();
    if (updates.discordHandle !== undefined) payload.discord_handle = updates.discordHandle.trim() || null;
    if (updates.hwid !== undefined) payload.hwid = updates.hwid.trim() || null;

    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error || !data) {
      // Try lookup by email if userId didn't match (for OAuth users)
      const { data: byEmail, error: emailError } = await supabase
        .from('users')
        .update(payload)
        .ilike('email', userId)
        .select()
        .maybeSingle();

      if (emailError || !byEmail) return null;
      return {
        id: byEmail.id,
        name: byEmail.name,
        email: byEmail.email,
        username: byEmail.username,
        role: 'customer',
        discordHandle: byEmail.discord_handle || undefined,
        hwid: byEmail.hwid || undefined,
        createdAt: byEmail.created_at,
      };
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.username,
      role: 'customer',
      discordHandle: data.discord_handle || undefined,
      hwid: data.hwid || undefined,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

export async function deleteSupabaseUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId.trim());

    if (error) {
      // Fallback: try by email in case userId is an email string
      const { error: emailErr } = await supabase
        .from('users')
        .delete()
        .ilike('email', userId.trim());
      return !emailErr;
    }

    return true;
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

    return data.map((t: any) => {
      const messages = (t.ticket_messages || [])
        .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((m: any) => ({
          id: m.id,
          sender: (m.sender_role === 'agent' ? 'staff' : m.sender_role) as 'customer' | 'staff',
          senderName: m.sender_name,
          text: m.text,
          timestamp: m.timestamp,
        }));

      return {
        id: t.id,
        orderId: t.order_id || undefined,
        customerEmail: t.customer_email,
        customerName: t.customer_name,
        discordHandle: t.discord_handle || undefined,
        subject: t.subject,
        status: t.status,
        claimedBy: t.assigned_to || undefined,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        messages,
      };
    });
  } catch (err) {
    console.error('getSupabaseTickets error:', err);
    return [];
  }
}

export async function getSupabaseTicketById(ticketId: string): Promise<RealSupportTicket | null> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        ticket_messages (*)
      `)
      .eq('id', ticketId.trim())
      .maybeSingle();

    if (error || !data) return null;

    const messages = (data.ticket_messages || [])
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((m: any) => ({
        id: m.id,
        sender: (m.sender_role === 'agent' ? 'staff' : m.sender_role) as 'customer' | 'staff',
        senderName: m.sender_name,
        text: m.text,
        timestamp: m.timestamp,
      }));

    return {
      id: data.id,
      orderId: data.order_id || undefined,
      customerEmail: data.customer_email,
      customerName: data.customer_name,
      discordHandle: data.discord_handle || undefined,
      subject: data.subject,
      status: data.status,
      claimedBy: data.assigned_to || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      messages,
    };
  } catch (err) {
    console.error('getSupabaseTicketById error:', err);
    return null;
  }
}

export async function createSupabaseTicket(data: {
  id: string;
  orderId?: string;
  customerEmail: string;
  customerName?: string;
  discordHandle?: string;
  subject: string;
  initialMessage: string;
}): Promise<RealSupportTicket | null> {
  try {
    const now = new Date().toISOString();
    const customerName = data.customerName || data.customerEmail.split('@')[0];

    const { error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        id: data.id,
        order_id: data.orderId || null,
        customer_email: data.customerEmail.toLowerCase().trim(),
        customer_name: customerName,
        discord_handle: data.discordHandle || null,
        subject: data.subject.trim(),
        status: 'Open',
        created_at: now,
        updated_at: now,
      });

    if (ticketError) {
      console.error('createSupabaseTicket insert error:', ticketError);
      return null;
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const { error: messageError } = await supabase
      .from('ticket_messages')
      .insert({
        id: messageId,
        ticket_id: data.id,
        sender_role: 'customer',
        sender_name: customerName,
        text: data.initialMessage.trim(),
        timestamp: now,
      });

    if (messageError) {
      console.warn('createSupabaseTicket message insert warning:', messageError);
    }

    return {
      id: data.id,
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      customerName,
      discordHandle: data.discordHandle,
      subject: data.subject,
      status: 'Open',
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: messageId,
          sender: 'customer',
          senderName: customerName,
          text: data.initialMessage.trim(),
          timestamp: now,
        },
      ],
    };
  } catch (err) {
    console.error('createSupabaseTicket exception:', err);
    return null;
  }
}

export async function addSupabaseTicketMessage(
  ticketId: string,
  message: { sender: 'customer' | 'staff'; senderName: string; text: string },
  newStatus?: string
): Promise<RealSupportTicket | null> {
  try {
    const now = new Date().toISOString();
    const roleForDb = message.sender === 'staff' ? 'agent' : 'customer';

    const { error: messageError } = await supabase
      .from('ticket_messages')
      .insert({
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ticket_id: ticketId.trim(),
        sender_role: roleForDb,
        sender_name: message.senderName,
        text: message.text.trim(),
        timestamp: now,
      });

    if (messageError) {
      console.error('addSupabaseTicketMessage error:', messageError);
    }

    // Update ticket updated_at and optionally status
    const updatePayload: any = { updated_at: now };
    if (newStatus) {
      updatePayload.status = newStatus;
    }

    await supabase
      .from('support_tickets')
      .update(updatePayload)
      .eq('id', ticketId.trim());

    return await getSupabaseTicketById(ticketId);
  } catch (err) {
    console.error('addSupabaseTicketMessage exception:', err);
    return null;
  }
}

export async function updateSupabaseTicketStatus(
  ticketId: string,
  status: string,
  assignedTo?: string
): Promise<RealSupportTicket | null> {
  try {
    const now = new Date().toISOString();
    const updatePayload: any = {
      status,
      updated_at: now,
    };
    if (assignedTo !== undefined) {
      updatePayload.assigned_to = assignedTo;
    }

    const { error } = await supabase
      .from('support_tickets')
      .update(updatePayload)
      .eq('id', ticketId.trim());

    if (error) {
      console.error('updateSupabaseTicketStatus error:', error);
      return null;
    }

    return await getSupabaseTicketById(ticketId);
  } catch (err) {
    console.error('updateSupabaseTicketStatus exception:', err);
    return null;
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

// ====================================================================
// 5. ADMIN ACCOUNTS (LivingLegend, Mimester, Rapz, Gadhzi)
// ====================================================================
const DEFAULT_SUPERADMINS = [
  { id: 'adm_super_01', username: 'LivingLegend', role: 'superadmin' as const },
  { id: 'adm_super_02', username: 'Mimester', role: 'superadmin' as const },
  { id: 'adm_super_03', username: 'Rapz', role: 'superadmin' as const },
  { id: 'adm_super_04', username: 'Gadhzi', role: 'superadmin' as const },
];

export async function getSupabaseAdminByUsername(username: string): Promise<AdminAccount | null> {
  try {
    const normalizedUsername = username.trim();
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .ilike('username', normalizedUsername)
      .maybeSingle();

    if (error || !data) {
      // Check if this is one of the 4 configured superadmins that needs auto-seeding
      const matched = DEFAULT_SUPERADMINS.find(
        (a) => a.username.toLowerCase() === normalizedUsername.toLowerCase()
      );
      if (matched) {
        const bcrypt = (await import('bcryptjs')).default;
        const passwordHash = await bcrypt.hash('Admin123', 10);
        const newAdmin: AdminAccount = {
          id: matched.id,
          username: matched.username,
          passwordHash,
          role: matched.role,
          createdAt: new Date().toISOString(),
        };
        await createSupabaseAdmin(newAdmin).catch(() => {});
        return newAdmin;
      }
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      passwordHash: data.password_hash,
      role: data.role as 'admin' | 'superadmin',
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('getSupabaseAdminByUsername error:', err);
    return null;
  }
}

export async function getSupabaseAdminById(id: string): Promise<AdminAccount | null> {
  try {
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .eq('id', id.trim())
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      username: data.username,
      passwordHash: data.password_hash,
      role: data.role as 'admin' | 'superadmin',
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

export async function getSupabaseAdmins(): Promise<AdminAccount[]> {
  try {
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .order('created_at', { ascending: true });

    const currentAdmins: any[] = data || [];
    
    // Auto-ensure all 4 default superadmins exist in Supabase
    const bcrypt = (await import('bcryptjs')).default;
    for (const defaultAdmin of DEFAULT_SUPERADMINS) {
      const exists = currentAdmins.some(
        (a: any) => a.username.toLowerCase() === defaultAdmin.username.toLowerCase()
      );
      if (!exists) {
        const passwordHash = await bcrypt.hash('Admin123', 10);
        try {
          const inserted = await createSupabaseAdmin({
            id: defaultAdmin.id,
            username: defaultAdmin.username,
            passwordHash,
            role: defaultAdmin.role,
          });
          currentAdmins.push({
            id: inserted.id,
            username: inserted.username,
            password_hash: inserted.passwordHash,
            role: inserted.role,
            created_at: inserted.createdAt,
          });
        } catch (e) {
          console.warn('Could not auto-insert admin account into Supabase:', defaultAdmin.username, e);
        }
      }
    }

    return currentAdmins.map((a: any) => ({
      id: a.id,
      username: a.username,
      passwordHash: a.password_hash,
      role: a.role as 'admin' | 'superadmin',
      createdAt: a.created_at,
    }));
  } catch (err) {
    console.error('getSupabaseAdmins error:', err);
    return [];
  }
}

export async function createSupabaseAdmin(data: {
  id?: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
}): Promise<AdminAccount> {
  const id = data.id || `adm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const { data: created, error } = await supabase
    .from('admin_accounts')
    .upsert({
      id,
      username: data.username.trim(),
      password_hash: data.passwordHash,
      role: data.role,
    })
    .select()
    .single();

  if (error || !created) {
    throw new Error(error?.message || 'Failed to create admin in database.');
  }

  return {
    id: created.id,
    username: created.username,
    passwordHash: created.password_hash,
    role: created.role as 'admin' | 'superadmin',
    createdAt: created.created_at,
  };
}

export async function updateSupabaseAdminProfile(
  adminId: string,
  updates: { username?: string; passwordHash?: string; role?: 'admin' | 'superadmin' }
): Promise<AdminAccount | null> {
  try {
    const payload: any = {};
    if (updates.username) payload.username = updates.username.trim();
    if (updates.passwordHash) payload.password_hash = updates.passwordHash;
    if (updates.role) payload.role = updates.role;

    const { data: updated, error } = await supabase
      .from('admin_accounts')
      .update(payload)
      .eq('id', adminId)
      .select()
      .maybeSingle();

    if (error || !updated) return null;

    return {
      id: updated.id,
      username: updated.username,
      passwordHash: updated.password_hash,
      role: updated.role as 'admin' | 'superadmin',
      createdAt: updated.created_at,
    };
  } catch {
    return null;
  }
}

export async function deleteSupabaseAdmin(adminId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_accounts')
      .delete()
      .eq('id', adminId);

    return !error;
  } catch {
    return false;
  }
}
