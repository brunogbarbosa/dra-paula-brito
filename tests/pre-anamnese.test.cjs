const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../lib/pre-anamnese.ts'), 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
const { emptyIntake, intakeMessage, intakeWhatsAppUrl, healthQuestions } = context.exports;

test('unanswered health questions are not presented as negative answers', () => {
  const message = intakeMessage(emptyIntake());
  for (const question of healthQuestions) assert.ok(message.includes(`${question.label}: Prefiro conversar na consulta`));
  assert.ok(!message.includes('undefined'));
});
test('review message preserves patient text, selected treatments and authorization', () => {
  const data = emptyIntake();
  data.name = '  Pessoa de teste  ';
  data.age = '35'; data.city = 'Recife';
  data.interests = ['Lipo de papada', 'Rejuvenescimento facial'];
  data.objective = 'Quero conversar & entender minhas opções.';
  data.health.allergies = { answer: 'Sim', detail: 'Informação de teste\nSegunda linha' };
  const message = intakeMessage(data);
  assert.ok(message.includes('Nome: Pessoa de teste\n'));
  assert.ok(message.includes('Idade: 35 anos'));
  assert.ok(message.includes(data.interests.join(', ')));
  assert.ok(message.includes(data.objective));
  assert.ok(message.includes('Sim — Informação de teste\nSegunda linha'));
  assert.ok(message.includes('Autorizo a Dra. Paula Brito'));
});
test('a withdrawn affirmative answer does not leak its old details', () => {
  const data = emptyIntake();
  data.health.medicines = { answer: 'Prefiro conversar na consulta', detail: 'SHOULD_NOT_BE_SHARED' };
  assert.ok(!intakeMessage(data).includes('SHOULD_NOT_BE_SHARED'));
});
test('WhatsApp link targets the clinic and safely encodes accents and punctuation', () => {
  const text = 'Nome: Teste de integração\nObservação: A&B + #1?';
  const url = new URL(intakeWhatsAppUrl('+55 (81) 98587-7074', text));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5581985877074');
  assert.equal(url.searchParams.get('text'), text);
  assert.equal([...url.searchParams.keys()].length, 1);
});
test('missing recipient and long histories select the manual copy flow', () => {
  assert.equal(intakeWhatsAppUrl('', 'teste'), null);
  assert.equal(intakeWhatsAppUrl('123', 'teste'), null);
  assert.equal(intakeWhatsAppUrl('5581985877074', 'á'.repeat(2000)), null);
});
test('new form instances do not reuse previous patient data', () => {
  const first = emptyIntake();
  first.health.allergies.answer = 'Sim'; first.interests.push('Lipo de papada');
  const second = emptyIntake();
  assert.equal(second.health.allergies.answer, '');
  assert.equal(second.interests.length, 0);
});
