'use client';

import { createBrowserClient } from '@supabase/ssr';
import {
  AlertCircle, ArrowDownToLine, ArrowUpRight, CalendarClock, CheckCircle2,
  ChevronRight, ClipboardCopy, Clock3, Eye, EyeOff, Inbox, LayoutDashboard,
  LoaderCircle, LockKeyhole, LogOut, MapPin, MessageCircle, Phone, RefreshCw,
  Save, Search, ShieldCheck, Sparkles, Star, UserRound, UsersRound, X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { formatBrazilPhone, normalizeBrazilPhone } from '@/lib/pre-anamnese';
import { supabaseConfig } from '@/lib/supabase/config';
import styles from '@/app/admin/admin.module.css';

type Status = 'novo' | 'em_contato' | 'agendado' | 'arquivado';
type HealthAnswer = { answer?: string; detail?: string };
type RecordRow = {
  id: string; name: string; whatsapp: string; age: number; city: string;
  interests: string[]; objective: string; health: Record<string, HealthAnswer>;
  notes: string; internal_notes: string; priority: boolean; appointment_at: string | null;
  status: Status; consent_at: string; created_at: string; updated_at: string;
};

const statusLabels: Record<Status, string> = { novo: 'Novo', em_contato: 'Em contato', agendado: 'Agendado', arquivado: 'Arquivado' };
const healthLabels: Record<string, string> = {
  allergies: 'Alergias', medicines: 'Medicamentos ou suplementos',
  conditions: 'Condições de saúde', pregnancy: 'Gestante ou amamentando',
  previous: 'Procedimentos anteriores',
};
const statuses = Object.keys(statusLabels) as Status[];

function formatDate(value: string, full = false) {
  return new Intl.DateTimeFormat('pt-BR', full
    ? { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Recife' }
    : { day: '2-digit', month: 'short', timeZone: 'America/Recife' }).format(new Date(value));
}
function toDateInput(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
function contactUrl(row: RecordRow) {
  const phone = normalizeBrazilPhone(row.whatsapp || '');
  if (!phone) return '';
  const firstName = row.name.trim().split(/\s+/)[0] || row.name;
  const message = `Olá, ${firstName}! Tudo bem? Aqui é da equipe da Dra. Paula Brito. Recebemos sua pré-anamnese e gostaríamos de conversar sobre seu atendimento.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
function healthAlerts(row: RecordRow) {
  return Object.keys(healthLabels).filter(key => row.health?.[key]?.answer === 'Sim').length;
}
function recordSummary(row: RecordRow) {
  return [
    `PRÉ-ANAMNESE | ${row.name}`,
    `WhatsApp: ${row.whatsapp ? formatBrazilPhone(row.whatsapp) : 'Não informado'}`,
    `Idade: ${row.age} anos`, `Atendimento: ${row.city}`,
    `Interesses: ${row.interests?.join(', ') || 'Orientação na avaliação'}`,
    `Objetivo: ${row.objective || 'Não informado'}`, '',
    ...Object.entries(healthLabels).map(([key, label]) => {
      const item = row.health?.[key];
      return `${label}: ${item?.answer || 'Prefere conversar na consulta'}${item?.detail ? ` — ${item.detail}` : ''}`;
    }),
    `Observações: ${row.notes || 'Não informado'}`,
  ].join('\n');
}

export function AdminDashboard() {
  const config = useMemo(() => supabaseConfig(), []);
  const client = useMemo(() => config ? createBrowserClient(config.url, config.publishableKey) : null, [config]);
  const [phase, setPhase] = useState<'loading' | 'login' | 'ready' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | Status>('todos');
  const [cityFilter, setCityFilter] = useState('todas');
  const [procedureFilter, setProcedureFilter] = useState('todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [phoneDraft, setPhoneDraft] = useState('');
  const [appointmentDraft, setAppointmentDraft] = useState('');
  const [savingDetail, setSavingDetail] = useState(false);
  const [toast, setToast] = useState('');

  const fetchRows = useCallback(async (silent = false) => {
    if (!client) return false;
    if (silent) setRefreshing(true); else setLoadingRows(true);
    const { data, error } = await client.from('pre_anamneses').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(500);
    if (!error) setRows((data ?? []) as RecordRow[]);
    if (silent) setRefreshing(false); else setLoadingRows(false);
    if (error) setToast('Não foi possível atualizar os registros.');
    return !error;
  }, [client]);

  const openDashboard = useCallback(async (userEmail: string) => {
    if (!client) return;
    setLoadingRows(true);
    const [{ data: staff, error: staffError }, { data, error: recordsError }] = await Promise.all([
      client.from('staff_members').select('email').eq('email', userEmail.toLowerCase()).maybeSingle(),
      client.from('pre_anamneses').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(500),
    ]);
    if (staffError || !staff) {
      await client.auth.signOut();
      setLoginError('Este e-mail não está autorizado para acessar o painel.');
      setPhase('login'); setLoadingRows(false); return;
    }
    setRows((data ?? []) as RecordRow[]);
    setAccountEmail(userEmail); setPhase('ready'); setLoadingRows(false);
    if (recordsError) setToast('O acesso foi validado, mas os registros não carregaram. Tente atualizar.');
  }, [client]);

  useEffect(() => {
    let active = true;
    if (!client) { setPhase('error'); return; }
    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session?.user.email) void openDashboard(data.session.user.email); else setPhase('login');
    }).catch(() => { if (active) setPhase('login'); });
    return () => { active = false; };
  }, [client, openDashboard]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!client || phase !== 'ready') return;
    const channel = client.channel('pre-anamneses-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pre_anamneses' }, () => void fetchRows(true))
      .subscribe();
    return () => { void client.removeChannel(channel); };
  }, [client, fetchRows, phase]);

  useEffect(() => {
    if (!selectedId) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedId(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedId]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || loginBusy) return;
    setLoginBusy(true); setLoginError('');
    const { data, error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data.user?.email) { setLoginError('E-mail ou senha incorretos.'); setLoginBusy(false); return; }
    await openDashboard(data.user.email);
    setPassword(''); setLoginBusy(false);
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    setRows([]); setAccountEmail(''); setPhase('login');
  }

  async function patchRow(id: string, patch: Partial<RecordRow>, success = 'Registro atualizado.') {
    if (!client) return false;
    const previous = rows;
    setRows(current => current.map(row => row.id === id ? { ...row, ...patch } : row));
    const { error } = await client.from('pre_anamneses').update(patch).eq('id', id);
    if (error) { setRows(previous); setToast('Não foi possível salvar. Tente novamente.'); return false; }
    setToast(success); return true;
  }

  const selected = rows.find(row => row.id === selectedId) ?? null;
  function openRecord(row: RecordRow) {
    setSelectedId(row.id); setNoteDraft(row.internal_notes || ''); setPhoneDraft(row.whatsapp || '');
    setAppointmentDraft(toDateInput(row.appointment_at));
  }
  async function saveDetails() {
    if (!selected) return;
    const phone = phoneDraft ? normalizeBrazilPhone(phoneDraft) : '';
    if (phoneDraft && !phone) { setToast('Confira o WhatsApp com DDD.'); return; }
    setSavingDetail(true);
    const appointment = appointmentDraft ? new Date(appointmentDraft).toISOString() : null;
    const saved = await patchRow(selected.id, { whatsapp: phone, internal_notes: noteDraft.trim().slice(0, 1200), appointment_at: appointment }, 'Informações salvas.');
    if (saved) { setPhoneDraft(phone); setAppointmentDraft(toDateInput(appointment)); }
    setSavingDetail(false);
  }

  const cities = useMemo(() => [...new Set(rows.map(row => row.city).filter(Boolean))].sort(), [rows]);
  const procedures = useMemo(() => [...new Set(rows.flatMap(row => row.interests || []))].sort(), [rows]);
  const filteredRows = useMemo(() => {
    const rawTerm = query.trim().toLocaleLowerCase('pt-BR');
    const numberTerm = rawTerm.replace(/\D/g, '');
    return rows.filter(row => {
      const searchable = [row.name, row.city, row.whatsapp, row.objective, ...(row.interests || [])].join(' ').toLocaleLowerCase('pt-BR');
      return (statusFilter === 'todos' || row.status === statusFilter)
        && (cityFilter === 'todas' || row.city === cityFilter)
        && (procedureFilter === 'todos' || row.interests?.includes(procedureFilter))
        && (!rawTerm || searchable.includes(rawTerm) || (numberTerm && searchable.replace(/\D/g, '').includes(numberTerm)));
    });
  }, [cityFilter, procedureFilter, query, rows, statusFilter]);
  const stats = useMemo(() => ({
    total: rows.length, novo: rows.filter(row => row.status === 'novo').length,
    contato: rows.filter(row => row.status === 'em_contato').length,
    agendado: rows.filter(row => row.status === 'agendado').length,
  }), [rows]);

  function exportCsv() {
    const header = ['Nome', 'WhatsApp', 'Idade', 'Cidade', 'Interesses', 'Objetivo', 'Status', 'Prioridade', 'Agendamento', 'Enviado em', 'Notas internas'];
    const quote = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = filteredRows.map(row => [row.name, formatBrazilPhone(row.whatsapp), row.age, row.city, row.interests?.join('; '), row.objective, statusLabels[row.status], row.priority ? 'Sim' : 'Não', row.appointment_at ? formatDate(row.appointment_at, true) : '', formatDate(row.created_at, true), row.internal_notes].map(quote).join(','));
    const blob = new Blob([`\uFEFF${header.map(quote).join(',')}\n${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const href = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = href; link.download = `pre-anamneses-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(href);
    setToast('Planilha exportada.');
  }
  async function copyRecord(row: RecordRow) {
    try {
      await navigator.clipboard.writeText(recordSummary(row));
      setToast('Resumo copiado.');
    } catch {
      setToast('Não foi possível copiar automaticamente.');
    }
  }

  if (phase === 'loading') return <LoadingScreen />;
  if (phase === 'error') return <ConfigurationError />;
  if (phase === 'login') return <LoginScreen email={email} password={password} showPassword={showPassword} busy={loginBusy} error={loginError} onEmail={setEmail} onPassword={setPassword} onTogglePassword={() => setShowPassword(value => !value)} onSubmit={handleLogin} />;

  return <div className={styles.app}>
    <aside className={styles.sidebar}>
      <a className={styles.brand} href="/" aria-label="Dra. Paula Brito, início"><b>PB</b><span>PAULA BRITO<small>GESTÃO CLÍNICA</small></span></a>
      <nav aria-label="Menu do painel">
        <button className={statusFilter === 'todos' ? styles.navActive : ''} onClick={() => setStatusFilter('todos')}><LayoutDashboard size={19} />Visão geral</button>
        <button className={statusFilter === 'novo' ? styles.navActive : ''} onClick={() => setStatusFilter('novo')}><Inbox size={19} />Novas solicitações{stats.novo > 0 && <em>{stats.novo}</em>}</button>
        <button className={statusFilter === 'agendado' ? styles.navActive : ''} onClick={() => setStatusFilter('agendado')}><CalendarClock size={19} />Agendamentos</button>
        <a href="/" target="_blank" rel="noreferrer"><ArrowUpRight size={19} />Ver site</a>
      </nav>
      <div className={styles.sidebarAccount}><span><UserRound size={17} /><small>Conectada como</small>{accountEmail}</span><button onClick={signOut}><LogOut size={17} />Sair</button></div>
    </aside>

    <main className={styles.main}>
      <header className={styles.topbar}>
        <div><span className={styles.eyebrow}>PAINEL PRIVADO</span><h1>Bom atendimento<br /><em>começa antes.</em></h1><p>Acompanhe cada pessoa desde o primeiro contato.</p></div>
        <button className={styles.refreshButton} onClick={() => void fetchRows(true)} disabled={refreshing}><RefreshCw className={refreshing ? styles.spinning : ''} size={18} />{refreshing ? 'Atualizando' : 'Atualizar'}</button>
      </header>

      <section className={styles.stats} aria-label="Resumo das pré-anamneses">
        <button onClick={() => setStatusFilter('todos')}><span><UsersRound size={20} />Total recebido</span><strong>{stats.total}</strong><small>Todos os registros</small></button>
        <button onClick={() => setStatusFilter('novo')}><span><Sparkles size={20} />Novos</span><strong>{stats.novo}</strong><small>Aguardando contato</small></button>
        <button onClick={() => setStatusFilter('em_contato')}><span><MessageCircle size={20} />Em contato</span><strong>{stats.contato}</strong><small>Conversas iniciadas</small></button>
        <button onClick={() => setStatusFilter('agendado')}><span><CheckCircle2 size={20} />Agendados</span><strong>{stats.agendado}</strong><small>Próximos atendimentos</small></button>
      </section>

      <section className={styles.controlPanel}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>PRÉ-ANAMNESES</span><h2>Fila de atendimento</h2></div><button className={styles.exportButton} onClick={exportCsv} disabled={!filteredRows.length}><ArrowDownToLine size={17} />Exportar planilha</button></div>
        <div className={styles.filters}>
          <label className={styles.search}><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar nome, telefone ou procedimento" /></label>
          <select aria-label="Filtrar por status" value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'todos' | Status)}><option value="todos">Todos os status</option>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select>
          <select aria-label="Filtrar por cidade" value={cityFilter} onChange={event => setCityFilter(event.target.value)}><option value="todas">Todas as cidades</option>{cities.map(city => <option key={city}>{city}</option>)}</select>
          <select aria-label="Filtrar por procedimento" value={procedureFilter} onChange={event => setProcedureFilter(event.target.value)}><option value="todos">Todos os cuidados</option>{procedures.map(procedure => <option key={procedure}>{procedure}</option>)}</select>
        </div>
        <div className={styles.resultCount}><span>{filteredRows.length} {filteredRows.length === 1 ? 'registro encontrado' : 'registros encontrados'}</span>{(query || statusFilter !== 'todos' || cityFilter !== 'todas' || procedureFilter !== 'todos') && <button onClick={() => { setQuery(''); setStatusFilter('todos'); setCityFilter('todas'); setProcedureFilter('todos'); }}>Limpar filtros</button>}</div>

        {loadingRows ? <RecordsSkeleton /> : filteredRows.length === 0 ? <div className={styles.empty}><Inbox size={30} /><h3>Nenhum registro por aqui.</h3><p>{rows.length ? 'Ajuste os filtros para encontrar outra pessoa.' : 'As próximas pré-anamneses aparecerão automaticamente nesta tela.'}</p></div> : <div className={styles.records}>
          {filteredRows.map(row => {
            const whatsapp = contactUrl(row); const alerts = healthAlerts(row);
            return <article className={`${styles.record} ${row.priority ? styles.priorityRecord : ''}`} key={row.id}>
              <button className={styles.starButton} aria-label={row.priority ? `Remover ${row.name} dos destaques` : `Destacar ${row.name}`} onClick={() => void patchRow(row.id, { priority: !row.priority }, row.priority ? 'Destaque removido.' : 'Registro destacado.')}><Star size={18} fill={row.priority ? 'currentColor' : 'none'} /></button>
              <div className={styles.patient}><span>{row.name.slice(0, 1).toUpperCase()}</span><div><h3>{row.name}</h3><p><MapPin size={13} />{row.city} · {row.age} anos</p></div></div>
              <div className={styles.tags}>{row.interests?.slice(0, 2).map(interest => <span key={interest}>{interest}</span>)}{(row.interests?.length ?? 0) > 2 && <small>+{row.interests.length - 2}</small>}</div>
              <div className={styles.recordInfo}><time><Clock3 size={14} />{formatDate(row.created_at)}</time>{alerts > 0 && <span className={styles.alert}><AlertCircle size={14} />{alerts} {alerts === 1 ? 'atenção' : 'atenções'}</span>}{row.appointment_at && <span className={styles.appointmentDate}><CalendarClock size={14} />{formatDate(row.appointment_at, true)}</span>}</div>
              <div className={styles.recordActions}>
                <select className={`${styles.statusSelect} ${styles[row.status]}`} aria-label={`Status de ${row.name}`} value={row.status} onChange={event => void patchRow(row.id, { status: event.target.value as Status }, 'Status atualizado.')}>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select>
                {whatsapp ? <a className={styles.whatsappButton} href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} />WhatsApp</a> : <button className={styles.noContact} onClick={() => openRecord(row)}><Phone size={17} />Adicionar contato</button>}
                <button className={styles.openButton} onClick={() => openRecord(row)}>Ver ficha<ChevronRight size={18} /></button>
              </div>
            </article>;
          })}
        </div>}
      </section>
    </main>

    {selected && <div className={styles.drawerBackdrop} role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedId(null); }}>
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="patient-name">
        <header><div><span className={styles.eyebrow}>FICHA COMPLETA</span><h2 id="patient-name">{selected.name}</h2><p>{selected.age} anos · {selected.city} · Enviada em {formatDate(selected.created_at, true)}</p></div><button aria-label="Fechar ficha" onClick={() => setSelectedId(null)}><X size={22} /></button></header>
        <div className={styles.drawerQuickActions}>
          {contactUrl({ ...selected, whatsapp: phoneDraft }) ? <a href={contactUrl({ ...selected, whatsapp: phoneDraft })} target="_blank" rel="noreferrer"><MessageCircle size={18} />Conversar no WhatsApp</a> : <span><Phone size={18} />Adicione o contato abaixo</span>}
          <button onClick={() => void copyRecord(selected)}><ClipboardCopy size={18} />Copiar resumo</button>
          <button className={selected.priority ? styles.activePriority : ''} onClick={() => void patchRow(selected.id, { priority: !selected.priority }, selected.priority ? 'Destaque removido.' : 'Registro destacado.')}><Star size={18} fill={selected.priority ? 'currentColor' : 'none'} />{selected.priority ? 'Destacada' : 'Destacar'}</button>
        </div>
        <div className={styles.drawerBody}>
          <section><h3><UserRound size={18} />Contato e acompanhamento</h3><div className={styles.editGrid}><label>WhatsApp do paciente<input value={formatBrazilPhone(phoneDraft)} onChange={event => setPhoneDraft(event.target.value.replace(/\D/g, '').slice(0, 13))} inputMode="tel" placeholder="(81) 99999-9999" /></label><label>Próximo atendimento<input type="datetime-local" value={appointmentDraft} onChange={event => setAppointmentDraft(event.target.value)} /></label></div><label className={styles.notesField}>Notas internas da equipe<textarea rows={4} maxLength={1200} value={noteDraft} onChange={event => setNoteDraft(event.target.value)} placeholder="Registre combinados, retornos e informações importantes para a equipe." /><small>{noteDraft.length}/1200</small></label><button className={styles.saveButton} onClick={() => void saveDetails()} disabled={savingDetail}><Save size={17} />{savingDetail ? 'Salvando…' : 'Salvar acompanhamento'}</button></section>
          <section><h3><Sparkles size={18} />Objetivos</h3><dl><div><dt>Interesses</dt><dd>{selected.interests?.length ? selected.interests.join(', ') : 'Orientação na avaliação'}</dd></div><div><dt>O que deseja cuidar</dt><dd>{selected.objective || 'Prefere conversar na consulta'}</dd></div><div><dt>Observações</dt><dd>{selected.notes || 'Não informado'}</dd></div></dl></section>
          <section><h3><ShieldCheck size={18} />Histórico de saúde</h3><div className={styles.healthGrid}>{Object.entries(healthLabels).map(([key, label]) => { const item = selected.health?.[key]; return <article className={item?.answer === 'Sim' ? styles.healthAlert : ''} key={key}><span>{label}</span><strong>{item?.answer || 'Prefere conversar na consulta'}</strong>{item?.detail && <p>{item.detail}</p>}</article>; })}</div></section>
          <footer><LockKeyhole size={15} />Autorização de uso dos dados registrada em {formatDate(selected.consent_at, true)}.</footer>
        </div>
      </aside>
    </div>}
    {toast && <div className={styles.toast} role="status"><CheckCircle2 size={18} />{toast}</div>}
  </div>;
}

function LoadingScreen() {
  return <main className={styles.loadingScreen}><div className={styles.loaderMark}>PB</div><LoaderCircle className={styles.spinning} size={25} /><span>Preparando seu painel</span></main>;
}
function ConfigurationError() {
  return <main className={styles.loadingScreen}><ShieldCheck size={34} /><h1>Painel em configuração</h1><p>As credenciais de acesso ainda não estão disponíveis.</p></main>;
}
function LoginScreen({ email, password, showPassword, busy, error, onEmail, onPassword, onTogglePassword, onSubmit }: { email: string; password: string; showPassword: boolean; busy: boolean; error: string; onEmail: (value: string) => void; onPassword: (value: string) => void; onTogglePassword: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <main className={styles.loginPage}>
    <section className={styles.loginEditorial}><a href="/" className={styles.loginBrand}><b>PB</b><span>PAULA BRITO<small>HARMONIZAÇÃO FACIAL</small></span></a><div><span className={styles.eyebrow}>GESTÃO CLÍNICA</span><h1>Cuidado que começa<br /><em>antes do encontro.</em></h1><p>Um espaço reservado para acompanhar cada história com atenção, organização e proximidade.</p></div><footer><ShieldCheck size={18} />Ambiente privado da equipe</footer></section>
    <section className={styles.loginPanel}><div className={styles.loginCard}><div className={styles.loginIcon}><LockKeyhole size={24} /></div><span className={styles.eyebrow}>ÁREA DA DRA. PAULA</span><h2>Bem-vinda.</h2><p>Acesse as pré-anamneses e continue o atendimento de onde parou.</p>{error && <div className={styles.loginError}><AlertCircle size={18} />{error}</div>}<form onSubmit={onSubmit}><label>E-mail<input name="email" type="email" autoComplete="username" value={email} onChange={event => onEmail(event.target.value)} required placeholder="seu@email.com" /></label><label>Senha<div className={styles.passwordField}><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => onPassword(event.target.value)} minLength={8} required placeholder="Sua senha" /><button type="button" onClick={onTogglePassword} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><button className={styles.loginButton} disabled={busy}>{busy ? <LoaderCircle className={styles.spinning} size={19} /> : <ArrowUpRight size={19} />}{busy ? 'Entrando…' : 'Entrar no painel'}</button></form><a href="/">Voltar ao site</a></div></section>
  </main>;
}
function RecordsSkeleton() {
  return <div className={styles.skeletons}>{[0, 1, 2].map(item => <div key={item}><span /><span /><span /></div>)}</div>;
}
