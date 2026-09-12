'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createUserClient } from '@/lib/supabase/server';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase().slice(0, 254);
  const password = String(formData.get('password') ?? '').slice(0, 128);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) redirect('/admin?erro=credenciais');
  try {
    const client = await createUserClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user?.email) redirect('/admin?erro=credenciais');
    const { data: staff } = await client.from('staff_members').select('email').eq('email', data.user.email.toLowerCase()).maybeSingle();
    if (!staff) {
      await client.auth.signOut();
      redirect('/admin?erro=acesso');
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error('admin password sign in failed', error);
    redirect('/admin?erro=credenciais');
  }
  redirect('/admin');
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
