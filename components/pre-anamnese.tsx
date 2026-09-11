'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCheck, Copy, Database, HeartHandshake, Loader2, LockKeyhole, MessageCircle } from 'lucide-react';
import { site, appointmentUrl } from '@/data/site';
import { emptyIntake, healthQuestions, intakeMessage, intakeSections, intakeWhatsAppUrl, type HealthId, type Intake } from '@/lib/pre-anamnese';
import styles from './pre-anamnese.module.css';

const steps = ['Sobre você', 'Seus objetivos', 'Seu histórico', 'Revisar e enviar'];
const titles = [<>Vamos começar<br /><em>por você.</em></>, <>O que te traz<br /><em>até aqui?</em></>, <>Cada detalhe<br /><em>importa.</em></>, <>Seu cuidado,<br /><em>com a sua voz.</em></>];
export function PreAnamnese() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Intake>(emptyIntake);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reference, setReference] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const copyArea = useRef<HTMLTextAreaElement>(null);
  const mounted = useRef(false);
  const submissionId = useRef('');
  const startedAt = useRef(0);
  useEffect(() => { submissionId.current = crypto.randomUUID(); startedAt.current = Date.now(); setReady(true); }, []);
  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    mounted.current = true;
  }, [step]);
  const update = <K extends keyof Intake>(key: K, value: Intake[K]) => {
    setData(current => ({ ...current, [key]: value }));
    setConsent(false); setStatus(''); setManualCopy(false);
  };
  const updateHealth = (id: HealthId, answer: string, detail = '') => update('health', { ...data.health, [id]: { answer, detail } });
  const go = (next: number) => { setStep(next); setStatus(''); setManualCopy(false); };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); go(Math.min(step + 1, 3)); };
  const message = intakeMessage(data);
  const whatsappUrl = intakeWhatsAppUrl(site.whatsapp, message);
  async function copyAnswers() {
    if (!consent) return;
    try {
      await navigator.clipboard.writeText(message);
      setStatus('Respostas copiadas. Abra a conversa, cole a mensagem e toque em enviar no WhatsApp.');
    } catch {
      setManualCopy(true);
      setStatus('A cópia automática não ficou disponível. Selecione e copie o texto abaixo antes de abrir o WhatsApp.');
    }
  }
  async function saveAnswers() {
    if (!consent || saving || saved) return;
    setSaving(true); setStatus('');
    try {
      const response = await fetch('/api/pre-anamnese', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submissionId: submissionId.current, intake: data, consent, startedAt: startedAt.current, website: '' }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível salvar agora.');
      setSaved(true); setReference(result.reference || '');
      setStatus('Pré-anamnese enviada com segurança para a equipe da Dra. Paula.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Não foi possível salvar agora. Tente novamente.'); }
    finally { setSaving(false); }
  }
  return <div className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.brand} aria-label="Dra. Paula Brito, início"><span aria-hidden="true">PB</span><div>PAULA BRITO<small>HARMONIZAÇÃO FACIAL</small></div></a><a className={styles.backSite} href="/"><ArrowLeft size={16} /> Voltar ao site</a></header>
    <main id="pre-anamnese" className={styles.layout}>
      <aside className={styles.editorial}>
        <div className={styles.portrait}><Image src="/images/paula-essencia-retrato.webp" alt="Dra. Paula Brito" fill sizes="(max-width:900px) 1px, 40vw" priority /></div>
        <div className={styles.editorialCopy}><span className={styles.eyebrow}>UM PRIMEIRO OLHAR PARA VOCÊ</span><h1>O cuidado começa<br />na <em>escuta.</em></h1><p>Um espaço para compartilhar sua história, seus desejos e o que faz sentido para você.</p><span className={styles.signature}>Dra. Paula Brito</span><div className={styles.credentials}>{site.cro}<span>Recife · Surubim</span></div></div>
      </aside>
      <div className={styles.workspace}>
        <div className={styles.formTop}><span className={styles.eyebrow}>PRÉ-ANAMNESE</span><span>ETAPA {String(step + 1).padStart(2, '0')} / 04</span></div>
        <ol className={styles.progress} aria-label="Etapas da pré-anamnese">{steps.map((label, i) => <li key={label} className={i <= step ? styles.reached : ''} aria-current={i === step ? 'step' : undefined}><span>{i < step ? <Check size={13} /> : i + 1}</span><small>{label}</small></li>)}</ol>
        <div className={styles.stage} key={step}>
          <h2 ref={heading} tabIndex={-1}>{titles[step]}</h2>
          <p className={styles.intro}>{[
            'Conte um pouco sobre você para preparar nosso primeiro encontro. Os campos com * são obrigatórios.',
            'Selecione os cuidados que despertam seu interesse. Você não precisa saber qual procedimento escolher.',
            'Responda apenas o que se sentir à vontade para compartilhar. Todas as perguntas desta etapa são opcionais.',
            'Confira suas respostas com calma. Você pode editar qualquer etapa antes de compartilhar com a equipe.',
          ][step]}</p>
          <noscript>Ative o JavaScript para preencher o formulário ou entre em contato com a equipe pelo link no rodapé.</noscript>
          {step < 3 ? <form onSubmit={submit} className={styles.form} inert={!ready}>
            {step === 0 && <>
              <div className={styles.privacy}><LockKeyhole size={20} /><p>Suas respostas permanecem nesta página durante o preenchimento. Elas só são armazenadas no sistema privado da clínica após sua revisão e autorização.</p></div>
              <label className={styles.field}>Como você se chama? *<input name="name" autoComplete="name" value={data.name} onChange={e => update('name', e.target.value)} required pattern=".*\S.*" maxLength={100} placeholder="Seu nome" /></label>
              <div className={styles.twoColumns}><label className={styles.field}>Sua idade *<input name="age" inputMode="numeric" type="number" min="1" max="120" step="1" required value={data.age} onChange={e => update('age', e.target.value)} placeholder="Em anos" /></label><label className={styles.field}>Onde deseja atendimento? *<select name="city" required value={data.city} onChange={e => update('city', e.target.value)}><option value="">Selecione</option><option>Recife</option><option>Surubim</option><option>Ainda não decidi</option></select></label></div>
              {Number(data.age) > 0 && Number(data.age) < 18 && <p className={styles.note}>Preencha com seu responsável e combine com a equipe a participação dele na avaliação.</p>}
              <p className={styles.note}>Esta é uma conversa inicial. O formulário não substitui a consulta, não confirma agendamento e não define a indicação de tratamentos.</p>
            </>}
            {step === 1 && <>
              <fieldset className={styles.options}><legend>Quais cuidados você gostaria de conhecer?</legend>{[...site.procedures.map(p => p.name), 'Quero orientação na avaliação'].map(name => <label key={name} className={styles.option}><input type="checkbox" checked={data.interests.includes(name)} onChange={e => update('interests', e.target.checked ? [...data.interests, name] : data.interests.filter(value => value !== name))} /><span>{name}</span><Check size={16} aria-hidden="true" /></label>)}</fieldset>
              <label className={styles.field}>O que você gostaria de cuidar? <small>Opcional</small><textarea maxLength={500} rows={4} value={data.objective} onChange={e => update('objective', e.target.value)} placeholder="Conte, com suas palavras, o que motivou você a procurar esse cuidado." /><span className={styles.count}>{data.objective.length}/500</span></label>
            </>}
            {step === 2 && <>
              <div className={styles.privacy}><HeartHandshake size={21} /><p>Você pode deixar qualquer resposta para a consulta. Estas informações ajudam a equipe a conhecer seu histórico; não geram uma avaliação automática.</p></div>
              {healthQuestions.map(q => <fieldset className={styles.health} key={q.id}><legend>{q.label}</legend><p>{q.hint}</p><div className={styles.answers}>{['Sim', 'Não', ...(q.id === 'pregnancy' ? ['Não se aplica'] : []), 'Prefiro conversar na consulta'].map(answer => <label key={answer}><input type="radio" name={q.id} checked={data.health[q.id].answer === answer} onChange={() => updateHealth(q.id, answer)} /><span>{answer}</span></label>)}</div>{data.health[q.id].answer === 'Sim' && <label className={styles.field}>Quer contar um pouco mais? <small>Opcional</small><textarea maxLength={350} rows={3} value={data.health[q.id].detail} onChange={e => updateHealth(q.id, 'Sim', e.target.value)} /></label>}</fieldset>)}
              <label className={styles.field}>Algo mais que devemos saber? <small>Opcional</small><textarea rows={3} maxLength={350} value={data.notes} onChange={e => update('notes', e.target.value)} placeholder="Há algo que deixaria seu atendimento mais confortável?" /></label>
            </>}
            <div className={styles.actions}>{step > 0 && <button type="button" className={styles.secondary} onClick={() => go(step - 1)}><ArrowLeft size={17} /> Voltar</button>}<button type="submit" className={styles.primary} disabled={!ready}>{step === 2 ? 'Revisar respostas' : 'Continuar'}<ArrowRight size={18} /></button></div>
          </form> : <div className={styles.review}>
            {intakeSections(data).map((section, i) => <section className={styles.summary} key={section.title}><header><h3>{section.title}</h3>{!saved && <button type="button" onClick={() => go(i)}>Editar <ArrowUpRight size={14} /></button>}</header><dl>{section.fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>)}
            <div className={styles.consentBox}><label><input type="checkbox" disabled={saved} checked={consent} onChange={e => { setConsent(e.target.checked); setStatus(''); setManualCopy(false); }} /><span>Autorizo a Dra. Paula Brito e sua equipe a armazenar e utilizar estas informações, inclusive meus dados de saúde, exclusivamente para preparar e acompanhar meu atendimento.</span></label><p>Os dados serão guardados no sistema privado da clínica. O envio ao WhatsApp é uma etapa separada e opcional, sujeita à política de privacidade desse serviço. Você pode solicitar acesso, correção ou exclusão dos dados e revogar esta autorização pelo contato da clínica. <a className="booking-cta" href={appointmentUrl} target="_blank" rel="noreferrer">Falar com a equipe <ArrowUpRight size={14} aria-hidden="true" /></a></p></div>
            <div className={styles.handoff}>{saved ? <CheckCheck size={27} /> : <Database size={25} />}<h3>{saved ? <>Tudo certo,<br /><em>recebemos seus dados.</em></> : <>Enviar para<br /><em>a Dra. Paula.</em></>}</h3><p>{saved ? `Seu registro foi salvo${reference ? ` com a referência ${reference.toUpperCase()}` : ''}. Se quiser, continue a conversa pelo WhatsApp.` : 'Ao enviar, a equipe poderá consultar suas respostas no painel privado e preparar melhor o seu atendimento.'}</p>
              {!saved && <button type="button" className={`${styles.primary} booking-cta`} disabled={!consent || saving} onClick={saveAnswers}>{saving ? <Loader2 className={styles.spinner} size={18} /> : <Database size={18} />} {saving ? 'Enviando…' : 'Enviar pré-anamnese'} <ArrowUpRight size={17} /></button>}
              {saved && <><button type="button" className={styles.secondary} onClick={copyAnswers}><Copy size={17} /> Copiar respostas</button><a className={`${styles.primary} booking-cta`} href={whatsappUrl || appointmentUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Continuar no WhatsApp <ArrowUpRight size={17} /></a></>}
              {!consent && !saved && <small>Marque a autorização acima para enviar.</small>}
              <p role="status" className={styles.status}>{status && <><CheckCheck size={18} />{status}</>}</p>
              {manualCopy && consent && <label className={styles.field}>Resumo para copiar<textarea ref={copyArea} readOnly rows={10} value={message} onFocus={e => e.currentTarget.select()} /><button type="button" className={styles.secondary} onClick={() => { copyArea.current?.focus(); copyArea.current?.select(); }}>Selecionar texto</button></label>}
            </div>
            {!saved && <button type="button" className={styles.secondary} onClick={() => go(2)}><ArrowLeft size={17} /> Voltar ao histórico</button>}
          </div>}
        </div>
        <footer className={styles.formFooter}><LockKeyhole size={14} /><span>O envio só acontece após sua autorização. As respostas são armazenadas no sistema privado da clínica.</span></footer>
      </div>
    </main>
    <footer className={styles.footer}><span>DRA. PAULA BRITO · {site.cro}</span><a className="booking-cta" href={appointmentUrl} target="_blank" rel="noreferrer">Prefere conversar com a equipe? <ArrowUpRight size={15} /></a></footer>
  </div>;
}
