export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          username: string;
          role: 'customer' | 'admin' | 'superadmin';
          discord_handle: string | null;
          hwid: string | null;
          otp_code: string | null;
          otp_expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          username?: string;
          role?: 'customer' | 'admin' | 'superadmin';
          discord_handle?: string | null;
          hwid?: string | null;
          otp_code?: string | null;
          otp_expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          username?: string;
          role?: 'customer' | 'admin' | 'superadmin';
          discord_handle?: string | null;
          hwid?: string | null;
          otp_code?: string | null;
          otp_expires_at?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_email: string;
          customer_name: string;
          customer_discord: string | null;
          customer_hwid: string | null;
          game_id: string;
          game_name: string;
          plan_tier: string;
          amount: number;
          currency: string;
          payment_method: 'CRYPTO' | 'GIFT_CARD' | 'CREDIT_CARD';
          crypto_currency: string | null;
          crypto_tx_id: string | null;
          gift_card_code: string | null;
          gift_card_pin: string | null;
          payment_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
          fulfillment_status: 'UNCLAIMED' | 'CLAIMED' | 'DISPATCHED';
          license_key: string | null;
          rejection_reason: string | null;
          assigned_agent_id: string | null;
          assigned_agent_name: string | null;
          locked_by_agent_id: string | null;
          locked_at: string | null;
          created_at: string;
          verified_at: string | null;
          dispatched_at: string | null;
        };
        Insert: {
          id: string;
          customer_email: string;
          customer_name: string;
          customer_discord?: string | null;
          customer_hwid?: string | null;
          game_id: string;
          game_name: string;
          plan_tier: string;
          amount: number;
          currency?: string;
          payment_method: 'CRYPTO' | 'GIFT_CARD' | 'CREDIT_CARD';
          crypto_currency?: string | null;
          crypto_tx_id?: string | null;
          gift_card_code?: string | null;
          gift_card_pin?: string | null;
          payment_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
          fulfillment_status?: 'UNCLAIMED' | 'CLAIMED' | 'DISPATCHED';
          license_key?: string | null;
          rejection_reason?: string | null;
          assigned_agent_id?: string | null;
          assigned_agent_name?: string | null;
          locked_by_agent_id?: string | null;
          locked_at?: string | null;
          created_at?: string;
          verified_at?: string | null;
          dispatched_at?: string | null;
        };
        Update: {
          id?: string;
          customer_email?: string;
          customer_name?: string;
          customer_discord?: string | null;
          customer_hwid?: string | null;
          game_id?: string;
          game_name?: string;
          plan_tier?: string;
          amount?: number;
          currency?: string;
          payment_method?: 'CRYPTO' | 'GIFT_CARD' | 'CREDIT_CARD';
          crypto_currency?: string | null;
          crypto_tx_id?: string | null;
          gift_card_code?: string | null;
          gift_card_pin?: string | null;
          payment_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
          fulfillment_status?: 'UNCLAIMED' | 'CLAIMED' | 'DISPATCHED';
          license_key?: string | null;
          rejection_reason?: string | null;
          assigned_agent_id?: string | null;
          assigned_agent_name?: string | null;
          locked_by_agent_id?: string | null;
          locked_at?: string | null;
          created_at?: string;
          verified_at?: string | null;
          dispatched_at?: string | null;
        };
      };
      support_tickets: {
        Row: {
          id: string;
          order_id: string | null;
          customer_email: string;
          customer_name: string;
          discord_handle: string | null;
          subject: string;
          status: 'Open' | 'Resolved' | 'Pending User';
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          order_id?: string | null;
          customer_email: string;
          customer_name: string;
          discord_handle?: string | null;
          subject: string;
          status?: 'Open' | 'Resolved' | 'Pending User';
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          customer_email?: string;
          customer_name?: string;
          discord_handle?: string | null;
          subject?: string;
          status?: 'Open' | 'Resolved' | 'Pending User';
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_role: 'customer' | 'agent';
          sender_name: string;
          text: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_role: 'customer' | 'agent';
          sender_name: string;
          text: string;
          timestamp?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          sender_role?: 'customer' | 'agent';
          sender_name?: string;
          text?: string;
          timestamp?: string;
        };
      };
      admin_accounts: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          role: 'admin' | 'superadmin';
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          role?: 'admin' | 'superadmin';
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          role?: 'admin' | 'superadmin';
          created_at?: string;
        };
      };
      payment_settings: {
        Row: {
          id: string;
          btc_address: string;
          btc_qr_url: string | null;
          sol_address: string;
          sol_qr_url: string | null;
          usdt_trc20_address: string;
          usdt_trc20_qr_url: string | null;
          gift_card_links: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          btc_address: string;
          btc_qr_url?: string | null;
          sol_address: string;
          sol_qr_url?: string | null;
          usdt_trc20_address: string;
          usdt_trc20_qr_url?: string | null;
          gift_card_links: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          btc_address?: string;
          btc_qr_url?: string | null;
          sol_address?: string;
          sol_qr_url?: string | null;
          usdt_trc20_address?: string;
          usdt_trc20_qr_url?: string | null;
          gift_card_links?: Json;
          updated_at?: string;
        };
      };
    };
  };
}
