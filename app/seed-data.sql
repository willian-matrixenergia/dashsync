-- ============================================
-- SEED DATA - Dados de Teste para DashSync
-- ============================================

-- Clear existing data
DELETE FROM evolution_labor;
DELETE FROM internal_activities;
DELETE FROM technical_specs;
DELETE FROM portfolio_master;

-- ============================================
-- Base 01: Portfolio Master
-- ============================================
INSERT INTO portfolio_master (
  programa, projeto, potencia_mw, fase, localidade, inicio, termino,
  coordenador, supervisor, avanco_fisico_previsto, avanco_fisico_real,
  avanco_financeiro_real, num_empreiteiros, num_profissionais,
  mod_prevista, mod_real, cod_inicial, cod_tendencia, cod_real,
  tem_risco_relevante, descricao_riscos, criticidade_risco,
  resumo_atraso, foi_entregue_prazo, nome_cliente, pct_chamados_atendidos
) VALUES
(
  'BESS', 'Pacto', 20.5, 'Execução', 'Paraná',
  '2025-05-12', '2026-02-28',
  'João Silva', 'Maria Santos', 70, 68.5,
  69.2, 3, 45,
  450, 482, '2026-01-15', '2026-02-26', NULL,
  true, 'Atrasos na entrega de componentes do BOS', 'Alta',
  'Atraso de 2 semanas no cronograma de suprimentos',
  false, 'Concessionária XYZ', 92.5
),
(
  'UFV', 'SolarMax', 15.0, 'Financiamento', 'São Paulo',
  '2026-03-01', '2027-06-30',
  'Pedro Costa', 'Ana Lima', 15, 12.0,
  18.5, 2, 30,
  200, 185, '2027-06-01', '2027-06-15', NULL,
  false, NULL, 'Baixa',
  NULL, NULL, 'Gerador Energia', 100.0
),
(
  'BTC', 'DataCenter Sul', 5.0, 'Projeto', 'Santa Catarina',
  '2026-04-15', '2026-12-31',
  'Carlos Mendes', 'Lucia Ferreira', 5, 0.0,
  2.0, 1, 15,
  100, 0, '2026-12-01', '2027-01-15', NULL,
  false, NULL, 'Média',
  NULL, NULL, 'Tech Solutions', 85.0
);

-- ============================================
-- Base 02: Evolution & Labor
-- ============================================
INSERT INTO evolution_labor (
  programa, projeto, fase, semana,
  pct_planejado_lb, pct_tendencia, pct_realizado,
  mod_prevista, mod_real
) VALUES
-- Pacto - 12 semanas
('BESS', 'Pacto', 'Execução', '2025-12-26', 5.00, 3.33, 3.33, 20, 21),
('BESS', 'Pacto', 'Execução', '2026-01-02', 10.00, 8.50, 7.85, 28, 32),
('BESS', 'Pacto', 'Execução', '2026-01-09', 15.00, 14.20, 13.50, 35, 38),
('BESS', 'Pacto', 'Execução', '2026-01-16', 22.00, 21.80, 21.20, 42, 45),
('BESS', 'Pacto', 'Execução', '2026-01-23', 30.00, 29.50, 28.90, 48, 50),
('BESS', 'Pacto', 'Execução', '2026-01-30', 40.00, 39.80, 39.10, 50, 51),
('BESS', 'Pacto', 'Execução', '2026-02-06', 50.00, 52.00, 51.50, 55, 56),
('BESS', 'Pacto', 'Execução', '2026-02-13', 60.00, 62.50, 62.00, 58, 60),
('BESS', 'Pacto', 'Execução', '2026-02-20', 70.00, 69.00, 68.50, 50, 52),
-- SolarMax
('UFV', 'SolarMax', 'Financiamento', '2026-03-01', 5.00, 4.50, 3.50, 15, 14),
('UFV', 'SolarMax', 'Financiamento', '2026-03-08', 8.00, 7.80, 6.50, 18, 16);

-- ============================================
-- Base 03: Internal Activities
-- ============================================
INSERT INTO internal_activities (
  programa, projeto, fase, atividade,
  pct_fisico_previsto, pct_fisico_real,
  inicio, termino
) VALUES
-- Pacto
('BESS', 'Pacto', 'Execução', 'BOS - Engenharia', 100, 100, '2025-11-03', '2025-12-03'),
('BESS', 'Pacto', 'Execução', 'BOS - Suprimentos', 85, 80, '2025-12-01', '2026-02-15'),
('BESS', 'Pacto', 'Execução', 'BOS - Construção (geral)', 96, 93, '2026-01-03', '2026-02-14'),
('BESS', 'Pacto', 'Execução', 'Comissionamento à frio', 50, 45, '2026-02-01', '2026-03-15'),
-- SolarMax
('UFV', 'SolarMax', 'Financiamento', 'Engenharia (EPCM)', 20, 15, '2026-03-01', '2026-06-30'),
('UFV', 'SolarMax', 'Financiamento', 'Suprimentos (Painéis)', 10, 5, '2026-05-01', '2027-04-30'),
-- DataCenter Sul
('BTC', 'DataCenter Sul', 'Projeto', 'Engenharia Básica', 15, 0, '2026-04-15', '2026-06-30');

-- ============================================
-- Base 04: Technical Specs
-- ============================================
INSERT INTO technical_specs (
  programa, projeto, fase,
  caracteristicas_macro,
  caracteristicas_detalhadas
) VALUES
(
  'BESS', 'Pacto', 'Execução',
  'Local: Coronel Vivida (PR). Projeto: Montagem eletromecânica de 08 BESS (2,5MVA). Tensão: 13,8 kV. Tecnologia: Bateria de Lítio.',
  'Sistema de armazenamento com 50 unidades de Power Conversion System (PCS) Sieemns e 40 transformadores de 630 kVA. Área construída: 2.500 m². Estrutura de concreto armado. Painéis solares de alta eficiência (22% de rendimento).'
),
(
  'UFV', 'SolarMax', 'Financiamento',
  'Local: Interior de São Paulo. Projeto: Fazenda solar de 15 MWp. Tecnologia: Painéis bifaciais com tracking solar.',
  'Totalidade de 35.000 painéis solares. Investidores: 5 fundos de pensão nacionais. Prazo: 18 meses. Certificação INMETRO. Conexão à rede em 138 kV.'
),
(
  'BTC', 'DataCenter Sul', 'Projeto',
  'Local: Vale do Taquari (SC). Projeto: Data Center de 5 MW. Certificação: ISO 27001, ISO 14001.',
  'Infraestrutura: 500 racks, refrigeração evaporativa, gerador de backup de 5 MW, redundância N+2. Conexão de fibra óptica dedicada. Escalável para 15 MW.'
);
