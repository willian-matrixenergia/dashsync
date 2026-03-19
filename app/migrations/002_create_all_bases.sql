-- ============================================
-- DASHSYNC: 4 Bases de Dados Estruturadas
-- ============================================

-- Base 01: Gestão de Portfólio (Master)
CREATE TABLE IF NOT EXISTS portfolio_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programa TEXT NOT NULL,
  projeto TEXT NOT NULL UNIQUE,
  potencia_mw DECIMAL(10, 2),
  fase TEXT,
  localidade TEXT,
  inicio DATE,
  termino DATE,
  coordenador TEXT,
  supervisor TEXT,
  avanco_fisico_previsto DECIMAL(5, 2),
  avanco_fisico_real DECIMAL(5, 2),
  avanco_financeiro_real DECIMAL(5, 2),
  num_empreiteiros INTEGER,
  num_profissionais INTEGER,
  mod_prevista INTEGER,
  mod_real INTEGER,
  cod_inicial DATE,
  cod_tendencia DATE,
  cod_real DATE,
  tem_risco_relevante BOOLEAN,
  descricao_riscos TEXT,
  criticidade_risco TEXT,
  resumo_atraso TEXT,
  foi_entregue_prazo BOOLEAN,
  entrada_operacao_assistida DATE,
  finalizacao_operacao_assistida DATE,
  comissionamento_quente DATE,
  testes_coi DATE,
  treinamento_cliente DATE,
  nome_cliente TEXT,
  atendimento_cliente TEXT,
  pct_chamados_atendidos DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Base 02: Evolução e Mão de Obra (Curva S/Histograma)
CREATE TABLE IF NOT EXISTS evolution_labor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programa TEXT NOT NULL,
  projeto TEXT NOT NULL,
  fase TEXT,
  semana DATE NOT NULL,
  pct_planejado_lb DECIMAL(5, 2),
  pct_tendencia DECIMAL(5, 2),
  pct_realizado DECIMAL(5, 2),
  mod_prevista INTEGER,
  mod_real INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projeto) REFERENCES portfolio_master(projeto) ON DELETE CASCADE
);

-- Base 03: Atividades Macro e Disciplinas (Gantt/Velocímetros)
CREATE TABLE IF NOT EXISTS internal_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programa TEXT NOT NULL,
  projeto TEXT NOT NULL,
  fase TEXT,
  atividade TEXT NOT NULL,
  pct_fisico_previsto DECIMAL(5, 2),
  pct_fisico_real DECIMAL(5, 2),
  inicio DATE,
  termino DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projeto) REFERENCES portfolio_master(projeto) ON DELETE CASCADE
);

-- Base 04: Características Técnicas
CREATE TABLE IF NOT EXISTS technical_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programa TEXT NOT NULL,
  projeto TEXT NOT NULL UNIQUE,
  fase TEXT,
  caracteristicas_macro TEXT,
  caracteristicas_detalhadas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projeto) REFERENCES portfolio_master(projeto) ON DELETE CASCADE
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE portfolio_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_specs ENABLE ROW LEVEL SECURITY;

-- Public read access for authenticated users
CREATE POLICY "Public read" ON portfolio_master FOR SELECT USING (true);
CREATE POLICY "Public read" ON evolution_labor FOR SELECT USING (true);
CREATE POLICY "Public read" ON internal_activities FOR SELECT USING (true);
CREATE POLICY "Public read" ON technical_specs FOR SELECT USING (true);

-- Authenticated insert/update (adjust as needed)
CREATE POLICY "Authenticated write" ON portfolio_master FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated write" ON portfolio_master FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON evolution_labor FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated write" ON evolution_labor FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON internal_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated write" ON internal_activities FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON technical_specs FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated write" ON technical_specs FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- Triggers para updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_master_updated_at BEFORE UPDATE ON portfolio_master
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER evolution_labor_updated_at BEFORE UPDATE ON evolution_labor
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER internal_activities_updated_at BEFORE UPDATE ON internal_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER technical_specs_updated_at BEFORE UPDATE ON technical_specs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Índices para performance
-- ============================================
CREATE INDEX idx_portfolio_programa ON portfolio_master(programa);
CREATE INDEX idx_portfolio_projeto ON portfolio_master(projeto);
CREATE INDEX idx_evolution_projeto ON evolution_labor(projeto);
CREATE INDEX idx_activities_projeto ON internal_activities(projeto);
CREATE INDEX idx_specs_projeto ON technical_specs(projeto);
