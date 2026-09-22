# Brief de design — site de revenda de veículos

> Prompt para colar no Claude Design. Direção visual: preto, branco e vermelho — moderno e automotivo.

## Contexto
Site de uma revenda de carros seminovos no Brasil. NÃO tem compra online: o objetivo de
toda página pública é levar o visitante a clicar em "Chamar no WhatsApp". Existe uma área
administrativa onde o vendedor cadastra, edita e exclui veículos (CRUD completo com fotos).

Nome da loja: [NOME DA LOJA]
Cidade: [CIDADE/UF]

## Público
- Comprador: 25–55 anos, acessa 85% pelo celular, vem do Instagram, Google ou de um link
  que o vendedor mandou no WhatsApp. Quer ver foto grande, preço, km, ano e falar rápido.
- Vendedor: usa o admin no notebook e às vezes no celular no pátio, tirando foto e
  cadastrando na hora.

## Direção visual — PRETO, BRANCO E VERMELHO, automotivo e moderno
Sensação: showroom premium à noite. Pense em painel de carro esportivo, luz de freio,
fibra de carbono, faróis de LED. Tem que remeter a carro sem usar clichê de "feirão"
(nada de estrela, letreiro piscando, faixa amarela, fonte itálica gritando).
Referências de sensação: site da Porsche e da Kavak pela limpeza; painel de instrumentos
de carro esportivo pelo contraste preto + vermelho; Webmotors pela clareza da ficha técnica.

### Paleta (tokens)
- preto-base #0A0A0A (fundo principal do site público)
- preto-superficie #141414 (cards, seções)
- preto-elevado #1F1F1F (hover, inputs, bordas sutis)
- branco #FFFFFF (títulos, preço)
- cinza-claro #B3B3B3 (texto secundário: km, ano, labels)
- cinza-borda #2A2A2A (divisores)
- vermelho-primario #E10600 (CTA, destaques, badges, detalhes — usar com moderação, é o acento)
- vermelho-hover #B80500
- vermelho-brilho rgba(225,6,0,0.35) (glow em botões e linha de destaque)
- whatsapp #25D366 (EXCLUSIVO para botões de WhatsApp — é a única cor fora da paleta)
- sucesso/erro no admin podem usar o próprio vermelho pra erro e um verde discreto pra sucesso

Regra: 70% preto, 25% branco/cinza, 5% vermelho. O vermelho aparece onde o olho tem que ir
(preço em destaque, botão primário, badge "Destaque", linha de acento, estado ativo do filtro).
Nunca fundo inteiro vermelho em seção grande.

### Site público: tema escuro por padrão
Fundo preto, cards preto-superfície com borda sutil, fotos do carro "saltando" do fundo.
Opcional: variante clara (fundo branco, texto preto, mesmo vermelho) só se sobrar tempo.

### Admin: tema claro
Fundo branco/cinza-claro, texto preto, vermelho no botão primário e nos estados ativos.
Admin claro pra facilitar leitura de tabela e formulário longo durante o dia.

### Tipografia
- Títulos e preço: fonte geométrica com peso forte, levemente condensada, que lembre
  velocímetro/badge automotivo — ex: "Space Grotesk", "Sora" ou "Barlow Condensed" pros
  números grandes.
- Corpo e formulários: "Inter".
- Preço sempre o maior elemento textual do card (peso 700–800, branco), com "R$" menor.
- Números da ficha técnica (km, ano) em fonte tabular pra alinhar.

### Detalhes automotivos (sutis, não literais)
- Linha de acento vermelha fina (2–3px) no topo dos cards de destaque e embaixo de títulos
  de seção, tipo luz de freio.
- Botões primários com canto 8px e leve glow vermelho no hover.
- Chips de opcionais e filtros com formato levemente chanfrado ou pill escuro com borda
  cinza; estado ativo = borda + texto vermelho.
- Hero com foto grande de carro em fundo preto e gradiente escuro, título branco, uma
  palavra em vermelho.
- Textura de fibra de carbono ou grade de LED só como micro-detalhe de fundo em 2–4% de
  opacidade, nunca em cima de texto.
- Ícones: Lucide, traço 1.5px, branco/cinza; vermelho só no ícone ativo.
- Skeleton de carregamento em cinza-escuro com shimmer.

### Geometria
- Cantos arredondados 12px em cards e fotos, 8px em botões e inputs.
- Fotos de carro sempre em 4:3 nos cards, 16:9 na galeria do detalhe.
- Espaçamento base 8px. Grid de 4px pra alinhar números.

## Telas — site público (tema escuro)

1. Home
   - Header preto translúcido com blur ao rolar: logo, links (Estoque, Sobre, Contato),
     botão WhatsApp verde à direita.
   - Hero: foto de carro grande, headline branca com 1 palavra em vermelho, busca rápida
     (marca, modelo, faixa de preço) em barra escura, CTA vermelho "Ver estoque".
   - "Destaques": grid de cards com linha vermelha no topo.
   - "Por que comprar aqui": 4 itens com ícone em círculo com borda vermelha
     (procedência, laudo cautelar, financiamento, aceitamos troca).
   - Localização: mapa escuro + endereço + horário.
   - Footer preto com WhatsApp, Instagram, endereço, CNPJ.
   - Botão flutuante de WhatsApp verde no canto inferior direito em todas as páginas.

