import fs from 'fs';
import path from 'path';
import { 
  UserAccount, 
  AdminAccount, 
  RealOrder, 
  RealSupportTicket, 
  PaymentSettings,
  PaymentMethod,
  PaymentStatus,
  FulfillmentStatus,
  OrderSnapshot,
  PaymentProof
} from './types';
import bcrypt from 'bcryptjs';
import { createCatalogGiftCardLinks } from '@arrowx/shared/orders';
import { 
  upsertSupabaseUser, 
  upsertSupabaseOrder, 
  getSupabaseUsers, 
  getSupabaseUserByEmail, 
  getSupabaseUserById,
  generateSupabaseOtp, 
  verifySupabaseOtp, 
  upsertSupabaseOAuthCustomer,
  updateSupabaseCustomerProfile,
  getSupabaseAdmins,
  getSupabaseAdminByUsername,
  getSupabaseAdminById,
  createSupabaseAdmin,
  updateSupabaseAdminProfile,
  deleteSupabaseAdmin,
  deleteSupabaseUser,
  getSupabaseTickets,
  getSupabaseTicketById,
  createSupabaseTicket,
  addSupabaseTicketMessage,
  updateSupabaseTicketStatus
} from './supabaseDb';

interface DatabaseSchema {
  admins: AdminAccount[];
  users: UserAccount[];
  orders: RealOrder[];
  tickets: RealSupportTicket[];
  paymentSettings: PaymentSettings;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'arrowx-db.json');

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  btcAddress: '156uWuAoK4MZpZGcJcXeZ4pvqetc8zrsdA',
  btcQrUrl: '/assets/payments/btc.png',
  solAddress: '6Thyxoq4WwyobyTepmiqxN6n2JpQfsFfwQpz9c1gv6m8',
  solQrUrl: '/assets/payments/sol.png',
  usdtTrc20Address: 'THYKE8YXanrBSCvFtiihVLYstNNprKUhoC',
  usdtTrc20QrUrl: '/assets/payments/usdt-trc20.png',
  giftCardLinks: createCatalogGiftCardLinks(),
};

function normalizeOrder(order: any): RealOrder {
  const paymentStatus: PaymentStatus = order.paymentStatus || 
    (order.status === 'Completed' ? 'VERIFIED' : 'VERIFICATION_PENDING');

  let fulfillmentStatus: FulfillmentStatus = order.fulfillmentStatus || 'PENDING';
  if (!order.fulfillmentStatus) {
    if (order.status === 'Completed') fulfillmentStatus = 'DISPATCHED';
    else if (order.status === 'Claimed') fulfillmentStatus = 'CLAIMED';
    else fulfillmentStatus = 'PENDING';
  }

  const legacyGame = order.gameName || 'Custom Product';
  const legacyTier = order.planTier || 'Standard';
  const amount = Number(order.amount ?? order.product?.amountUsd ?? 0);

  const productSnapshot: OrderSnapshot = order.product || {
    productId: legacyGame.toLowerCase().replace(/\s+/g, '-'),
    productName: legacyGame,
    variantId: 'standard',
    variantName: legacyTier,
    offerId: 'standard',
    offerLabel: legacyTier,
    amountUsd: amount,
  };

  const status = fulfillmentStatus === 'DISPATCHED' ? 'Completed' : 
                 fulfillmentStatus === 'CLAIMED' ? 'Claimed' : 'Pending';

  return {
    ...order,
    amount,
    gameName: productSnapshot.productName,
    planTier: `${productSnapshot.variantName} (${productSnapshot.offerLabel})`,
    status,
    paymentStatus,
    fulfillmentStatus,
    product: productSnapshot,
    proof: order.proof || {},
  };
}

// Default in-memory baseline schema
function createBaselineDatabase(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Admin123', salt);
  return {
    admins: [
      {
        id: 'adm_super_01',
        username: 'LivingLegend',
        passwordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'adm_super_02',
        username: 'Mimester',
        passwordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'adm_super_03',
        username: 'Rapz',
        passwordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'adm_super_04',
        username: 'Gadhzi',
        passwordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      },
    ],
    users: [],
    orders: [],
    tickets: [],
    paymentSettings: DEFAULT_PAYMENT_SETTINGS,
  };
}

