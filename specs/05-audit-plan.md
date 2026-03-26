# 05-audit-plan.md - Plano de Voo (Auditoria)

## Objetivo
Definir as ferramentas e o workflow para a execução das auditorias descritas em `04-audit-spec.md`.

---

## 1. Ferramentas e Scripts

### Segurança
- **Scan de Vulnerabilidades**: `.agent/scripts/security_scan.py` (ou equivalente através do Skill `security-audit`).
- **Dependências**: `npm audit` e `.agent/scripts/dependency_analyzer.py`.
- **Específico Next.js**: `npx next lint` (focado em segurança de componentes).

### Performance
- **Lighthouse**: `.agent/scripts/lighthouse_audit.py` ou execução via DevTools local.
- **Bundle**: `next-bundle-analyzer` (instalação temporária se necessário ou check via build logs).
- **Métricas**: `web-vitals` library analysis.

---

## 2. Workflow de Execução

1. **Fase 1: Baseline Inicial**
    - Rodar scans automáticos em estado "as-is".
    - Documentar falhas críticas imediatas.

2. **Fase 2: Análise Profunda**
    - Revisar código manualmente para padrões de segurança (XSS, Auth).
    - Analisar o waterfall de carregamento no Chrome DevTools.

3. **Fase 3: Consolidação**
    - Gerar relatório preliminar.
    - Categorizar problemas em: **Bloqueador (Vermelho)**, **Melhoria (Amarelo)** e **Otimizado (Verde)**.

---

## 3. Plano de Verificação

### Testes Automatizados
- Executar `npm run build` para garantir que o projeto é buildável antes da auditoria de produção.
- Rodar `npm run lint` para checar regras de conformidade.

### Verificação Manual
- Inspeção de cabeçalhos via `curl -I` ou Network Tab.
- Teste de "Throttling" (3G lento) para validar LCP em condições reais.
