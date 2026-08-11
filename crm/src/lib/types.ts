export interface UserAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  discordHandle?: string;
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
  claimedBy?: string | null;
  claimedAt?: string | null;
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
  category: 'HWID Reset' | 'Key Issue' | 'Injection Error' | 'General Question';
  subject: string;
  status: 'Open' | 'Pending Staff' | 'HWID Approved' | 'Resolved';
  claimedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}
