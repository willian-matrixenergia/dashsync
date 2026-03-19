import Anthropic from '@anthropic-ai/sdk';
import type { PromptKey } from './prompts.js';
import { PROMPTS } from './prompts.js';
import type { Result } from '@dashsync/shared';

const client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });

export async function callPrompt<TInput, TOutput>(
  key: PromptKey,
  buildUserMessage: (data: TInput) => string,
  input: TInput,
): Promise<Result<TOutput, string>> {
  const prompt = PROMPTS[key];

  try {
    const response = await client.messages.create({
      model:      prompt.model,
      max_tokens: prompt.maxTokens,
      temperature: prompt.temperature,
      system:     prompt.system,
      messages: [{ role: 'user', content: buildUserMessage(input) }],
    });

    const text = response.content[0];
    if (text?.type !== 'text') return { ok: false, error: 'No text content in response' };

    const parsed = JSON.parse(text.text) as TOutput;
    return { ok: true, value: parsed };
  } catch (err) {
    return { ok: false, error: `AI call failed: ${String(err)}` };
  }
}

// ─── Typed wrappers per prompt ─────────────────────────────────────────────────
export interface RiskAssessment {
  criticidade:          'baixo' | 'medio' | 'alto';
  justificativa:        string;
  alertas:              string[];
  acoes_recomendadas:   string[];
}

export async function assessProjectRisk(data: {
  nome: string; deltaFisico: number; tendenciaCOD: string;
  modDelta: number; semanas: number;
}): Promise<Result<RiskAssessment, string>> {
  const p = PROMPTS['portfolio-risk-v1'];
  return callPrompt<typeof data, RiskAssessment>(
    'portfolio-risk-v1',
    d => p.userTemplate(d),
    data,
  );
}

export async function generateExecutiveSummary(data: {
  week: string; totalProjetos: number; criticos: number;
  avgFisico: number; avgFinanceiro: number; totalMW: number;
  projetosCriticos: Array<{ nome: string; delta: number; cod: string }>;
}): Promise<Result<string, string>> {
  const p = PROMPTS['executive-summary-v1'];
  try {
    const response = await client.messages.create({
      model: p.model, max_tokens: p.maxTokens, temperature: p.temperature,
      system: p.system,
      messages: [{ role: 'user', content: p.userTemplate(data) }],
    });
    const text = response.content[0];
    if (text?.type !== 'text') return { ok: false, error: 'No text content' };
    return { ok: true, value: text.text };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export interface FilterFromNL {
  programas:     string[] | null;
  criticidades:  string[] | null;
  coordenador:   string | null;
  busca:         string | null;
  tendenciaCOD:  string | null;
}

export async function translateNLToFilter(query: string): Promise<Result<FilterFromNL, string>> {
  const p = PROMPTS['nl-to-filter-v1'];
  return callPrompt<string, FilterFromNL>(
    'nl-to-filter-v1',
    q => p.userTemplate(q),
    query,
  );
}
