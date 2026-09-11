'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { createServiceClient, createUserClient } from '@/lib/supabase/server';
import { requireSupabaseConfig } from '@/lib/supabase/config';

export async function requestMagicLink(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase().slice(0, 254);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    try {
      const { data: staff } = await createServiceClient().from('staff_members').select('email').eq('email', email).maybeSingle();
      if (staff) {
        const { url, publishableKey } = requireSupabaseConfig();
        const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://drapaulabrito.vercel.app').replace(/\/$/, '');
        await createClient(url, publishableKey).auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/admin/auth/callback` } });
      }
    } catch (error) { console.error('admin magic link failed', error); }
  }
  redirect('/admin?enviado=1');
}

export async function updateStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(id) || !['novo', 'em_contato', 'agendado', 'arquivado'].includes(status)) return;
  const client = await createUserClient();
  const { error } = await client.from('pre_anamneses').update({ status }).eq('id', id);
  if (error) console.error('pre-anamnese status update failed', error);
  revalidatePath('/admin');
}

export async function signOut() {
  const client = await createUserClient();
  await client.auth.signOut();
  redirect('/admin');
}
