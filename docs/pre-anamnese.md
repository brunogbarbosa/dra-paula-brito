# Pré-anamnese

Rota pública: `/pre-anamnese`, acessível pelo menu principal, menu mobile e rodapé. A rota tem `noindex` para não aparecer como página de conteúdo nos buscadores.

O fluxo possui quatro etapas: identificação, objetivos, histórico opcional e revisão. Nome, idade e local de atendimento são obrigatórios. Perguntas não respondidas aparecem no resumo como “Prefiro conversar na consulta”, nunca como respostas negativas. Alterações invalidam a autorização anterior de compartilhamento.

As respostas ficam no estado React da página. Não há API de coleta, banco de dados, localStorage, cookies do formulário ou analytics. O site não recebe nem armazena o conteúdo preenchido. Recarregar reinicia o formulário.

Após autorização explícita, o paciente pode abrir o WhatsApp com a mensagem preenchida ou copiar o resumo. O envio é confirmado pelo próprio paciente no WhatsApp; o site não tem confirmação de entrega. Se o link ultrapassar 7.000 caracteres, a interface orienta copiar e colar para evitar truncamento. Se o acesso à área de transferência falhar, o resumo fica disponível para seleção manual.

O destinatário é `site.whatsapp` em `data/site.ts`, atualmente `5581995702164`. Os textos das perguntas ficam em `lib/pre-anamnese.ts`; interface e estilos em `components/pre-anamnese.*`. A pré-anamnese prepara a conversa e não fornece diagnóstico, indicação de procedimento ou confirmação de consulta.

A clínica recebe e administra os dados enviados na sua conta de WhatsApp. O texto de autorização limita o uso à preparação do atendimento e informa o canal para solicitar acesso, correção, exclusão ou revogação. Se futuramente houver armazenamento, análise de dados ou prontuário, será necessário implementar um fluxo de privacidade apropriado a esse novo uso.

Validação: `npm test` verifica composição do resumo, omissão de detalhes retirados pelo paciente, tratamento de perguntas não respondidas, isolamento entre formulários, destinatário, codificação e limite do link de WhatsApp. `npm run build` valida TypeScript e gera as páginas estáticas.