// Initialize database with directory, seed Super Admins, and seed Payment Settings (Serverless / Read-Only Safe)
export function initializeDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      try {
        fs.mkdirSync(DB_DIR, { recursive: true });
      } catch {}
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb = createBaselineDatabase();
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      } catch {}
      return initialDb;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    let mutated = false;
    
    // Ensure all 4 Super Admins exist
    const defaultSuperadmins = [
      { id: 'adm_super_01', username: 'LivingLegend' },
      { id: 'adm_super_02', username: 'Mimester' },
      { id: 'adm_super_03', username: 'Rapz' },
      { id: 'adm_super_04', username: 'Gadhzi' },
    ];

    if (!parsed.admins) parsed.admins = [];
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Admin123', salt);

    for (const superadmin of defaultSuperadmins) {
      const exists = parsed.admins.some((a: AdminAccount) => a.username.toLowerCase() === superadmin.username.toLowerCase());
      if (!exists) {
        parsed.admins.push({
          id: superadmin.id,
          username: superadmin.username,
          passwordHash,
          role: 'superadmin',
          createdAt: new Date().toISOString(),
        });
        mutated = true;
      }
    }

    if (!parsed.paymentSettings) {
      parsed.paymentSettings = DEFAULT_PAYMENT_SETTINGS;
      mutated = true;
    } else if (!Array.isArray(parsed.paymentSettings.giftCardLinks) || parsed.paymentSettings.giftCardLinks.length === 0) {
      parsed.paymentSettings.giftCardLinks = createCatalogGiftCardLinks();
      mutated = true;
    }

    if (mutated) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      } catch {}
    }

    return parsed;
  } catch {
    return createBaselineDatabase();
  }
}

// Atomic Thread-Safe DB Writer (Safeguarded for Read-Only / Serverless Runtimes)
function writeDb(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // Cloudflare Pages and Edge runtimes have read-only filesystems.
    // Supabase PostgreSQL handles real-time cloud persistence.
  }
}

// --- PAYMENT SETTINGS OPERATIONS ---
export async function getPaymentSettings(): Promise<PaymentSettings> {
  const db = initializeDatabase();
  return db.paymentSettings || DEFAULT_PAYMENT_SETTINGS;
}

export async function updatePaymentSettings(updates: Partial<PaymentSettings>): Promise<PaymentSettings> {
  const db = initializeDatabase();
  db.paymentSettings = {
    ...(db.paymentSettings || DEFAULT_PAYMENT_SETTINGS),
    ...updates,
  };
  writeDb(db);
  return db.paymentSettings;
}

// --- ADMIN OPERATIONS ---
export async function getAdmins(): Promise<AdminAccount[]> {
  try {
    const admins = await getSupabaseAdmins();
    if (admins && admins.length > 0) return admins;
  } catch {}
  const db = initializeDatabase();
  return db.admins;
}