2. Listagem de veículos (/veiculos)
   - Mobile: barra com "Filtrar" (bottom sheet escuro) e "Ordenar"; chips dos filtros
     ativos em vermelho outline.
   - Desktop: sidebar de filtros à esquerda + grid de 3 colunas.
   - Filtros: marca, modelo, preço (mín/máx), ano (mín/máx), km máx, câmbio, combustível,
     carroceria, aceita troca, aceita financiamento. Slider de preço com trilha vermelha.
   - Ordenação: menor preço, maior preço, mais novo, menor km, recentes.
   - Card do veículo: foto capa, badge de status sobre a foto (Reservado = cinza,
     Vendido = preto com risco), badge "Destaque" vermelho, título branco
     (Marca Modelo Versão), linha ano · km · câmbio · combustível em cinza com ícones,
     preço grande branco, botão secundário WhatsApp verde outline.
   - Hover no desktop: card sobe 2px e borda ganha tom vermelho sutil.
   - Estado vazio: ilustração de linha em cinza + "Nenhum veículo com esses filtros" +
     botão "Limpar filtros".

3. Detalhe do veículo (/veiculos/[slug])
   - Galeria: carrossel com swipe no mobile, thumbnails no desktop, contador "3/12",
     tela cheia. Thumbnail ativa com borda vermelha.
   - Bloco principal: título, versão, preço grande branco, "FIPE: R$ X" em cinza,
     tags (Único dono, IPVA pago, Aceita troca…) em pill escuro.
   - Ficha técnica em grid 2 colunas estilo painel de instrumentos: label cinza em cima,
     valor branco embaixo (ano, km, câmbio, combustível, cor, portas, motor, carroceria,
     final da placa).
   - Opcionais em chips agrupados.
   - Descrição em texto.
   - Botões: "Chamar no WhatsApp" (verde, largura total) e "Compartilhar" (outline branco).
   - MOBILE: barra fixa no rodapé, fundo preto com borda superior vermelha fina, preço à
     esquerda, botão WhatsApp à direita, sempre visível.
   - "Veículos parecidos" com 3–4 cards.
   - Variante "Vendido": foto com overlay escuro e selo "VENDIDO" em vermelho, botão vira
     "Ver veículos semelhantes".

## Telas — área do vendedor (/admin, tema claro)

4. Login: fundo branco, logo, email + senha, botão vermelho, link "esqueci a senha".
   Sem cadastro público.

5. Dashboard: 4 cards de métrica (Disponíveis, Reservados, Vendidos no mês, Cliques no
   WhatsApp na semana) com número grande preto e ícone; lista "últimos cadastrados";
   botão vermelho grande "+ Novo veículo".

6. Lista de veículos: tabela com miniatura, título, preço, km, status (select inline),
   destaque (toggle vermelho), data, ações (editar, excluir). Busca por texto, filtro
   por status em tabs. No mobile vira lista de cards. Excluir abre dialog de confirmação
   com o nome do carro e botão vermelho "Excluir".

7. Formulário novo/editar veículo — stepper horizontal com passo ativo em vermelho:
   a) Dados básicos: marca → modelo → versão (selects em cascata), ano fabricação/modelo,
      carroceria, cor, final da placa, preço, valor FIPE (auto-preenchido, editável),
      aceita troca, aceita financiamento, status, destaque.
   b) Ficha técnica: km, câmbio, combustível, motor, portas.
   c) Histórico: único dono, IPVA pago, licenciado, revisões em concessionária,
      laudo cautelar, garantia de fábrica (toggles).
   d) Opcionais: grid de checkboxes agrupados (Conforto / Segurança / Tecnologia / Estética).
   e) Fotos: dropzone tracejada ou botão de câmera no celular, grid de miniaturas
      reordenável por arrastar, marcar capa (ícone de estrela vermelho), remover,
      barra de progresso, limite de 20 fotos.
   f) Descrição: textarea com contador.
   Rodapé fixo branco com "Salvar rascunho" (outline) e "Salvar e publicar" (vermelho).
   Indicador de campos obrigatórios faltando. Erro de validação com borda e texto vermelho,
   toast de sucesso.

8. Configurações: nome da loja, número do WhatsApp (máscara +55), endereço, horário,
   Instagram, upload de logo.

## Componentes que preciso ver isolados
CarCard (normal, hover, reservado, vendido, destaque), botão primário vermelho (default,
hover com glow, disabled), botão WhatsApp (primário, flutuante, barra fixa mobile), chip de
filtro (inativo/ativo), painel de filtros mobile (bottom sheet), slider de preço, galeria,
grid de ficha técnica, linha da tabela admin, dropzone de fotos com thumbnails, badge de
status, cards de métrica, stepper, estados vazio / carregando (skeleton) / erro.

## Regras de UX
- Preço, km e ano precisam ser lidos em menos de 1 segundo em qualquer card.
- Botão WhatsApp sempre a no máximo 1 toque de distância em qualquer tela pública.
- Contraste AA no mínimo — atenção especial ao vermelho #E10600 sobre preto (usar em
  elementos grandes ou com texto branco por cima, nunca texto vermelho pequeno sobre preto).
- Alvos de toque ≥ 44px.
- Nada de pop-up de newsletter ou modal de entrada.
- Textos em português do Brasil, moeda R$ 98.900 (ponto de milhar, sem centavos),
  km 45.000 km.

## Entregáveis
- Telas 1–8 em mobile (390px) e desktop (1440px).
- Folha de componentes com variantes e estados.
- Tokens exportados: cores (com os hex acima), tipografia, espaçamento, raio, sombra, glow.
- Organizar de forma que eu consiga traduzir direto para Tailwind + shadcn/ui em Next.js.
