import { z } from 'zod';
import { NIVEIS_CRITICIDADE, PROGRAMAS, TENDENCIAS_COD } from './types.js';

// ─── Excel Row Schemas (Base 01 — Dados mestres) ──────────────────────────────
export const Base01RowSchema = z.object({
  id:                   z.string().min(1),
  nome:                 z.string().min(1),
  programa:             z.enum(PROGRAMAS),
  localidade:           z.string().min(1),
  coordenador:          z.string().min(1),
  supervisor:           z.string().min(1),
  progressoPrevisto:    z.number().min(0).max(100),
  progressoRealizado:   z.number().min(0).max(100),
  financeiroPrevisto:   z.number().min(0).max(100),
  financeiroRealizado:  z.number().min(0).max(100),
  criticidade:          z.enum(NIVEIS_CRITICIDADE),
  codPrevisto:          z.coerce.date(),
  tendenciaCOD:         z.enum(TENDENCIAS_COD),
  potenciaMW:           z.number().positive(),
  fase:                 z.string().optional(),
});
export type Base01Row = z.infer<typeof Base01RowSchema>;

// ─── Base 02 — Evolução semanal ───────────────────────────────────────────────
export const Base02RowSchema = z.object({
  projetoId:    z.string().min(1),
  semana:       z.string().regex(/^\d{4}-W\d{2}$/, 'Formato: YYYY-WXX'),
  planejado:    z.number().min(0).max(100),
  realizado:    z.number().min(0).max(100),
  tendencia:    z.number().min(0).max(100),
  modPrevista:  z.number().min(0),
  modRealizada: z.number().min(0),
});
export type Base02Row = z.infer<typeof Base02RowSchema>;

// ─── Base 03 — Cronograma de disciplinas ──────────────────────────────────────
export const Base03RowSchema = z.object({
  projetoId:           z.string().min(1),
  disciplina:          z.string().min(1),
  progressoPrevisto:   z.number().min(0).max(100),
  progressoRealizado:  z.number().min(0).max(100),
  inicio:              z.coerce.date(),
  fim:                 z.coerce.date(),
});
export type Base03Row = z.infer<typeof Base03RowSchema>;

// ─── Base 04 — Características técnicas ──────────────────────────────────────
export const Base04RowSchema = z.object({
  projetoId:       z.string().min(1),
  potenciaNominal: z.number().positive(),
  tensaoKv:        z.number().positive(),
  areaHa:          z.number().positive().optional(),
  tecnologia:      z.string().optional(),
  capacidadeMwh:   z.number().optional(),
  numModulos:      z.number().int().positive().optional(),
});
export type Base04Row = z.infer<typeof Base04RowSchema>;

// ─── Parse result with validation errors ──────────────────────────────────────
export interface ParseResult<T> {
  rows: T[];
  errors: Array<{ row: number; message: string }>;
}