export async function getAdminByUsername(username: string): Promise<AdminAccount | null> {
  try {
    const admin = await getSupabaseAdminByUsername(username);
    if (admin) return admin;
  } catch {}
  const db = initializeDatabase();
  return db.admins.find((a) => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function getAdminById(id: string): Promise<AdminAccount | null> {
  try {
    const admin = await getSupabaseAdminById(id);
    if (admin) return admin;
  } catch {}
  const db = initializeDatabase();
  return db.admins.find((a) => a.id === id) || null;
}

export async function createAdmin(data: {
  username: string;
  password: string;
  role: 'admin' | 'superadmin';
}): Promise<AdminAccount> {
  const passwordHash = await bcrypt.hash(data.password, 10);
  try {
    return await createSupabaseAdmin({
      username: data.username,
      passwordHash,
      role: data.role,
    });
  } catch (err) {
    console.warn('[DB] Supabase createAdmin fallback to local:', err);
  }

  const db = initializeDatabase();
  const existing = db.admins.find(
    (a) => a.username.toLowerCase() === data.username.toLowerCase()
  );
  if (existing) {
    throw new Error('An admin with this username already exists.');
  }

  const newAdmin: AdminAccount = {
    id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: data.username,
    passwordHash,
    role: data.role,
    createdAt: new Date().toISOString(),
  };

  db.admins.push(newAdmin);
  writeDb(db);
  return newAdmin;
}

export async function deleteAdmin(adminId: string): Promise<boolean> {
  try {
    await deleteSupabaseAdmin(adminId);
  } catch (err) {
    console.warn('[DB] Supabase deleteAdmin fallback:', err);
  }

  const db = initializeDatabase();
  const initialCount = db.admins.length;
  db.admins = db.admins.filter((a) => a.id !== adminId);
  if (db.admins.length !== initialCount) {
    writeDb(db);
    return true;
  }
  return true;
}

export async function updateAdminProfile(
  adminId: string, 
  updates: { username?: string; password?: string; role?: 'admin' | 'superadmin' }
): Promise<AdminAccount | null> {
  let passwordHash: string | undefined;
  if (updates.password) {
    passwordHash = await bcrypt.hash(updates.password, 10);
  }

  try {
    const updated = await updateSupabaseAdminProfile(adminId, {
      username: updates.username,
      passwordHash,
      role: updates.role,
    });
    if (updated) return updated;
  } catch (err) {
    console.warn('[DB] Supabase updateAdminProfile fallback to local:', err);
  }

  const db = initializeDatabase();
  const index = db.admins.findIndex((a) => a.id === adminId);
  if (index === -1) return null;

  if (updates.username) db.admins[index].username = updates.username;
  if (updates.role) db.admins[index].role = updates.role;
  if (passwordHash) db.admins[index].passwordHash = passwordHash;

  writeDb(db);
  return db.admins[index];
}

// --- CUSTOMER / OTP OPERATIONS ---
export async function getUsers(): Promise<UserAccount[]> {
  const supabaseUsers = await getSupabaseUsers();
  if (supabaseUsers && supabaseUsers.length > 0) return supabaseUsers;
  const db = initializeDatabase();
  return db.users;
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabaseUser = await getSupabaseUserByEmail(normalizedEmail);
  if (supabaseUser) return supabaseUser;
  const db = initializeDatabase();
  return db.users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
}

export async function getUserById(id: string): Promise<UserAccount | null> {
  const supabaseUser = await getSupabaseUserById(id);
  if (supabaseUser) return supabaseUser;
  const db = initializeDatabase();
  return db.users.find((u) => u.id === id) || null;
}

export async function generateCustomerOtp(email: string, name?: string): Promise<{ otpCode: string; isNewUser: boolean }> {
  try {
    const res = await generateSupabaseOtp(email, name);
    return { otpCode: res.otpCode, isNewUser: res.isNewUser };
  } catch (err) {
    console.warn('[DB] Supabase OTP generation fallback:', err);
    const db = initializeDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const index = db.users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
    let isNewUser = false;

    if (index >= 0) {
      db.users[index].otpCode = otpCode;
      db.users[index].otpExpiresAt = expiresAt;
      writeDb(db);
    } else {
      isNewUser = true;
      const defaultName = name || normalizedEmail.split('@')[0];
      const newUser: UserAccount = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: defaultName,
        email: normalizedEmail,
        username: defaultName.toLowerCase().replace(/\s+/g, '_'),
        role: 'customer',
        otpCode,
        otpExpiresAt: expiresAt,
        createdAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      writeDb(db);
    }
    return { otpCode, isNewUser };
  }
}

export async function verifyCustomerOtp(
  email: string, 
  code: string, 
  name?: string, 
  discordHandle?: string
): Promise<UserAccount> {
  try {
    return await verifySupabaseOtp(email, code, name, discordHandle);
  } catch (err: any) {
    const db = initializeDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const index = db.users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

    if (index === -1) {
      throw new Error(err?.message || 'Account not found. Please request a new verification code.');
    }

    const user = db.users[index];

    if (!user.otpCode || user.otpCode !== code.trim()) {
      throw new Error('Invalid verification code. Please check your email and try again.');
    }

    if (user.otpExpiresAt && new Date() > new Date(user.otpExpiresAt)) {
      throw new Error('Verification code has expired. Please request a new code.');
    }

    user.otpCode = null;
    user.otpExpiresAt = null;
    if (name?.trim()) user.name = name.trim();
    if (discordHandle?.trim()) user.discordHandle = discordHandle.trim();

    db.users[index] = user;
    writeDb(db);
    return user;
  }
}

export async function createUser(data: {
  email: string;
  name?: string;
  username?: string;
  discordHandle?: string;
}): Promise<UserAccount> {
  const defaultName = data.name || data.username || data.email.split('@')[0];
  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: defaultName,
    email: data.email.toLowerCase().trim(),
    username: defaultName.toLowerCase().replace(/\s+/g, '_'),
    discordHandle: data.discordHandle,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  await upsertSupabaseUser(newUser).catch(() => {});
  const db = initializeDatabase();
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export async function upsertOAuthCustomer(data: {
  email: string;
  name: string;
  provider: 'google' | 'discord';
  providerId: string;
  discordHandle?: string;
}): Promise<UserAccount> {
  try {
    return await upsertSupabaseOAuthCustomer(data);
  } catch (err) {
    console.warn('[DB] Supabase OAuth customer fallback:', err);
    const db = initializeDatabase();
    const normalizedEmail = data.email.trim().toLowerCase();
    const index = db.users.findIndex((user) => user.email.toLowerCase() === normalizedEmail);

    if (index >= 0) {
      const user = db.users[index];
      if (data.provider === 'google') user.googleId = data.providerId;
      if (data.provider === 'discord') {
        user.discordId = data.providerId;
        if (!user.discordHandle && data.discordHandle) user.discordHandle = data.discordHandle;
      }
      writeDb(db);
      return user;
    }

    const name = data.name.trim() || normalizedEmail.split('@')[0];
    const user: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: normalizedEmail,
      username: name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
      role: 'customer',
      discordHandle: data.discordHandle,
      discordId: data.provider === 'discord' ? data.providerId : undefined,
      googleId: data.provider === 'google' ? data.providerId : undefined,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    writeDb(db);
    return user;
  }
}

export async function updateCustomerProfile(
  userId: string, 
  updates: { name?: string; username?: string; discordHandle?: string; hwid?: string }
): Promise<UserAccount | null> {
  try {
    const supabaseUpdated = await updateSupabaseCustomerProfile(userId, updates);
    if (supabaseUpdated) return supabaseUpdated;
  } catch (err) {
    console.warn('[DB] Supabase profile update error, falling back to local:', err);
  }

  const db = initializeDatabase();
  const index = db.users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  if (updates.name) db.users[index].name = updates.name;
  if (updates.username) db.users[index].username = updates.username;
  if (updates.discordHandle !== undefined) db.users[index].discordHandle = updates.discordHandle;
  if (updates.hwid !== undefined) db.users[index].hwid = updates.hwid;

  writeDb(db);
  return db.users[index];
}

export async function deleteCustomer(userId: string): Promise<boolean> {
  try {
    await deleteSupabaseUser(userId);
  } catch (err) {
    console.warn('[DB] Supabase deleteCustomer fallback:', err);
  }

  const db = initializeDatabase();
  const initialCount = db.users.length;
  db.users = db.users.filter((u) => u.id !== userId && u.email.toLowerCase() !== userId.toLowerCase());
  if (db.users.length !== initialCount) {
    writeDb(db);
  }
  return true;
}

// --- ORDER OPERATIONS ---
export async function getOrders(): Promise<RealOrder[]> {
  const db = initializeDatabase();
  return db.orders.map(normalizeOrder);
}

export async function getOrdersByCustomerEmail(email: string): Promise<RealOrder[]> {
  const db = initializeDatabase();
  return db.orders
    .filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase())
    .map(normalizeOrder);
}

export async function getOrderById(id: string): Promise<RealOrder | null> {
  const db = initializeDatabase();
  const order = db.orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  return order ? normalizeOrder(order) : null;
}

export async function createOrder(data: {
  userId?: string;
  customerName?: string;
  customerEmail: string;
  discordHandle?: string;
  product: OrderSnapshot;
  paymentMethod: PaymentMethod;
  proof: PaymentProof;
  notes?: string;
}): Promise<RealOrder> {
  const db = initializeDatabase();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `AX-${randomNum}`;

  const now = new Date();
  const timeFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
                        now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const newOrder: RealOrder = {
    id: orderId,
    userId: data.userId,
    customerName: data.customerName || data.customerEmail.split('@')[0],
    customerEmail: data.customerEmail,
    discordHandle: data.discordHandle,
    gameName: data.product.productName,
    planTier: `${data.product.variantName} (${data.product.offerLabel})`,
    amount: data.product.amountUsd,
    paymentMethod: data.paymentMethod,
    status: 'Pending',
    paymentStatus: 'VERIFICATION_PENDING',
    fulfillmentStatus: 'PENDING',
    product: data.product,
    proof: data.proof,
    createdAt: timeFormatted,
    updatedAt: 'Just now',
    notes: data.notes,
  };

  db.orders.unshift(newOrder);
  writeDb(db);
  upsertSupabaseOrder(newOrder).catch(() => {});
  return normalizeOrder(newOrder);
}

// Staff Verifies Manual Payment
export async function verifyOrder(orderId: string, adminName: string): Promise<RealOrder | null> {
  const db = initializeDatabase();
  const index = db.orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());
  if (index === -1) return null;

  const nowFormatted = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  db.orders[index].paymentStatus = 'VERIFIED';
  db.orders[index].verifiedBy = adminName;
  db.orders[index].verifiedAt = nowFormatted;
  db.orders[index].rejectionReason = undefined;
  db.orders[index].updatedAt = 'Just now';

  writeDb(db);
  const normalized = normalizeOrder(db.orders[index]);
  upsertSupabaseOrder(normalized).catch(() => {});
  return normalized;
}

// Staff Rejects Manual Payment
export async function rejectOrder(orderId: string, adminName: string, reason: string): Promise<RealOrder | null> {
  const db = initializeDatabase();
  const index = db.orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());
  if (index === -1) return null;

  const nowFormatted = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  db.orders[index].paymentStatus = 'REJECTED';
  db.orders[index].rejectionReason = reason.trim();
  db.orders[index].verifiedBy = adminName;
  db.orders[index].verifiedAt = nowFormatted;
  db.orders[index].updatedAt = 'Just now';

  writeDb(db);
  const normalized = normalizeOrder(db.orders[index]);
  upsertSupabaseOrder(normalized).catch(() => {});
  return normalized;
}

