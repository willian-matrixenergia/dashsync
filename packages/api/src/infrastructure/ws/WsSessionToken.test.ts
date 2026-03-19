import { describe, it, expect } from 'vitest';
import { generateWsToken, validateWsToken } from './WsSessionToken.js';

describe('WsSessionToken', () => {
  it('gera e valida token com sucesso', () => {
    const sessaoId = 'sessao-abc-123';
    const token    = generateWsToken(sessaoId);
    expect(validateWsToken(token)).toBe(sessaoId);
  });

  it('retorna null para token adulterado', () => {
    const token    = generateWsToken('sessao-xyz');
    const tampered = token.slice(0, -4) + 'XXXX';
    expect(validateWsToken(tampered)).toBeNull();
  });

  it('retorna null para string vazia', () => {
    expect(validateWsToken('')).toBeNull();
  });

  it('retorna null para token sem separador', () => {
    const noSep = Buffer.from('sempontonessetokenaqui').toString('base64url');
    expect(validateWsToken(noSep)).toBeNull();
  });

  it('tokens de sessões diferentes são únicos', () => {
    const t1 = generateWsToken('sessao-1');
    const t2 = generateWsToken('sessao-2');
    expect(t1).not.toBe(t2);
  });
});
