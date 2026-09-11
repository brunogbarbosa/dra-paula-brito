import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { validateSubmission } from '@/lib/pre-anamnese-server';

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Formato inválido.' }, { status: 415 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 }); }
  const row = validateSubmission(body);
  if (!row) return NextResponse.json({ error: 'Revise os campos e a autorização.' }, { status: 400 });
  try {
    const { data, error } = await createServiceClient().from('pre_anamneses').upsert(row, { onConflict: 'submission_id', ignoreDuplicates: true }).select('id, created_at').maybeSingle();
    if (error) throw error;
    return NextResponse.json({ ok: true, reference: data?.id?.slice(0, 8) ?? row.submission_id.slice(0, 8) }, { status: 201 });
  } catch (error) {
    console.error('pre-anamnese insert failed', error);
    return NextResponse.json({ error: 'Não foi possível salvar agora. Suas respostas continuam nesta tela; tente novamente.' }, { status: 503 });
  }
}