// Admin Claims Order (Acquiring key) — ONLY IF PAYMENT IS VERIFIED
export async function claimOrder(orderId: string, adminName: string): Promise<RealOrder | null> {
  const db = initializeDatabase();
  const index = db.orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());
  if (index === -1) return null;

  const current = normalizeOrder(db.orders[index]);
  if (current.paymentStatus !== 'VERIFIED') {
    throw new Error('Cannot claim order: manual payment has not been verified.');
  }

  db.orders[index].status = 'Claimed';
  db.orders[index].fulfillmentStatus = 'CLAIMED';
  db.orders[index].claimedBy = adminName;
  db.orders[index].claimedAt = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  db.orders[index].updatedAt = 'Just now';

  writeDb(db);
  const normalized = normalizeOrder(db.orders[index]);
  upsertSupabaseOrder(normalized).catch(() => {});
  return normalized;
}

// Admin Unclaims Order
export async function unclaimOrder(orderId: string): Promise<RealOrder | null> {
  const db = initializeDatabase();
  const index = db.orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());
  if (index === -1) return null;

  db.orders[index].status = 'Pending';
  db.orders[index].fulfillmentStatus = 'PENDING';
  db.orders[index].claimedBy = null;
  db.orders[index].claimedAt = null;
  db.orders[index].updatedAt = 'Just now';

  writeDb(db);
  const normalized = normalizeOrder(db.orders[index]);
  upsertSupabaseOrder(normalized).catch(() => {});
  return normalized;
}

