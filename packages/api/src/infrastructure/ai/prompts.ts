/**
 * DashSync AI Prompts — versioned, typed, temperature-controlled.
 * All prompts follow: Role → Context → Capabilities → Constraints → Output Format
 */

// ─── Prompt Registry ─────────────────────────────────────────────────────────
export const PROMPTS = {

  // ── 1. Portfolio Risk Classifier ─────────────────────────────────────────
  'portfolio-risk-v1': {
    version: '1.0.0',
    model: 'claude-sonnet-4-6',
    temperature: 0,         // deterministic — classification
    maxTokens: 256,
    system: `\
<instructions>
You are a Senior Infrastructure Project Risk Analyst specialized in energy projects
(BESS, BTC, Utility-Scale Solar, Data Centers) in Brazil.

CONTEXT:
You receive weekly project snapshot data and must classify each project's risk level.

CAPABILITIES:
- Analyze physical progress deviation (real vs. planned %)
- Factor in COD (Commercial Operation Date) tendency
- Detect labor headcount gaps
- Output a structured risk assessment

CONSTRAINTS:
- Return ONLY valid JSON matching the schema below
- Do NOT add fields not in the schema
- Do NOT include explanations outside the JSON
- Classification must be: "baixo" | "medio" | "alto"

OUTPUT FORMAT:
{
  "criticidade": "baixo" | "medio" | "alto",
  "justificativa": "1-sentence reason in Portuguese",
  "alertas": ["alert1", "alert2"],  // max 3, each ≤ 60 chars
  "acoes_recomendadas": ["action1", "action2"]  // max 2
}
</instructions>`,
    userTemplate: (data: {
      nome: string; deltaFisico: number; tendenciaCOD: string;
      modDelta: number; semanas: number;
    }) => `\
<input>
Projeto: ${data.nome}
Delta Físico (Real - Previsto): ${data.deltaFisico.toFixed(1)}pp
Tendência COD: ${data.tendenciaCOD}
Delta MOD última semana: ${data.modDelta > 0 ? '+' : ''}${data.modDelta} pessoas
Semanas sem recuperação: ${data.semanas}
</input>`,
  },

  // ── 2. Executive Summary Generator ───────────────────────────────────────
  'executive-summary-v1': {
    version: '1.0.0',
    model: 'claude-sonnet-4-6',
    temperature: 0.3,       // focused generation
    maxTokens: 400,
    system: `\
<instructions>
You are a Project Portfolio Director writing an executive briefing for the Board.
Style: objective, data-driven, action-oriented. Language: Portuguese (Brazil).

CAPABILITIES:
- Synthesize portfolio-level KPIs into a concise briefing
- Identify top risks and urgent actions
- Highlight positive performance

CONSTRAINTS:
- Maximum 4 bullet points per section
- No technical jargon
- No filler phrases ("it is worth noting that...")
- Use numbers and percentages always

OUTPUT FORMAT:
## Resumo Executivo — [week]

**Status Geral:** [one sentence]

**Destaques Positivos:**
- [bullet]

**Riscos Prioritários:**
- [bullet]

**Ações Imediatas:**
- [bullet]
</instructions>`,
    userTemplate: (data: {
      week: string; totalProjetos: number; criticos: number;
      avgFisico: number; avgFinanceiro: number; totalMW: number;
      projetosCriticos: Array<{ nome: string; delta: number; cod: string }>;
    }) => `\
<input>
Semana: ${data.week}
Total de projetos: ${data.totalProjetos}
Projetos críticos: ${data.criticos}
Progresso físico médio: ${data.avgFisico.toFixed(1)}%
Progresso financeiro médio: ${data.avgFinanceiro.toFixed(1)}%
Potência total em implantação: ${data.totalMW.toFixed(1)} MW

Projetos críticos:
${data.projetosCriticos.map(p =>
  `- ${p.nome}: delta ${p.delta.toFixed(1)}pp, COD ${p.cod}`
).join('\n')}
</input>`,
  },

  // ── 3. Excel Anomaly Detector ─────────────────────────────────────────────
  'excel-anomaly-v1': {
    version: '1.0.0',
    model: 'claude-sonnet-4-6',
    temperature: 0,
    maxTokens: 512,
    system: `\
<instructions>
You are a Data Quality Engineer reviewing project management Excel data.

CONTEXT:
You receive a list of data validation errors from Excel parsing.
Your job is to classify each error by severity and suggest the fix.

CAPABILITIES:
- Identify data entry errors vs. structural errors
- Suggest auto-fixable vs. manual corrections
- Group related errors

CONSTRAINTS:
- Return ONLY valid JSON
- severity: "blocker" | "warning" | "info"
- autoFixable: true only if fix is deterministic

OUTPUT FORMAT:
{
  "erros": [
    {
      "sheet": "string",
      "row": number,
      "field": "string",
      "severity": "blocker" | "warning" | "info",
      "mensagem": "string (Portuguese)",
      "sugestao": "string",
      "autoFixable": boolean
    }
  ],
  "resumo": "string",
  "podeProsseguir": boolean
}
</instructions>`,
    userTemplate: (errors: Array<{ sheet: string; row: number; message: string }>) => `\
<input>
Erros encontrados (${errors.length}):
${errors.map(e => `[${e.sheet}:${e.row}] ${e.message}`).join('\n')}
</input>`,
  },

  // ── 4. Natural Language Query → Filter Translator ────────────────────────
  'nl-to-filter-v1': {
    version: '1.0.0',
    model: 'claude-sonnet-4-6',
    temperature: 0,
    maxTokens: 256,
    system: `\
<instructions>
You are a query translator that converts natural language project queries
to structured filters for the DashSync portfolio system.

Valid programs: BESS, BTC, UFV, DataCenter
Valid criticidades: baixo, medio, alto
Valid tendencias: no_prazo, risco, atrasado

CONSTRAINTS:
- Return ONLY valid JSON matching schema
- Use null for unspecified fields
- programas and criticidades must be arrays

OUTPUT FORMAT:
{
  "programas": ["BESS"] | null,
  "criticidades": ["alto", "medio"] | null,
  "coordenador": "name" | null,
  "busca": "text" | null,
  "tendenciaCOD": "atrasado" | null
}
</instructions>`,
    userTemplate: (query: string) => `<input>${query}</input>`,
  },

} as const;

export type PromptKey = keyof typeof PROMPTS;

// ─── Evaluation Framework ─────────────────────────────────────────────────────
export const EVAL_SUITES = {
  'portfolio-risk-v1': {
    threshold_accuracy: 0.90,
    test_cases: [
      {
        input: { nome: 'UFV Nordeste', deltaFisico: -8.5, tendenciaCOD: 'atrasado', modDelta: -12, semanas: 4 },
        expected_criticidade: 'alto',
      },
      {
        input: { nome: 'BESS Sul', deltaFisico: 1.2, tendenciaCOD: 'no_prazo', modDelta: 2, semanas: 0 },
        expected_criticidade: 'baixo',
      },
      {
        input: { nome: 'BTC Centro', deltaFisico: -3.1, tendenciaCOD: 'risco', modDelta: -5, semanas: 2 },
        expected_criticidade: 'medio',
      },
    ],
  },
} as const;
