import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtxuyzzcngfvfitywjvs.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_QoiLLFll73Btg-fZxOdKvA_z4lZ3qOm';

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
