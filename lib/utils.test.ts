import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('deve mesclar classes corretamente', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('deve lidar com valores condicionais', () => {
    const isActive = true;
    const result = cn('p-4', isActive && 'bg-blue-500');
    expect(result).toBe('p-4 bg-blue-500');
  });

  it('deve retornar string vazia quando nenhuma classe for passada', () => {
    const result = cn();
    expect(result).toBe('');
  });
});