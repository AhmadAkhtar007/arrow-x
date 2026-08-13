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
import { upsertSupabaseUser, upsertSupabaseOrder } from './supabaseDb';

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

// Initialize database with directory, seed Super Admin, and seed Payment Settings
export function initializeDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Admin123', salt);

    const initialDb: DatabaseSchema = {
      admins: [
        {
          id: 'admin_super_01',
          username: 'LivingLegend',
          passwordHash,
          role: 'superadmin',
          createdAt: new Date().toISOString(),
        }
      ],
      users: [],
      orders: [],
      tickets: [],
      paymentSettings: DEFAULT_PAYMENT_SETTINGS,
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    let mutated = false;
    
    // Ensure Super Admin exists
    const hasSuperAdmin = parsed.admins?.some((a: AdminAccount) => a.username.toLowerCase() === 'livinglegend');
    if (!hasSuperAdmin) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('Admin123', salt);
      if (!parsed.admins) parsed.admins = [];
      parsed.admins.push({
        id: 'admin_super_01',
        username: 'LivingLegend',
        passwordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      });
      mutated = true;
    }

    if (!parsed.paymentSettings) {
      parsed.paymentSettings = DEFAULT_PAYMENT_SETTINGS;
      mutated = true;
    } else if (!Array.isArray(parsed.paymentSettings.giftCardLinks) || parsed.paymentSettings.giftCardLinks.length === 0) {
      parsed.paymentSettings.giftCardLinks = createCatalogGiftCardLinks();
      mutated = true;
    }

    if (mutated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }

    return parsed;
  } catch (error) {
    console.error('Error reading database, creating fresh structure:', error);
    const initialDb: DatabaseSchema = {
      admins: [],
      users: [],
      orders: [],
      tickets: [],
      paymentSettings: DEFAULT_PAYMENT_SETTINGS,
    };
    return initialDb;
  }
}

// Atomic Thread-Safe DB Writer
function writeDb(data: DatabaseSchema) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
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
  const db = initializeDatabase();
  return db.admins;
}

export async function getAdminByUsername(username: string): Promise<AdminAccount | null> {
  const db = initializeDatabase();
  return db.admins.find((a) => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function getAdminById(id: string): Promise<AdminAccount | null> {
  const db = initializeDatabase();
  return db.admins.find((a) => a.id === id) || null;
}

export async function createAdmin(data: {
  username: string;
  password: string;
  role: 'admin' | 'superadmin';
}): Promise<AdminAccount> {
  const db = initializeDatabase();
  const existing = db.admins.find(
    (a) => a.username.toLowerCase() === data.username.toLowerCase()
  );
  if (existing) {
    throw new Error('An admin with this username already exists.');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
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
  const db = initializeDatabase();
  const initialCount = db.admins.length;
  db.admins = db.admins.filter((a) => a.id !== adminId && a.role !== 'superadmin');
  if (db.admins.length !== initialCount) {
    writeDb(db);
    return true;
  }
  return false;
}

export async function updateAdminProfile(
  adminId: string, 
  updates: { username?: string; password?: string }
): Promise<AdminAccount | null> {
  const db = initializeDatabase();
  const index = db.admins.findIndex((a) => a.id === adminId);
  if (index === -1) return null;

  if (updates.username) db.admins[index].username = updates.username;
  if (updates.password) {
    db.admins[index].passwordHash = await bcrypt.hash(updates.password, 10);
  }

  writeDb(db);
  return db.admins[index];
}

// --- CUSTOMER / OTP OPERATIONS ---
export async function getUsers(): Promise<UserAccount[]> {
  const db = initializeDatabase();
  return db.users;
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const db = initializeDatabase();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<UserAccount | null> {
  const db = initializeDatabase();
  return db.users.find((u) => u.id === id) || null;
}

export async function generateCustomerOtp(email: string, name?: string): Promise<{ otpCode: string; isNewUser: boolean }> {
  const db = initializeDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const index = db.users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
  let isNewUser = false;

  if (index >= 0) {
    db.users[index].otpCode = otpCode;
    db.users[index].otpExpiresAt = expiresAt;
    writeDb(db);
    upsertSupabaseUser(db.users[index]).catch(() => {});
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
    upsertSupabaseUser(newUser).catch(() => {});
  }

  return { otpCode, isNewUser };
}

export async function verifyCustomerOtp(
  email: string, 
  code: string, 
  name?: string, 
  discordHandle?: string
): Promise<UserAccount> {
  const db = initializeDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const index = db.users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    throw new Error('Account not found. Please request a new verification code.');
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

  db.users[index] = user;
  writeDb(db);
  upsertSupabaseUser(user).catch(() => {});
  return user;
}

export async function createUser(data: {
  email: string;
  name?: string;
  username?: string;
  discordHandle?: string;
}): Promise<UserAccount> {
  const db = initializeDatabase();
  const name = data.name || data.username || data.email.split('@')[0];
  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    email: data.email.toLowerCase(),
    username: name.toLowerCase().replace(/\s+/g, '_'),
    discordHandle: data.discordHandle,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDb(db);
  upsertSupabaseUser(newUser).catch(() => {});
  return newUser;
}

export async function upsertOAuthCustomer(data: {
  email: string;
  name: string;
  provider: 'google' | 'discord';
  providerId: string;
  discordHandle?: string;
}): Promise<UserAccount> {
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
    upsertSupabaseUser(user).catch(() => {});
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
  upsertSupabaseUser(user).catch(() => {});
  return user;
}

export async function updateCustomerProfile(
  userId: string, 
  updates: { name?: string; username?: string; discordHandle?: string; hwid?: string }
): Promise<UserAccount | null> {
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
export async function getTickets(): Promise<RealSupportTicket[]> {
  const db = initializeDatabase();
  return db.tickets;
}

export async function getTicketById(id: string): Promise<RealSupportTicket | null> {
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
  const db = initializeDatabase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `TCK-${randomNum}`;

  const now = new Date();
  const timeFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
                        now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const newTicket: RealSupportTicket = {
    id: ticketId,
    orderId: data.orderId,
    customerEmail: data.customerEmail,
    customerName: data.customerName || data.customerEmail.split('@')[0],
    discordHandle: data.discordHandle,
    subject: data.subject,
    status: 'Open',
    createdAt: timeFormatted,
    updatedAt: 'Just now',
    messages: [
      {
        id: `msg_${Date.now()}`,
        sender: 'customer',
        senderName: data.customerName || 'Customer',
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

  if (message.sender === 'staff') {
    db.tickets[index].status = 'Open';
  } else {
    db.tickets[index].status = 'Pending Staff';
  }

  db.tickets[index].updatedAt = 'Just now';
  writeDb(db);
  return db.tickets[index];
}

export async function updateTicketStatus(
  ticketId: string, 
  status: 'Open' | 'Pending Staff' | 'HWID Approved' | 'Resolved', 
  staffName?: string
): Promise<RealSupportTicket | null> {
  const db = initializeDatabase();
  const index = db.tickets.findIndex((t) => t.id.toLowerCase() === ticketId.toLowerCase());
  if (index === -1) return null;

  db.tickets[index].status = status;
  if (staffName) db.tickets[index].claimedBy = staffName;
  db.tickets[index].updatedAt = 'Just now';

  writeDb(db);
  return db.tickets[index];
}

export const addTicketMessage = addMessageToTicket;

export async function approveHwidReset(ticketId: string, staffName: string): Promise<RealSupportTicket | null> {
  return updateTicketStatus(ticketId, 'HWID Approved', staffName);
}
