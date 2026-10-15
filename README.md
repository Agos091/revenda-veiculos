# Revenda de Veículos

Site de revenda de carros seminovos: catálogo público com redirecionamento para o WhatsApp e área administrativa para o vendedor cadastrar, editar e excluir veículos.

## Documentação

- [Plano técnico](docs/PLANO-TECNICO.md) — stack, modelo de dados, páginas, fases, hospedagem e custos
- [Brief de design](docs/BRIEF-DESIGN.md) — direção visual (preto, branco e vermelho)
- [Go-live](docs/DEPLOY.md) — passo a passo de Supabase, Vercel, domínio e checklist pós-deploy

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase (Postgres, Auth, Storage) · Vercel

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha com as chaves do seu projeto Supabase
npm run dev
```

Site público em `http://localhost:3000`, área do vendedor em `/admin`.

### Modo demo

Sem projeto Supabase ainda? Coloque `NEXT_PUBLIC_DEMO=1` no `.env.local`: o site
público e as **leituras** do admin passam a usar 8 carros de exemplo
(`src/lib/veiculos/demo.ts`), e o login é dispensado para dar para navegar pelas
telas. Salvar, excluir e subir foto continuam exigindo Supabase de verdade.
Só funciona em desenvolvimento.

### Testes

```bash
npm test          # vitest run
npm run test:watch
```

Cobrem formatação pt-BR, montagem do link do WhatsApp, o schema de validação do
veículo e os filtros/ordenação do catálogo (rodando sobre os dados de exemplo).

### Banco de dados

No SQL Editor do projeto Supabase, rode na ordem:

1. `supabase/migrations/0001_init.sql` — tabelas, enums, índices, triggers, RLS e bucket `veiculos`
2. `supabase/migrations/0002_seed.sql` — 3 carros de teste (**só em desenvolvimento**)

Depois crie o usuário do vendedor em Authentication → Users (não existe cadastro público).

## Estrutura

```
src/
  app/(site)/     site público — tema escuro
    page.tsx          home (hero, busca rápida, destaques)
    veiculos/         listagem com filtros e página de detalhe
  app/(admin)/    área do vendedor — tema claro
    admin/login/      entrar (Supabase Auth)
    admin/(painel)/   painel, veículos, configurações
  components/ui/  shadcn/ui
  lib/supabase/   clientes de navegador, servidor e middleware
  lib/veiculos/   schema zod, constantes, consultas e server actions
                  (queries.ts = admin, publico.ts = site)
  lib/format.ts   preço, km, ano e rótulos em pt-BR
  lib/whatsapp.ts montagem do link wa.me
  types/          tipos do banco
supabase/migrations/
```

Os dois temas são dois root layouts: o público força `.dark`, o admin fica no tema claro.
Tokens de cor, fonte e raio ficam em `src/app/globals.css`.

## Status

- [x] Planejamento
- [x] Fase 0 — Setup do projeto (Next.js, Tailwind, shadcn, tokens de design, cliente Supabase, middleware do admin)
- [x] Fase 1 — SQL de banco e RLS escrito (falta rodar no projeto Supabase)
- [x] Fase 2 — Admin: login, painel, tabela, formulário em abas, fotos e configurações
- [x] Fase 3 — Site público: home, listagem com filtros, detalhe, WhatsApp, SEO/OG e sitemap
- [x] Testes automatizados (vitest), recuperação de senha, admin em cards no celular
- [~] Fase 4 — Go-live: código pronto (ISR, analytics, headers, 404, ícone) — falta criar Supabase, Vercel e domínio, ver [docs/DEPLOY.md](docs/DEPLOY.md)
