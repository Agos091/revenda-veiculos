# Plano técnico — Site de revenda de veículos

Site de revenda de carros seminovos com área administrativa (CRUD completo do vendedor) e redirecionamento do cliente para o WhatsApp. Sem compra online.

## 1. O que o site faz

| Quem | O que faz |
|---|---|
| **Cliente** (celular, vindo do Instagram/Google/link no WhatsApp) | Vê estoque → filtra → abre o carro → clica **"Chamar no WhatsApp"** → abre o `wa.me` com mensagem pronta citando o carro |
| **Vendedor** (área `/admin` com login) | Cadastra veículo com todos os dados + fotos, edita, marca como reservado/vendido, exclui |

Sem carrinho, sem pagamento, sem cadastro de cliente.

## 2. Stack

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Renderiza no servidor → Google indexa os carros **e** quando o vendedor cola o link no WhatsApp/Instagram aparece o cartão com foto e preço (`og:image`). Site 100% estático não faz isso. |
| UI | **Tailwind CSS + shadcn/ui** | Componentes de tabela, formulário, dialog, toast prontos — acelera o admin |
| Banco | **Supabase (Postgres)** | Grátis, painel visual, filtros por faixa de preço/km/ano são SQL simples |
| Login | **Supabase Auth** (email + senha) | Só o vendedor loga; sem cadastro público |
| Fotos | **Supabase Storage** + `next/image` | 1 GB grátis. Comprimir no navegador antes de subir (`browser-image-compression`) → ~300 KB/foto → ~300 carros com 10 fotos |
| Formulários | **react-hook-form + zod** | Validação do cadastro |
| Hospedagem | **Vercel** | Deploy automático a cada `git push`; CDN global |
| Domínio | **Registro.br** (.com.br) | ~R$ 40/ano |
| Extras | **API FIPE** (`parallelum.com.br/fipe`) | Dropdown marca → modelo → ano no admin + valor FIPE de referência |

**Descartados:** WordPress + plugin (manutenção, lentidão); Firebase (filtrar por múltiplos campos sem SQL é ruim); SPA pura no GitHub Pages (sem SEO e sem preview de link).

## 3. Modelo de dados

### `veiculos`
- Identificação: `id`, `slug` (ex: `honda-civic-exl-2020-a1b2`), `status` (`disponivel | reservado | vendido | inativo`), `destaque` (bool)
- Básico: `marca`, `modelo`, `versao`, `ano_fabricacao`, `ano_modelo`, `carroceria` (hatch/sedan/suv/picape/van/coupe), `cor`, `final_placa`
- Mecânica: `combustivel` (flex/gasolina/etanol/diesel/hibrido/eletrico), `cambio` (manual/automatico/automatizado/cvt), `motor` ("1.0 turbo"), `portas`, `km`
- Preço: `preco`, `preco_fipe` (opcional), `aceita_troca`, `aceita_financiamento`
- Histórico: `unico_dono`, `ipva_pago`, `licenciado`, `revisoes_concessionaria`, `laudo_cautelar`, `garantia_fabrica`
- `opcionais` (text[]): ar-condicionado, direção elétrica, vidros elétricos, airbag, ABS, multimídia, câmera de ré, sensor de estacionamento, teto solar, bancos de couro, rodas liga leve, piloto automático, start-stop, controle de tração…
- `descricao` (text), `created_at`, `updated_at`

### `veiculo_fotos`
`id`, `veiculo_id`, `url`, `ordem`, `is_capa`

### `configuracoes` (1 linha)
`nome_loja`, `whatsapp`, `endereco`, `cidade`, `horario`, `instagram`

### `cliques_whatsapp` (fase 5)
`veiculo_id`, `created_at` — quais carros geram mais contato

### Segurança (RLS do Supabase)
- `veiculos` / `veiculo_fotos`: leitura pública só de `status <> 'inativo'`; criar/editar/excluir só usuário logado
- Storage bucket `veiculos`: leitura pública, escrita só logado
- `configuracoes`: leitura pública, escrita só logado

## 4. Páginas

### Público
- `/` — hero com busca rápida, destaques, "por que comprar aqui", localização, CTA WhatsApp
- `/veiculos` — listagem com filtros na URL (`?marca=&precoMax=&cambio=`), ordenação, paginação
- `/veiculos/[slug]` — galeria, preço, ficha técnica, opcionais, descrição, **botão WhatsApp fixo no rodapé do celular**, "veículos parecidos"
- Botão flutuante do WhatsApp em todas as páginas

### Admin (`/admin`, protegido por middleware)
- `/admin/login`
- `/admin` — resumo (disponíveis, vendidos no mês, últimos cadastrados)
- `/admin/veiculos` — tabela com foto, título, preço, status, ações (editar / marcar vendido / excluir com confirmação)
- `/admin/veiculos/novo` e `/admin/veiculos/[id]` — mesmo formulário, em abas: Dados básicos → Ficha técnica → Histórico → Opcionais → Fotos (arrastar pra ordenar, escolher capa) → Descrição
- `/admin/configuracoes` — número do WhatsApp, dados da loja

## 5. Fluxo do WhatsApp

```
https://wa.me/55DDDNUMERO?text=Olá! Vi o *Honda Civic EXL 2020* por R$ 98.900 no site e tenho interesse. https://sualoja.com.br/veiculos/honda-civic-exl-2020-a1b2
```

- Mensagem montada com `encodeURIComponent`, abre em nova aba
- Página de detalhe com `og:title`, `og:description` (preço + km + ano) e `og:image` (foto capa) — é isso que faz o link ficar bonito quando compartilhado

## 6. Fases

| Fase | Entrega | Estimativa |
|---|---|---|
| 0 — Setup | Repo, Next.js, Tailwind, shadcn, projeto Supabase, `.env` | ½ dia |
| 1 — Banco | Tabelas, enums, RLS, bucket de fotos, seed com 3 carros de teste | ½ dia |
| 2 — Admin CRUD | Login, tabela, formulário completo, upload/ordenação de fotos, excluir, mudar status | 3–4 dias |
| 3 — Site público | Home, listagem + filtros, detalhe, WhatsApp, SEO/OG, sitemap | 3–4 dias |
| 4 — Go-live | Deploy Vercel, domínio, Analytics, teste em celular real, cadastro do estoque real | 1 dia |
| 5 — Melhorias | Integração FIPE no form, contador de cliques por carro, simulador de parcela, multi-vendedor | depois |

## 7. Hospedagem e custos

| Serviço | Plano | Custo |
|---|---|---|
| Vercel | Hobby (grátis) — **os termos dizem uso não-comercial**. Para loja em produção: Pro (US$ 20/mês) ou Cloudflare Pages / Netlify (grátis, permitem comercial) | R$ 0 a ~R$ 110/mês |
| Supabase | Free (500 MB banco, 1 GB fotos) | R$ 0 (Pro US$ 25/mês só se crescer muito) |
| Domínio .com.br | Registro.br | ~R$ 40/ano |
| **Total para começar** | | **~R$ 40/ano** |

Alternativa com controle total: VPS Hostinger/Contabo (~R$ 30–50/mês) com Coolify — mais manutenção.

## 8. Decisões assumidas
- **1 vendedor** com 1 login (multi-vendedor fica para a fase 5)
- Preços em **R$**, site em **português**, sem versão em inglês
- Fotos hospedadas no Supabase (não em Cloudinary/S3)
- Identidade visual: **preto, branco e vermelho**, moderno, automotivo — ver [BRIEF-DESIGN.md](BRIEF-DESIGN.md)
