import { describe, it, expect } from 'vitest';
import { ProgressoFisico } from './ProgressoFisico.js';

describe('ProgressoFisico', () => {
  it('calcula delta corretamente', () => {
    const p = new ProgressoFisico(50, 55);
    expect(p.delta).toBe(5);
  });

  it('status adiantado quando delta > 2', () => {
    expect(new ProgressoFisico(50, 53).status).toBe('adiantado');
  });

  it('status no_prazo quando delta entre -2 e 2', () => {
    expect(new ProgressoFisico(50, 51).status).toBe('no_prazo');
    expect(new ProgressoFisico(50, 48).status).toBe('no_prazo');
  });

  it('status atrasado quando delta < -2', () => {
    expect(new ProgressoFisico(50, 45).status).toBe('atrasado');
  });

  it('lança erro se previsto fora de 0-100', () => {
    expect(() => new ProgressoFisico(-1, 0)).toThrow('Previsto inválido');
    expect(() => new ProgressoFisico(101, 0)).toThrow('Previsto inválido');
  });

  it('lança erro se realizado fora de 0-100', () => {
    expect(() => new ProgressoFisico(0, -1)).toThrow('Realizado inválido');
    expect(() => new ProgressoFisico(0, 101)).toThrow('Realizado inválido');
  });

  it('toDTO retorna todos os campos', () => {
    const dto = new ProgressoFisico(60, 62).toDTO();
    expect(dto).toMatchObject({ previsto: 60, realizado: 62, delta: 2, status: 'no_prazo' });
  });
});
