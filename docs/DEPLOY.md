# Go-live — passo a passo

O que precisa ser feito **por você** (envolve conta, senha e cartão) está marcado
com 👤. O resto já está no código.

## 1. Supabase 👤

1. Crie o projeto em [supabase.com](https://supabase.com) — região **South America (São Paulo)**.
2. SQL Editor → cole e rode, nesta ordem:
   - `supabase/migrations/0001_init.sql` (tabelas, índices, triggers, RLS, bucket de fotos)
   - `supabase/migrations/0002_seed.sql` — **só se quiser carros de teste**; pule no banco de produção.
3. Authentication → Users → **Add user** → email e senha do vendedor.
   Deixe "Auto Confirm User" marcado. Não existe cadastro público.
4. Settings → API → anote `Project URL` e a chave `anon public`.

> As políticas de RLS deixam o estoque público só para leitura (e escondem o que
> está `inativo`). Qualquer escrita exige estar logado. A chave `anon` pode ir
> para o navegador; a `service_role` **nunca**.

## 2. Variáveis de ambiente

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do passo 1.4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave `anon public` |
| `NEXT_PUBLIC_SITE_URL` | `https://seudominio.com.br` (sem barra no fim) |

`NEXT_PUBLIC_SITE_URL` entra nas tags `og:`, no link que vai junto da mensagem do
WhatsApp e no `sitemap.xml` — se ficar errado, o preview do link no WhatsApp quebra.

**Não** defina `NEXT_PUBLIC_DEMO` em produção (e, mesmo se definir, o modo demo é
ignorado fora de desenvolvimento).

## 3. Vercel 👤

1. Push do repositório para o GitHub.
2. [vercel.com](https://vercel.com) → Add New → Project → importe `revenda-veiculos`.
   O framework é detectado sozinho; `vercel.json` já fixa a região **gru1 (São Paulo)**.
3. Environment Variables → adicione as três da tabela acima em *Production* e *Preview*.
4. Deploy.

> ⚠️ O plano **Hobby é só para uso não comercial**. Para a loja em produção, use o
> plano **Pro (US$ 20/mês)** ou hospede em Cloudflare Pages / Netlify, que permitem
> uso comercial no plano grátis.

## 4. Domínio 👤

1. Registre o `.com.br` no [registro.br](https://registro.br) (~R$ 40/ano).
2. Vercel → Project → Settings → Domains → adicione o domínio.
3. No registro.br, aponte os DNS conforme a Vercel mostrar (normalmente um `A` para
   o apex e um `CNAME` para `www`). A propagação leva de minutos a algumas horas.
4. Volte na Vercel e atualize `NEXT_PUBLIC_SITE_URL` para o domínio final →
   **Redeploy** (variável `NEXT_PUBLIC_` só muda no build).

## 5. Depois do primeiro deploy

- [ ] Entrar em `/admin/login` com o usuário criado no passo 1.3
- [ ] Cadastrar um veículo de verdade, com fotos (o upload comprime antes de subir)
- [ ] Abrir a página do carro e conferir preço, ficha técnica e galeria
- [ ] Clicar em **Chamar no WhatsApp** e ver se a mensagem chega com carro, preço e link
- [ ] Colar o link do carro numa conversa do WhatsApp e ver se aparece foto + preço
      (é o `og:image`; se não aparecer, confira o `NEXT_PUBLIC_SITE_URL`)
- [ ] Abrir o site num celular real, 4G, e repetir o caminho home → carro → WhatsApp
- [ ] `https://seudominio.com.br/sitemap.xml` e `/robots.txt` respondendo
- [ ] Google Search Console: adicionar a propriedade e enviar o sitemap
- [ ] Marcar um carro como **vendido** e conferir a página com o selo
- [ ] Preencher `/admin/configuracoes` (WhatsApp, endereço, horário, Instagram)

## 6. O que já está configurado no código

- **Cache (ISR)**: home e página do veículo revalidam a cada 60s e são atualizadas
  na hora quando o vendedor salva algo no admin (`revalidatePath`). A listagem é
  dinâmica porque depende dos filtros da URL.
- **Analytics e Speed Insights da Vercel** no layout público — só coletam em produção.
  Ative os dois no painel do projeto para ver os dados.
- **Cabeçalhos de segurança** (`next.config.ts`): HSTS, nosniff, SAMEORIGIN,
  Referrer-Policy e Permissions-Policy (câmera liberada só para o upload de fotos).
- **Imagens** em AVIF/WebP com cache de 30 dias.
- **SEO**: `og:image` com a foto de capa, JSON-LD de `Car`, sitemap e `robots.txt`
  bloqueando `/admin`.

## 7. Custos

| Item | Plano | Custo |
|---|---|---|
| Vercel | Pro (uso comercial) | ~US$ 20/mês |
| Supabase | Free (500 MB banco, 1 GB fotos) | R$ 0 |
| Domínio `.com.br` | registro.br | ~R$ 40/ano |

Com ~300 KB por foto, 1 GB dá para aproximadamente 300 carros com 10 fotos cada.
