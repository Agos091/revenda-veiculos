-- =============================================================================
-- Fase 1 — Banco de dados, RLS e bucket de fotos
-- Rodar no SQL Editor do projeto Supabase (uma vez, na ordem dos arquivos).
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$ begin
  create type status_veiculo as enum ('disponivel', 'reservado', 'vendido', 'inativo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type carroceria as enum ('hatch', 'sedan', 'suv', 'picape', 'van', 'coupe');
exception when duplicate_object then null; end $$;

do $$ begin
  create type combustivel as enum ('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cambio as enum ('manual', 'automatico', 'automatizado', 'cvt');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- veiculos
-- -----------------------------------------------------------------------------
create table if not exists public.veiculos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status status_veiculo not null default 'disponivel',
  destaque boolean not null default false,

  marca text not null,
  modelo text not null,
  versao text,
  ano_fabricacao smallint not null check (ano_fabricacao between 1950 and 2100),
  ano_modelo smallint not null check (ano_modelo between 1950 and 2100),
  carroceria carroceria,
  cor text,
  final_placa smallint check (final_placa between 0 and 9),

  combustivel combustivel,
  cambio cambio,
  motor text,
  portas smallint check (portas between 1 and 6),
  km integer not null default 0 check (km >= 0),

  preco numeric(12, 2) not null check (preco >= 0),
  preco_fipe numeric(12, 2) check (preco_fipe >= 0),
  aceita_troca boolean not null default false,
  aceita_financiamento boolean not null default false,

  unico_dono boolean not null default false,
  ipva_pago boolean not null default false,
  licenciado boolean not null default false,
  revisoes_concessionaria boolean not null default false,
  laudo_cautelar boolean not null default false,
  garantia_fabrica boolean not null default false,

  opcionais text[] not null default '{}',
  descricao text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- filtros da listagem pública
create index if not exists veiculos_status_idx on public.veiculos (status);
create index if not exists veiculos_destaque_idx on public.veiculos (destaque) where destaque;
create index if not exists veiculos_preco_idx on public.veiculos (preco);
create index if not exists veiculos_km_idx on public.veiculos (km);
create index if not exists veiculos_ano_idx on public.veiculos (ano_modelo);
create index if not exists veiculos_marca_modelo_idx on public.veiculos (marca, modelo);
create index if not exists veiculos_created_at_idx on public.veiculos (created_at desc);

-- -----------------------------------------------------------------------------
-- veiculo_fotos
-- -----------------------------------------------------------------------------
create table if not exists public.veiculo_fotos (
  id uuid primary key default gen_random_uuid(),
  veiculo_id uuid not null references public.veiculos (id) on delete cascade,
  url text not null,
  ordem smallint not null default 0,
  is_capa boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists veiculo_fotos_veiculo_idx
  on public.veiculo_fotos (veiculo_id, ordem);

-- no máximo uma capa por veículo
create unique index if not exists veiculo_fotos_capa_unica
  on public.veiculo_fotos (veiculo_id) where is_capa;

-- -----------------------------------------------------------------------------
-- configuracoes (linha única, id = 1)
-- -----------------------------------------------------------------------------
create table if not exists public.configuracoes (
  id smallint primary key default 1 check (id = 1),
  nome_loja text not null default 'Minha Revenda',
  whatsapp text not null default '',
  endereco text,
  cidade text,
  horario text,
  instagram text,
  updated_at timestamptz not null default now()
);

insert into public.configuracoes (id) values (1) on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- cliques_whatsapp (métrica: quais carros geram contato)
-- -----------------------------------------------------------------------------
create table if not exists public.cliques_whatsapp (
  id uuid primary key default gen_random_uuid(),
  veiculo_id uuid references public.veiculos (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists cliques_whatsapp_veiculo_idx
  on public.cliques_whatsapp (veiculo_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Triggers: updated_at e slug automático
-- -----------------------------------------------------------------------------
create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists veiculos_updated_at on public.veiculos;
create trigger veiculos_updated_at
  before update on public.veiculos
  for each row execute function public.tocar_updated_at();

drop trigger if exists configuracoes_updated_at on public.configuracoes;
create trigger configuracoes_updated_at
  before update on public.configuracoes
  for each row execute function public.tocar_updated_at();

-- honda-civic-exl-2020-a1b2
create or replace function public.gerar_slug_veiculo()
returns trigger
language plpgsql
as $$
declare
  base text;
begin
  if new.slug is null or btrim(new.slug) = '' then
    base := lower(unaccent(
      concat_ws(' ', new.marca, new.modelo, new.versao, new.ano_modelo)
    ));
    base := regexp_replace(base, '[^a-z0-9]+', '-', 'g');
    base := btrim(base, '-');
    new.slug := base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 4);
  end if;
  return new;
end;
$$;

drop trigger if exists veiculos_slug on public.veiculos;
create trigger veiculos_slug
  before insert on public.veiculos
  for each row execute function public.gerar_slug_veiculo();

-- =============================================================================
-- RLS — leitura pública do estoque, escrita só para o vendedor logado
-- =============================================================================
alter table public.veiculos enable row level security;
alter table public.veiculo_fotos enable row level security;
alter table public.configuracoes enable row level security;
alter table public.cliques_whatsapp enable row level security;

-- veiculos
drop policy if exists "veiculos: leitura pública" on public.veiculos;
create policy "veiculos: leitura pública"
  on public.veiculos for select
  to anon, authenticated
  using (status <> 'inativo');

drop policy if exists "veiculos: leitura total do vendedor" on public.veiculos;
create policy "veiculos: leitura total do vendedor"
  on public.veiculos for select
  to authenticated
  using (true);

drop policy if exists "veiculos: escrita do vendedor" on public.veiculos;
create policy "veiculos: escrita do vendedor"
  on public.veiculos for all
  to authenticated
  using (true)
  with check (true);

-- veiculo_fotos
drop policy if exists "fotos: leitura pública" on public.veiculo_fotos;
create policy "fotos: leitura pública"
  on public.veiculo_fotos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.veiculos v
      where v.id = veiculo_id and v.status <> 'inativo'
    )
  );

drop policy if exists "fotos: leitura total do vendedor" on public.veiculo_fotos;
create policy "fotos: leitura total do vendedor"
  on public.veiculo_fotos for select
  to authenticated
  using (true);

drop policy if exists "fotos: escrita do vendedor" on public.veiculo_fotos;
create policy "fotos: escrita do vendedor"
  on public.veiculo_fotos for all
  to authenticated
  using (true)
  with check (true);

-- configuracoes
drop policy if exists "config: leitura pública" on public.configuracoes;
create policy "config: leitura pública"
  on public.configuracoes for select
  to anon, authenticated
  using (true);

drop policy if exists "config: escrita do vendedor" on public.configuracoes;
create policy "config: escrita do vendedor"
  on public.configuracoes for update
  to authenticated
  using (true)
  with check (true);

-- cliques_whatsapp: qualquer visitante registra, só o vendedor lê
drop policy if exists "cliques: registro público" on public.cliques_whatsapp;
create policy "cliques: registro público"
  on public.cliques_whatsapp for insert
  to anon, authenticated
  with check (true);

drop policy if exists "cliques: leitura do vendedor" on public.cliques_whatsapp;
create policy "cliques: leitura do vendedor"
  on public.cliques_whatsapp for select
  to authenticated
  using (true);

-- =============================================================================
-- Storage — bucket público "veiculos", escrita só para o vendedor logado
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('veiculos', 'veiculos', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos veiculos: leitura pública" on storage.objects;
create policy "fotos veiculos: leitura pública"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'veiculos');

drop policy if exists "fotos veiculos: upload do vendedor" on storage.objects;
create policy "fotos veiculos: upload do vendedor"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'veiculos');

drop policy if exists "fotos veiculos: update do vendedor" on storage.objects;
create policy "fotos veiculos: update do vendedor"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'veiculos');

drop policy if exists "fotos veiculos: delete do vendedor" on storage.objects;
create policy "fotos veiculos: delete do vendedor"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'veiculos');