// Admin Dispatches Key to Customer — ONLY IF PAYMENT IS VERIFIED
export async function dispatchOrder(
  orderId: string, 
  licenseKey: string, 
  adminName: string, 
  notes?: string
): Promise<RealOrder | null> {
  const db = initializeDatabase();
  const index = db.orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());
  if (index === -1) return null;

  const current = normalizeOrder(db.orders[index]);
  if (current.paymentStatus !== 'VERIFIED') {
    throw new Error('Cannot dispatch order: manual payment has not been verified.');
  }

  db.orders[index].status = 'Completed';
  db.orders[index].fulfillmentStatus = 'DISPATCHED';
  db.orders[index].licenseKey = licenseKey.trim();
  db.orders[index].dispatchedBy = adminName;
  db.orders[index].dispatchedAt = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  db.orders[index].updatedAt = 'Just now';
  if (notes) db.orders[index].notes = notes;

  writeDb(db);
  const normalized = normalizeOrder(db.orders[index]);
  upsertSupabaseOrder(normalized).catch(() => {});
  return normalized;
}

export async function lockOrderForAdmin(orderId: string, adminId: string, adminName: string): Promise<RealOrder | null> {
  return claimOrder(orderId, adminName);
}

// --- SUPPORT TICKETS OPERATIONS ---
export async function getTickets(customerEmail?: string): Promise<RealSupportTicket[]> {
  try {
    const supabaseTickets = await getSupabaseTickets(customerEmail);
    if (supabaseTickets && supabaseTickets.length > 0) return supabaseTickets;
  } catch (err) {
    console.warn('[DB] Supabase getTickets fallback:', err);
  }

  const db = initializeDatabase();
  if (customerEmail) {
    return db.tickets.filter((t) => t.customerEmail.toLowerCase() === customerEmail.toLowerCase());
  }
  return db.tickets;
}

