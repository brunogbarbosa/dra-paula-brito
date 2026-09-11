import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const client = await createUserClient();
  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await client.auth.getUser();
      const { data: staff } = user?.email ? await client.from('staff_members').select('email').eq('email', user.email.toLowerCase()).maybeSingle() : { data: null };
      if (staff) return NextResponse.redirect(new URL('/admin', url.origin));
      await client.auth.signOut();
    }
  }
  return NextResponse.redirect(new URL('/admin?erro=acesso', url.origin));
}
