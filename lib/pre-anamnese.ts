export const healthQuestions = [
  { id: 'allergies', label: 'Você tem alguma alergia?', hint: 'Inclua, se souber, medicamentos, anestésicos, látex ou outros produtos.' },
  { id: 'medicines', label: 'Usa medicamentos ou suplementos?', hint: 'Se desejar, informe os nomes e a frequência de uso.' },
  { id: 'conditions', label: 'Tem alguma condição de saúde ou faz acompanhamento?', hint: 'Compartilhe o que considerar relevante para a avaliação.' },
  { id: 'pregnancy', label: 'Está gestante ou amamentando?', hint: 'Você também pode conversar sobre isso diretamente na consulta.' },
  { id: 'previous', label: 'Já realizou procedimentos no rosto ou no pescoço?', hint: 'Se souber, informe quais, quando e se houve alguma reação.' },
] as const;
export type HealthId = typeof healthQuestions[number]['id'];
export type HealthAnswer = { answer: string; detail: string };
export type Intake = { name: string; whatsapp: string; age: string; city: string; interests: string[]; objective: string; health: Record<HealthId, HealthAnswer>; notes: string };
export function emptyIntake(): Intake {
  return { name: '', whatsapp: '', age: '', city: '', interests: [], objective: '', health: Object.fromEntries(healthQuestions.map(q => [q.id, { answer: '', detail: '' }])) as Intake['health'], notes: '' };
}
export function normalizeBrazilPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return /^55\d{10,11}$/.test(digits) ? digits : '';
}
export function formatBrazilPhone(value: string) {
  const local = value.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
  if (local.length <= 2) return local;
  if (local.length <= 6) return `(${local.slice(0, 2)}) ${local.slice(2)}`;
  if (local.length <= 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
}
export function intakeSections(data: Intake) {
  return [
    { title: 'Sobre você', fields: [['Nome', data.name.trim()], ['WhatsApp', formatBrazilPhone(data.whatsapp)], ['Idade', `${data.age} anos`], ['Atendimento', data.city]] },
    { title: 'Seus objetivos', fields: [['Interesses', data.interests.join(', ') || 'Quero orientação na avaliação'], ['O que gostaria de cuidar', data.objective.trim() || 'Prefiro conversar na consulta']] },
    { title: 'Seu histórico', fields: [...healthQuestions.map(q => {
      const value = data.health[q.id];
      return [q.label, value.answer ? `${value.answer}${value.answer === 'Sim' && value.detail.trim() ? ` — ${value.detail.trim()}` : ''}` : 'Prefiro conversar na consulta'];
    }), ['Algo mais para compartilhar', data.notes.trim() || 'Não informado']] },
  ];
}
export function intakeMessage(data: Intake) {
  return ['PRÉ-ANAMNESE | DRA. PAULA BRITO', ...intakeSections(data).map(section => `\n${section.title.toUpperCase()}\n${section.fields.map(([label, value]) => `${label}: ${value}`).join('\n')}`), '\nAutorizo a Dra. Paula Brito e sua equipe a receber e utilizar estas informações, inclusive dados de saúde, para preparar meu atendimento. Estou ciente de que esta pré-anamnese não substitui a consulta.'].join('\n');
}
export function intakeWhatsAppUrl(phone: string, message: string) {
  const number = phone.replace(/\D/g, '');
  if (!/^\d{10,15}$/.test(number)) return null;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  // Long histories use the copy flow instead of risking a truncated app link.
  return url.length <= 7000 ? url : null;
}