export async function getTicketById(id: string): Promise<RealSupportTicket | null> {
  try {
    const supabaseTicket = await getSupabaseTicketById(id);
    if (supabaseTicket) return supabaseTicket;
  } catch (err) {
    console.warn('[DB] Supabase getTicketById fallback:', err);
  }

  const db = initializeDatabase();
  return db.tickets.find((t) => t.id.toLowerCase() === id.toLowerCase()) || null;
}

export async function createTicket(data: {
  orderId?: string;
  customerEmail: string;
  customerName?: string;
  discordHandle?: string;
  subject: string;
  initialMessage: string;
}): Promise<RealSupportTicket> {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const ticketId = `ARX-${randomNum}`;
  const now = new Date();
  const timeFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
                        now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const customerName = data.customerName || data.customerEmail.split('@')[0];

  try {
    const supabaseCreated = await createSupabaseTicket({
      id: ticketId,
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      customerName,
      discordHandle: data.discordHandle,
      subject: data.subject,
      initialMessage: data.initialMessage,
    });
    if (supabaseCreated) return supabaseCreated;
  } catch (err) {
    console.warn('[DB] Supabase createTicket fallback:', err);
  }

  const db = initializeDatabase();
  const newTicket: RealSupportTicket = {
    id: ticketId,
    orderId: data.orderId,
    customerEmail: data.customerEmail,
    customerName,
    discordHandle: data.discordHandle,
    subject: data.subject,
    status: 'Open',
    createdAt: timeFormatted,
    updatedAt: 'Just now',
    messages: [
      {
        id: `msg_${Date.now()}`,
        sender: 'customer',
        senderName: customerName,
        text: data.initialMessage,
        timestamp: timeFormatted,
      }
    ],
  };

  db.tickets.unshift(newTicket);
  writeDb(db);
  return newTicket;
}

export async function addMessageToTicket(
  ticketId: string, 
  message: { sender: 'customer' | 'staff'; senderName: string; text: string }
): Promise<RealSupportTicket | null> {
  const newStatus = message.sender === 'staff' ? 'Open' : 'Pending Staff';

  try {
    const supabaseUpdated = await addSupabaseTicketMessage(ticketId, message, newStatus);
    if (supabaseUpdated) return supabaseUpdated;
  } catch (err) {
    console.warn('[DB] Supabase addTicketMessage fallback:', err);
  }

  const db = initializeDatabase();
  const index = db.tickets.findIndex((t) => t.id.toLowerCase() === ticketId.toLowerCase());
  if (index === -1) return null;

  const now = new Date();
  const timeFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
                        now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  db.tickets[index].messages.push({
    id: `msg_${Date.now()}`,
    sender: message.sender,
    senderName: message.senderName,
    text: message.text,
    timestamp: timeFormatted,
  });

  db.tickets[index].status = newStatus as any;
  db.tickets[index].updatedAt = 'Just now';
  writeDb(db);
  return db.tickets[index];
}

export async function updateTicketStatus(
  ticketId: string, 
  status: 'Open' | 'Pending Staff' | 'HWID Approved' | 'Resolved' | 'Closed', 
  staffName?: string
): Promise<RealSupportTicket | null> {
  try {
    const supabaseUpdated = await updateSupabaseTicketStatus(ticketId, status, staffName);
    if (supabaseUpdated) return supabaseUpdated;
  } catch (err) {
    console.warn('[DB] Supabase updateTicketStatus fallback:', err);
  }

  const db = initializeDatabase();
  const index = db.tickets.findIndex((t) => t.id.toLowerCase() === ticketId.toLowerCase());
  if (index === -1) return null;

  db.tickets[index].status = status as any;
  if (staffName) db.tickets[index].claimedBy = staffName;
  db.tickets[index].updatedAt = 'Just now';

  writeDb(db);
  return db.tickets[index];
}

export const addTicketMessage = addMessageToTicket;

export async function approveHwidReset(ticketId: string, staffName: string): Promise<RealSupportTicket | null> {
  return updateTicketStatus(ticketId, 'HWID Approved', staffName);
}
