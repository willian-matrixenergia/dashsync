-- ══════════════════════════════════════════════════════════════════════════════
-- DashSync — ClickHouse Schema (Migration 001)
-- Purpose: Historical analytics, usage tracking, and pre-aggregated KPI store
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── Database ─────────────────────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS dashsync;

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. PROGRESSO HISTÓRICO POR PROJETO E SEMANA
--    Stores the weekly S-curve snapshots from Base02 for historical queries.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS dashsync.progresso_semanal (
    semana_date     Date,                              -- First day of the week (Monday)
    semana_label    LowCardinality(String),            -- 'YYYY-WXX' from Excel
    projeto_id      String,
    projeto_nome    LowCardinality(String),
    programa        LowCardinality(String),            -- BESS | BTC | UFV | DataCenter
    coordenador     LowCardinality(String),
    planejado       Decimal(5,2),                      -- 0.00–100.00
    realizado       Decimal(5,2),
    tendencia       Decimal(5,2),
    delta           Decimal(6,2) MATERIALIZED realizado - planejado,
    mod_prevista    UInt16,
    mod_realizada   UInt16,
    mod_delta       Int16 MATERIALIZED mod_realizada - mod_prevista,
    carregado_em    DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(carregado_em)
PARTITION BY toYYYYMM(semana_date)
ORDER BY (semana_date, projeto_id)
SETTINGS index_granularity = 8192;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. SNAPSHOT SEMANAL DO PORTFÓLIO (Base01 history)
--    Tracks master metrics per project per week for trend analysis.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS dashsync.portfolio_snapshot (
    snapshot_date       Date,
    projeto_id          String,
    nome                LowCardinality(String),
    programa            LowCardinality(String),
    localidade          LowCardinality(String),
    coordenador         LowCardinality(String),
    supervisor          LowCardinality(String),
    criticidade         LowCardinality(String),        -- baixo | medio | alto
    tendencia_cod       LowCardinality(String),        -- no_prazo | risco | atrasado
    progresso_previsto  Decimal(5,2),
    progresso_realizado Decimal(5,2),
    financeiro_previsto Decimal(5,2),
    financeiro_realizado Decimal(5,2),
    potencia_mw         Decimal(10,3),
    cod_previsto        Date,
    carregado_em        DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(carregado_em)
PARTITION BY toYYYYMM(snapshot_date)
ORDER BY (snapshot_date, projeto_id)
SETTINGS index_granularity = 8192;

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. EVENTOS DE USO DO DASHBOARD (Analytics)
--    Tracks user interactions: filter changes, project selections, screen views.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS dashsync.dashboard_events (
    event_date      Date,
    event_time      DateTime64(3),                    -- millisecond precision
    sessao_id       String,
    event_type      LowCardinality(String),           -- screen_viewed | project_selected | filter_applied | data_reloaded
    ecra            LowCardinality(String),           -- portfolio | progress | media | live
    projeto_id      Nullable(String),
    filtro_json     Nullable(String),                 -- EstadoFiltroDTO as JSON
    duracao_ms      Nullable(UInt32),                 -- time on screen
    device_type     LowCardinality(String)            -- wall | tablet | unknown
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, event_time, sessao_id)
TTL event_date + INTERVAL 2 YEAR
SETTINGS index_granularity = 8192;

-- Skip index for project_id lookups
ALTER TABLE dashsync.dashboard_events
    ADD INDEX IF NOT EXISTS idx_projeto projeto_id TYPE bloom_filter(0.01) GRANULARITY 1;

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. MATERIALIZED VIEWS
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 4a. Evolução semanal da criticidade por programa ──────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS dashsync.criticidade_weekly_mv
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(snapshot_date)
ORDER BY (snapshot_date, programa, criticidade)
AS SELECT
    toMonday(snapshot_date)                             AS snapshot_date,
    programa,
    criticidade,
    count()                                             AS total_projetos,
    sum(potencia_mw)                                    AS total_mw,
    avg(progresso_realizado)                            AS avg_progresso,
    avg(financeiro_realizado)                           AS avg_financeiro
FROM dashsync.portfolio_snapshot
GROUP BY snapshot_date, programa, criticidade;

-- ── 4b. Resumo de uso do dashboard por dia ────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS dashsync.usage_daily_mv
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, ecra, event_type)
AS SELECT
    event_date,
    ecra,
    event_type,
    count()     AS total_events,
    uniq(sessao_id) AS unique_sessions
FROM dashsync.dashboard_events
GROUP BY event_date, ecra, event_type;

-- ── 4c. Top projetos mais visualizados ───────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS dashsync.top_projetos_mv
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, projeto_id)
AS SELECT
    event_date,
    projeto_id,
    count() AS views
FROM dashsync.dashboard_events
WHERE event_type = 'project_selected' AND projeto_id IS NOT NULL
GROUP BY event_date, projeto_id;
