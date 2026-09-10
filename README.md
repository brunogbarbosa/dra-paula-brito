# Dra. Paula Brito

Site editorial de harmonização facial para a Dra. Paula Brito, em Recife e Surubim. Projeto único em Next.js, preparado para importar no Vercel.

## Desenvolvimento

Requisitos: Node.js 20.9 ou superior e npm.

```sh
npm ci
npm run dev
```

## Validação e produção

```sh
npm run typecheck
npm run build
npm start
```

## Publicação na Vercel

1. Importe este repositório no Vercel.
2. Selecione o preset **Next.js**, com a raiz do repositório como Root Directory.
3. Mantenha `npm run build` e o diretório de saída padrão do framework.
4. Quando houver domínio definitivo, configure `NEXT_PUBLIC_SITE_URL` com a URL completa HTTPS e faça novo deploy. Sem essa variável, os metadados usam `VERCEL_PROJECT_PRODUCTION_URL` quando disponível.

Nenhuma chave ou serviço externo é necessário para o funcionamento. O projeto não tem formulário nem banco de dados. Os botões de agendamento abrem o link do WhatsApp informado no material de referência.

## Conteúdo e identidade

- `data/site.ts`: dados profissionais, WhatsApp, Instagram, localidades, procedimentos, galeria e metadados.
- `components/`: capítulos editoriais, menu acessível, animações e galeria com ampliação e comparação por teclado e controle deslizante.
- `app/`: estilos, favicon PB em SVG/ICO, Apple icon e retratos sociais.
- `public/images/`: imagens reais fornecidas, otimizadas para WebP. As fotografias clínicas mantêm os registros e marcas originais, sem retoque de resultado.
- `public/fonts/`: fontes locais e respectivas licenças.

Identidade em areia, café e dourado. Abertura cinematográfica em tela cheia, manifesto tipográfico, cuidados com imagens contextuais, galeria horizontal com navegação por teclado e toque, apresentação da profissional e jornada de atendimento. Layout responsivo com suporte a preferência de movimento reduzido. A comparação é uma visualização dos recortes das fotografias originais; ângulo, luz e enquadramento podem variar.

## Dados usados

Nome, CRO 12935, Recife/Surubim, perfiloplastia, cuidados e link de agendamento foram extraídos do material fornecido. Não foram adicionados números de pacientes, anos de experiência, formações ou depoimentos não confirmados. O domínio final e endereços completos não foram fornecidos e não foram inventados.
