import type { Metadata } from 'next';
import { CalendarDays, ChevronRight, ClipboardList, LogOut, Search, ShieldCheck, UserRound } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createUserClient } from '@/lib/supabase/server';
import { signIn, signOut, updateStatus } from './actions';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Pré-anamneses | Dra. Paula Brito', robots: { index: false, follow: false } };
type Row = { id: string; name: string; age: number; city: string; interests: string[]; objective: string; health: Record<string, { answer?: string; detail?: string }>; notes: string; status: string; consent_at: string; created_at: string };
const statusLabels: Record<string, string> = { novo: 'Novo', em_contato: 'Em contato', agendado: 'Agendado', arquivado: 'Arquivado' };
const healthLabels: Record<string, string> = { allergies: 'Alergias', medicines: 'Medicamentos ou suplementos', conditions: 'Condições de saúde', pregnancy: 'Gestante ou amamentando', previous: 'Procedimentos anteriores' };
const formatDate = (value: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Recife' }).format(new Date(value));

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  let client;
  try { client = await createUserClient(); } catch { return <Login unavailable />; }
  const { data: { user } } = await client.auth.getUser();
  if (!user?.email) return <Login error={typeof params.erro === 'string' ? params.erro : ''} />;
  const { data: staff } = await client.from('staff_members').select('email').eq('email', user.email.toLowerCase()).maybeSingle();
  if (!staff) redirect('/admin/auth/unauthorized');
  const status = typeof params.status === 'string' && statusLabels[params.status] ? params.status : 'todos';
  const query = typeof params.q === 'string' ? params.q.trim().slice(0, 80) : '';
  let dbQuery = client.from('pre_anamneses').select('*').order('created_at', { ascending: false }).limit(200);
  if (status !== 'todos') dbQuery = dbQuery.eq('status', status);
  if (query) dbQuery = dbQuery.or(`name.ilike.%${query.replace(/[%_,()]/g, '')}%,city.ilike.%${query.replace(/[%_,()]/g, '')}%`);
  const { data, error } = await dbQuery;
  const rows = (data ?? []) as Row[];
  return <div className={styles.page}>
    <aside className={styles.sidebar}><a href="/" className={styles.brand}><b>PB</b><span>PAULA BRITO<small>PAINEL CLÍNICO</small></span></a><nav><a className={styles.active} href="/admin"><ClipboardList size={19} />Pré-anamneses</a><a href="/"><ChevronRight size={19} />Ver site</a></nav><form action={signOut}><button><LogOut size={18} />Sair</button></form></aside>
    <main className={styles.main}><header className={styles.header}><div><span>PAINEL PRIVADO</span><h1>Pré-anamneses</h1><p>Registros enviados pelo site para preparar o atendimento.</p></div><div className={styles.identity}><UserRound size={18} /><span>{user.email}</span></div></header>
      <section className={styles.toolbar}><form><label><Search size={17} /><input name="q" defaultValue={query} placeholder="Buscar por nome ou cidade" /></label><input type="hidden" name="status" value={status} /><button>Buscar</button></form><nav aria-label="Filtrar por status">{['todos', 'novo', 'em_contato', 'agendado', 'arquivado'].map(value => <a key={value} className={status === value ? styles.filterActive : ''} href={`/admin?status=${value}${query ? `&q=${encodeURIComponent(query)}` : ''}`}>{value === 'todos' ? 'Todos' : statusLabels[value]}</a>)}</nav></section>
      {error ? <div className={styles.empty}><ShieldCheck size={28} /><h2>Não foi possível carregar os registros.</h2><p>Tente novamente em alguns instantes.</p></div> : rows.length === 0 ? <div className={styles.empty}><ClipboardList size={30} /><h2>Nenhum registro encontrado.</h2><p>As novas pré-anamneses aparecerão aqui.</p></div> : <section className={styles.records}>{rows.map(row => <details className={styles.record} key={row.id}><summary><div className={styles.person}><span>{row.name.slice(0, 1).toUpperCase()}</span><div><h2>{row.name}</h2><p>{row.age} anos · {row.city}</p></div></div><div className={styles.recordMeta}><span className={`${styles.badge} ${styles[row.status]}`}>{statusLabels[row.status]}</span><time><CalendarDays size={15} />{formatDate(row.created_at)}</time><ChevronRight className={styles.chevron} /></div></summary><div className={styles.detail}><div className={styles.detailGrid}><section><h3>Objetivos</h3><dl><dt>Interesses</dt><dd>{row.interests?.length ? row.interests.join(', ') : 'Orientação na avaliação'}</dd><dt>O que deseja cuidar</dt><dd>{row.objective || 'Prefere conversar na consulta'}</dd><dt>Observações</dt><dd>{row.notes || 'Não informado'}</dd></dl></section><section><h3>Histórico de saúde</h3><dl>{Object.entries(healthLabels).map(([key, label]) => { const item = row.health?.[key]; return <div key={key}><dt>{label}</dt><dd>{item?.answer || 'Prefere conversar na consulta'}{item?.answer === 'Sim' && item.detail ? <small>{item.detail}</small> : null}</dd></div>; })}</dl></section></div><footer><span>Autorização registrada em {formatDate(row.consent_at)}</span><form action={updateStatus}><input type="hidden" name="id" value={row.id} /><label>Status<select name="status" defaultValue={row.status}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button>Salvar status</button></form></footer></div></details>)}</section>}
    </main></div>;
}

function Login({ error = '', unavailable = false }: { error?: string; unavailable?: boolean }) {
  return <main className={styles.login}><section><div className={styles.loginMark}>PB</div><span>ÁREA DA DRA. PAULA</span><h1>Acesso às<br /><em>pré-anamneses.</em></h1><p>Entre com o e-mail e a senha cadastrados para acessar o painel privado.</p>{error && <div className={styles.error}>{error === 'credenciais' ? 'E-mail ou senha incorretos.' : 'Este acesso não está autorizado.'}</div>}{unavailable ? <div className={styles.error}>O painel ainda está sendo configurado.</div> : <form action={signIn}><label>E-mail<input name="email" type="email" autoComplete="username" required placeholder="seu@email.com" /></label><label>Senha<input name="password" type="password" autoComplete="current-password" minLength={8} required placeholder="Sua senha" /></label><button>Entrar no painel</button></form>}<a href="/">Voltar ao site</a></section></main>;
}
