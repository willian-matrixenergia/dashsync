-- ══════════════════════════════════════════════════════════════════════════════
-- DashSync — Analytics Queries Reference (Migration 002)
-- These are READ queries used by the API for historical analytics endpoints.
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── Q01: Delta semanal por projeto (últimas 12 semanas) ─────────────────────
-- Used by: Ecrã 02 — DeltaScroller trend context
SELECT
    semana_label,
    projeto_nome,
    programa,
    avg(delta)          AS avg_delta,
    avg(realizado)      AS avg_realizado,
    avg(planejado)      AS avg_planejado
FROM dashsync.progresso_semanal
WHERE semana_date >= today() - INTERVAL 12 WEEK
  AND projeto_id = {projeto_id: String}
GROUP BY semana_label, projeto_nome, programa
ORDER BY semana_label;

-- ─── Q02: Projetos com pior performance (bottom 5 por delta) ─────────────────
-- Used by: Ecrã 01 — criticidade highlights
SELECT
    projeto_id,
    projeto_nome,
    programa,
    coordenador,
    avg(delta)          AS avg_delta,
    latest(realizado)   AS ultimo_realizado,
    count()             AS semanas_negativas
FROM dashsync.progresso_semanal
WHERE semana_date >= today() - INTERVAL 8 WEEK
  AND delta < 0
GROUP BY projeto_id, projeto_nome, programa, coordenador
ORDER BY avg_delta ASC
LIMIT 5;

-- ─── Q03: Tendência de criticidade ao longo do tempo ─────────────────────────
-- Used by: AI summary context
SELECT
    snapshot_date,
    programa,
    criticidade,
    sum(total_projetos) AS total,
    sum(total_mw)       AS mw_total
FROM dashsync.criticidade_weekly_mv
WHERE snapshot_date >= today() - INTERVAL 16 WEEK
GROUP BY snapshot_date, programa, criticidade
ORDER BY snapshot_date, programa;

-- ─── Q04: Progresso vs. planejado — time series com fill (sem gaps) ──────────
-- Used by: Ecrã 02 — SCurve com histórico
SELECT
    semana_date,
    round(avg(planejado),  1)  AS planejado,
    round(avg(realizado),  1)  AS realizado,
    round(avg(tendencia),  1)  AS tendencia,
    round(avg(mod_prevista),  0) AS mod_prevista,
    round(avg(mod_realizada), 0) AS mod_realizada
FROM dashsync.progresso_semanal
WHERE projeto_id = {projeto_id: String}
GROUP BY semana_date
ORDER BY semana_date
WITH FILL FROM
    toMonday(today() - INTERVAL 24 WEEK)
    TO toMonday(today())
    STEP INTERVAL 1 WEEK;

-- ─── Q05: KPIs de uso do dashboard (analytics marketing) ─────────────────────
-- Used by: Internal monitoring dashboard
SELECT
    event_date,
    sum(total_events)   AS total_events,
    sum(unique_sessions) AS unique_sessions,
    sumIf(total_events, ecra = 'portfolio') AS portfolio_views,
    sumIf(total_events, ecra = 'progress')  AS progress_views,
    sumIf(total_events, ecra = 'media')     AS media_views,
    sumIf(total_events, ecra = 'live')      AS live_views
FROM dashsync.usage_daily_mv
WHERE event_date >= today() - 30
GROUP BY event_date
ORDER BY event_date
WITH FILL FROM today() - 30 TO today() STEP 1;

-- ─── Q06: Top projetos visualizados na semana ─────────────────────────────────
SELECT
    t.projeto_id,
    ps.nome,
    ps.programa,
    sum(t.views) AS total_views
FROM dashsync.top_projetos_mv t
LEFT JOIN (
    SELECT DISTINCT ON (projeto_id) projeto_id, nome, programa
    FROM dashsync.portfolio_snapshot
    ORDER BY projeto_id, snapshot_date DESC
) ps USING (projeto_id)
WHERE t.event_date >= toMonday(today())
GROUP BY t.projeto_id, ps.nome, ps.programa
ORDER BY total_views DESC
LIMIT 10;

-- ─── Q07: MOD headcount trend across portfolio ────────────────────────────────
-- Used by: Executive summary context
SELECT
    semana_date,
    sum(mod_prevista)  AS total_mod_prevista,
    sum(mod_realizada) AS total_mod_realizada,
    sum(mod_delta)     AS total_mod_delta
FROM dashsync.progresso_semanal
WHERE semana_date >= today() - INTERVAL 12 WEEK
GROUP BY semana_date
ORDER BY semana_date
WITH FILL FROM toMonday(today() - INTERVAL 12 WEEK) TO toMonday(today()) STEP INTERVAL 1 WEEK;
