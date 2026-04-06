import { createClient } from '@supabase/supabase-js';

function getServerEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase server environment variables.');
  }

  return { url, serviceRoleKey };
}

export function createSupabaseServerClient() {
  const { url, serviceRoleKey } = getServerEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
