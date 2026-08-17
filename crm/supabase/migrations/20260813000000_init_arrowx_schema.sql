-- ====================================================================
-- ArrowX Database Schema Migration for Supabase (PostgreSQL)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS (Customer Accounts)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'superadmin')),
  discord_handle TEXT,
  hwid TEXT,
  otp_code TEXT,
  otp_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (lower(email));
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at DESC);

-- 3. ADMIN ACCOUNTS
CREATE TABLE IF NOT EXISTS public.admin_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_username ON public.admin_accounts (lower(username));

-- 4. ORDERS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_discord TEXT,
  customer_hwid TEXT,
  game_id TEXT NOT NULL,
  game_name TEXT NOT NULL,
  plan_tier TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CRYPTO', 'GIFT_CARD', 'CREDIT_CARD')),
  crypto_currency TEXT,
  crypto_tx_id TEXT,
  gift_card_code TEXT,
  gift_card_pin TEXT,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  fulfillment_status TEXT NOT NULL DEFAULT 'UNCLAIMED' CHECK (fulfillment_status IN ('UNCLAIMED', 'CLAIMED', 'DISPATCHED')),
  license_key TEXT,
  rejection_reason TEXT,
  assigned_agent_id TEXT,
  assigned_agent_name TEXT,
  locked_by_agent_id TEXT,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (lower(customer_email));
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON public.orders (fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- 5. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  discord_handle TEXT,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Resolved', 'Pending User')),
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_customer_email ON public.support_tickets (lower(customer_email));
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.support_tickets (created_at DESC);

-- 6. TICKET MESSAGES
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ticket_id TEXT NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'agent')),
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages (ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_timestamp ON public.ticket_messages (timestamp ASC);

-- 7. PAYMENT SETTINGS
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  btc_address TEXT NOT NULL,
  btc_qr_url TEXT,
  sol_address TEXT NOT NULL,
  sol_qr_url TEXT,
  usdt_trc20_address TEXT NOT NULL,
  usdt_trc20_qr_url TEXT,
  gift_card_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy for Payment Settings
CREATE POLICY "Public read payment settings"
  ON public.payment_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. Public Read / Insert Policy for Users
CREATE POLICY "Public user access"
  ON public.users
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Public / Authenticated Order Access
CREATE POLICY "Public order access"
  ON public.orders
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Public / Authenticated Support Ticket Access
CREATE POLICY "Public ticket access"
  ON public.support_tickets
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Ticket Messages Access
CREATE POLICY "Public message access"
  ON public.ticket_messages
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Admin Accounts (Protected)
CREATE POLICY "Admin accounts access"
  ON public.admin_accounts
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ====================================================================
-- SEED INITIAL DATA
-- ====================================================================

-- 1. Seed LivingLegend Superadmin Account (Password: Admin123)
INSERT INTO public.admin_accounts (id, username, password_hash, role)
VALUES (
  'adm_superadmin_001',
  'LivingLegend',
  '$2a$10$x8mflL0WqQdGvhc9QyY2m.7GvE6PmsUeM54Z27x3c6iC5f3gqY3I2', -- bcrypt hash for Admin123
  'superadmin'
)
ON CONFLICT (username) DO NOTHING;

-- 2. Seed Default Payment Settings
INSERT INTO public.payment_settings (
  id,
  btc_address,
  btc_qr_url,
  sol_address,
  sol_qr_url,
  usdt_trc20_address,
  usdt_trc20_qr_url,
  gift_card_links
)
VALUES (
  'default',
  '156uWuAoK4MZpZGcJcXeZ4pvqetc8zrsdA',
  '/assets/payments/btc.png',
  '6Thyxoq4WwyobyTepmiqxN6n2JpQfsFfwQpz9c1gv6m8',
  '/assets/payments/sol.png',
  'THYKE8YXanrBSCvFtiihVLYstNNprKUhoC',
  '/assets/payments/usdt-trc20.png',
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  btc_address = EXCLUDED.btc_address,
  sol_address = EXCLUDED.sol_address,
  usdt_trc20_address = EXCLUDED.usdt_trc20_address;

-- ====================================================================
-- 8. AUTOMATED DATABASE TRIGGER (auth.users -> public.users)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, username, role, discord_handle)
  VALUES (
    NEW.id::text, 
    
    -- Extract Name: Try full_name, then name, global_name, or fallback to email prefix
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'global_name',
      NEW.raw_user_meta_data->>'preferred_username',
      split_part(NEW.email, '@', 1)
    ),
    
    NEW.email,
    
    -- Extract Username: Safely append first 5 chars of ID to guarantee no collisions
    split_part(NEW.email, '@', 1) || '-' || substr(NEW.id::text, 1, 5),
    
    'customer',
    
    -- Extract Discord Handle: Only if the provider is Discord
    CASE WHEN NEW.raw_app_meta_data->>'provider' = 'discord' 
         THEN COALESCE(
           NEW.raw_user_meta_data->>'preferred_username',
           NEW.raw_user_meta_data->>'user_name',
           NEW.raw_user_meta_data->>'username',
           NEW.raw_user_meta_data->>'global_name'
         )
         ELSE NULL END
  )
  -- Seamlessly link accounts across Email OTP, Google OAuth, and Discord
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(NULLIF(public.users.name, ''), EXCLUDED.name),
    discord_handle = COALESCE(EXCLUDED.discord_handle, public.users.discord_handle);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop previous trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


