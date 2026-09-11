import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseConfig } from './config';

export async function createUserClient() {
  const { url, publishableKey } = requireSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: values => {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Components cannot write cookies. Route handlers can. */ }
      },
    },
  });
}

export function createServiceClient() {
  const { url } = requireSupabaseConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) throw new Error('Chave de serviço do Supabase não configurada.');
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
