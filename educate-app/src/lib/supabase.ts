import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only create a real client if both env vars are set and URL looks valid
export const supabaseConfigured = url.startsWith('http') && key.length > 0;

export const supabaseAdmin = supabaseConfigured
  ? createClient(url, key)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');
