export type OrderStatus = 'Processing' | 'Processed' | 'Failed' | 'Refunded';

export type PaymentMethod = 
  | 'Bitcoin (BTC)' 
  | 'USDT (TRC20)' 
  | 'Solana (SOL)' 
  | 'Credit / Debit Card' 
  | 'G2A Pay' 
  | 'Kinguin Voucher'
  | 'Apple Pay';

export interface Order {
  id: string;
  customerEmail: string;
  discordHandle?: string;
  gameId: string;
  gameName: string;
  planTier: '1-Day' | '7-Day' | '30-Day VIP' | 'Lifetime';
  amount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  licenseKey?: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
  txHash?: string;
  notes?: string;
}

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'Pending Staff' | 'Resolved';

export interface SupportTicket {
  id: string;
  orderId?: string;
  customerEmail: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  messages: {
    sender: 'customer' | 'staff';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}
