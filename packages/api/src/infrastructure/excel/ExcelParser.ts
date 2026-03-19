import ExcelJS from 'exceljs';
import { Base01RowSchema, Base02RowSchema, Base03RowSchema, type ParseResult } from '@dashsync/shared';
import type { ProjetoRaw } from '../../domain/portfolio/Projeto.js';
import type { EvolucaoSemanalDTO, ProjetoId } from '@dashsync/shared';

const SHEET_BASE01 = 'Base01';
const SHEET_BASE02 = 'Base02';
const SHEET_BASE03 = 'Base03';

// C-002 fix: use Object.create(null) to prevent prototype pollution from Excel data
function rowToObject(row: ExcelJS.Row, headers: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  headers.forEach((h, i) => {
    // Strip any prototype-polluting keys before assignment
    if (h === '__proto__' || h === 'constructor' || h === 'prototype') return;
    obj[h] = row.getCell(i + 1).value;
  });
  return obj;
}

function getHeaders(sheet: ExcelJS.Worksheet): string[] {
  const headerRow = sheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell(cell => { headers.push(String(cell.value ?? '').trim()); });
  return headers;
}

export interface ExcelParseOutput {
  projetos:   ProjetoRaw[];
  evolucoes:  EvolucaoSemanalDTO[];
  errors:     Array<{ sheet: string; row: number; message: string }>;
}

export async function parseExcelFile(filePath: string): Promise<ExcelParseOutput> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  const errors: ExcelParseOutput['errors'] = [];
  const projetos: ProjetoRaw[] = [];
  const evolucaoMap = new Map<string, EvolucaoSemanalDTO>();

  // ─── Base01 ────────────────────────────────────────────────────────────────
  const sheet01 = wb.getWorksheet(SHEET_BASE01);
  if (sheet01) {
    const headers = getHeaders(sheet01);
    sheet01.eachRow((row, rowNum) => {
      if (rowNum === 1) return;
      const raw = rowToObject(row, headers);
      const parsed = Base01RowSchema.safeParse(raw);
      if (!parsed.success) {
        errors.push({ sheet: SHEET_BASE01, row: rowNum, message: parsed.error.message });
        return;
      }
      const d = parsed.data;
      projetos.push({
        id: d.id, nome: d.nome, programa: d.programa, localidade: d.localidade,
        coordenador: d.coordenador, supervisor: d.supervisor,
        progressoPrevisto: d.progressoPrevisto, progressoRealizado: d.progressoRealizado,
        financeiroPrevisto: d.financeiroPrevisto, financeiroRealizado: d.financeiroRealizado,
        criticidade: d.criticidade, codPrevisto: d.codPrevisto, tendenciaCOD: d.tendenciaCOD,
        potenciaMW: d.potenciaMW, cronograma: [], disciplinas: buildEmptyDisciplinas(),
      });
    });
  }

  // ─── Base02 ────────────────────────────────────────────────────────────────
  const sheet02 = wb.getWorksheet(SHEET_BASE02);
  if (sheet02) {
    const headers = getHeaders(sheet02);
    sheet02.eachRow((row, rowNum) => {
      if (rowNum === 1) return;
      const raw = rowToObject(row, headers);
      const parsed = Base02RowSchema.safeParse(raw);
      if (!parsed.success) {
        errors.push({ sheet: SHEET_BASE02, row: rowNum, message: parsed.error.message });
        return;
      }
      const d = parsed.data;
      const existing = evolucaoMap.get(d.projetoId) ?? {
        projetoId: d.projetoId as ProjetoId, scurve: [], labor: [],
      };
      existing.scurve.push({ semana: d.semana, planejado: d.planejado,
                             realizado: d.realizado, tendencia: d.tendencia });
      existing.labor.push({ semana: d.semana, modPrevista: d.modPrevista,
                            modRealizada: d.modRealizada });
      evolucaoMap.set(d.projetoId, existing);
    });
  }

  // ─── Base03 ────────────────────────────────────────────────────────────────
  const sheet03 = wb.getWorksheet(SHEET_BASE03);
  if (sheet03) {
    const headers = getHeaders(sheet03);
    const disciplinaMap = new Map<string, Record<string, { previsto: number; realizado: number }>>();
    sheet03.eachRow((row, rowNum) => {
      if (rowNum === 1) return;
      const raw = rowToObject(row, headers);
      const parsed = Base03RowSchema.safeParse(raw);
      if (!parsed.success) {
        errors.push({ sheet: SHEET_BASE03, row: rowNum, message: parsed.error.message });
        return;
      }
      const d = parsed.data;
      const map = disciplinaMap.get(d.projetoId) ?? {};
      map[d.disciplina.toLowerCase()] = { previsto: d.progressoPrevisto, realizado: d.progressoRealizado };
      disciplinaMap.set(d.projetoId, map);

      const projeto = projetos.find(p => p.id === d.projetoId);
      if (projeto) {
        projeto.cronograma.push({
          nome: d.disciplina, inicio: d.inicio, fim: d.fim,
          previsto: d.progressoPrevisto, realizado: d.progressoRealizado,
        });
      }
    });

    for (const projeto of projetos) {
      const disc = disciplinaMap.get(projeto.id);
      if (!disc) continue;
      projeto.disciplinas = {
        engenharia:      disc['engenharia']      ?? { previsto: 0, realizado: 0 },
        suprimentos:     disc['suprimentos']     ?? { previsto: 0, realizado: 0 },
        construcao:      disc['construção']      ?? disc['construcao'] ?? { previsto: 0, realizado: 0 },
        comissionamento: disc['comissionamento'] ?? { previsto: 0, realizado: 0 },
      };
    }
  }

  return { projetos, evolucoes: Array.from(evolucaoMap.values()), errors };
}

function buildEmptyDisciplinas() {
  const empty = { previsto: 0, realizado: 0 };
  return { engenharia: empty, suprimentos: { ...empty },
           construcao: { ...empty }, comissionamento: { ...empty } };
}
