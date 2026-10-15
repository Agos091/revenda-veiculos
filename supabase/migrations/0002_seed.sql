-- =============================================================================
-- Seed de desenvolvimento — 3 carros de teste (fotos de placeholder).
-- NÃO rodar no banco de produção com estoque real.
-- =============================================================================

insert into public.veiculos (
  slug, status, destaque, marca, modelo, versao,
  ano_fabricacao, ano_modelo, carroceria, cor, final_placa,
  combustivel, cambio, motor, portas, km,
  preco, preco_fipe, aceita_troca, aceita_financiamento,
  unico_dono, ipva_pago, licenciado, revisoes_concessionaria, laudo_cautelar, garantia_fabrica,
  opcionais, descricao
) values
(
  'honda-civic-exl-2020-a1b2', 'disponivel', true, 'Honda', 'Civic', 'EXL 2.0 CVT',
  2019, 2020, 'sedan', 'Prata', 4,
  'flex', 'cvt', '2.0 16v', 4, 45000,
  98900, 101200, true, true,
  true, true, true, true, true, false,
  array['Ar-condicionado digital', 'Bancos de couro', 'Câmera de ré', 'Multimídia', 'Rodas de liga leve', 'Piloto automático'],
  'Civic EXL de único dono, todas as revisões feitas na concessionária e laudo cautelar aprovado. Pneus novos.'
),
(
  'jeep-compass-longitude-2021-c3d4', 'disponivel', true, 'Jeep', 'Compass', 'Longitude 1.3 T270',
  2021, 2021, 'suv', 'Branco', 7,
  'flex', 'automatico', '1.3 turbo', 4, 62000,
  132900, 135000, true, true,
  false, true, true, true, true, true,
  array['Ar-condicionado dual zone', 'Sensor de estacionamento', 'Câmera de ré', 'Faróis de LED', 'Controle de tração', 'Start-stop'],
  'Compass Longitude com garantia de fábrica vigente. Revisões em dia, segundo dono.'
),
(
  'volkswagen-gol-1-0-2018-e5f6', 'reservado', false, 'Volkswagen', 'Gol', '1.0 MPI Trendline',
  2018, 2018, 'hatch', 'Vermelho', 1,
  'flex', 'manual', '1.0 12v', 4, 78500,
  48900, 50100, false, true,
  false, false, true, false, true, false,
  array['Ar-condicionado', 'Direção elétrica', 'Vidros elétricos', 'Airbag duplo', 'ABS'],
  'Gol Trendline econômico, ideal para o dia a dia. Documentação em ordem.'
)
on conflict (slug) do nothing;

-- fotos de placeholder (3 por carro, a primeira é a capa)
insert into public.veiculo_fotos (veiculo_id, url, ordem, is_capa)
select
  v.id,
  format('https://picsum.photos/seed/%s-%s/1200/900', v.slug, g.ordem),
  g.ordem,
  g.ordem = 0
from public.veiculos v
cross join (values (0), (1), (2)) as g(ordem)
where v.slug in (
  'honda-civic-exl-2020-a1b2',
  'jeep-compass-longitude-2021-c3d4',
  'volkswagen-gol-1-0-2018-e5f6'
)
and not exists (
  select 1 from public.veiculo_fotos f where f.veiculo_id = v.id
);

update public.configuracoes set
  nome_loja = 'Minha Revenda',
  whatsapp = '5511999999999',
  endereco = 'Av. Exemplo, 1000',
  cidade = 'São Paulo/SP',
  horario = 'Seg a Sex 9h–18h · Sáb 9h–13h',
  instagram = 'minharevenda'
where id = 1;
