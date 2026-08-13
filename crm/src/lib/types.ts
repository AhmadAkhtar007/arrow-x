import type {
  PaymentMethod,
  PaymentStatus,
  FulfillmentStatus,
  OrderSnapshot,
  PaymentProof,
  PaymentSettings,
  Order,
} from '@arrowx/shared/orders';

export type {
  PaymentMethod,
  PaymentStatus,
  FulfillmentStatus,
  OrderSnapshot,
  PaymentProof,
  PaymentSettings,
  Order,
};

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  discordHandle?: string;
  discordId?: string;
  googleId?: string;
  hwid?: string;
  role: 'customer';
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export interface RealOrder {
  id: string;
  userId?: string;
  customerName?: string;
  customerEmail: string;
  discordHandle?: string;
  gameName: string;
  planTier: string;
  amount: number;
  paymentMethod: string;
  status: 'Pending' | 'Claimed' | 'Completed' | 'Cancelled';
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  product?: OrderSnapshot;
  proof?: PaymentProof;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  claimedBy?: string | null;
  claimedAt?: string | null;
  dispatchedBy?: string | null;
  dispatchedAt?: string | null;
  licenseKey?: string | null;
  downloadUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'staff';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface RealSupportTicket {
  id: string;
  orderId?: string;
  customerEmail: string;
  customerName?: string;
  discordHandle?: string;
  subject: string;
  status: 'Open' | 'Pending Staff' | 'HWID Approved' | 'Resolved';
  claimedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}
