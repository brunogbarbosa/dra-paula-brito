import 'server-only';
import { healthQuestions, type Intake } from './pre-anamnese';

const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export type SubmissionPayload = { submissionId: string; intake: Intake; consent: boolean; startedAt: number; website?: string };

export function validateSubmission(value: unknown) {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<SubmissionPayload>;
  if (input.website || input.consent !== true || !input.intake || typeof input.intake !== 'object') return null;
  if (!/^[0-9a-f-]{36}$/i.test(text(input.submissionId, 36))) return null;
  if (!Number.isFinite(input.startedAt) || Date.now() - Number(input.startedAt) < 2500 || Date.now() - Number(input.startedAt) > 86_400_000) return null;
  const age = Number(input.intake.age);
  const name = text(input.intake.name, 100);
  const city = text(input.intake.city, 40);
  if (name.length < 2 || !Number.isInteger(age) || age < 1 || age > 120 || !['Recife', 'Surubim', 'Ainda não decidi'].includes(city)) return null;
  const interests = Array.isArray(input.intake.interests) ? input.intake.interests.map(v => text(v, 80)).filter(Boolean).slice(0, 10) : [];
  const health = Object.fromEntries(healthQuestions.map(question => {
    const raw = input.intake?.health?.[question.id];
    const answer = text(raw?.answer, 40);
    const allowed = ['Sim', 'Não', 'Não se aplica', 'Prefiro conversar na consulta'];
    return [question.id, { answer: allowed.includes(answer) ? answer : '', detail: answer === 'Sim' ? text(raw?.detail, 350) : '' }];
  }));
  return { submission_id: text(input.submissionId, 36), name, age, city, interests, objective: text(input.intake.objective, 500), health, notes: text(input.intake.notes, 350), consent_at: new Date().toISOString() };
}
