# 04-audit-spec.md - Especificação de Auditoria

## Objetivo
Estabelecer os critérios e o escopo para a auditoria de segurança e performance do projeto SyncDash, garantindo que a aplicação atenda aos padrões de excelência da Matrix Energia.

---

## 1. Auditoria de Segurança (O Quê)

### 1.1. Análise Estática (SAST)
- **Escopo**: Todo o código fonte em `app/`, `src/`, `components/` e `lib/`.
- **Critérios**: Identificar vulnerabilidades como XSS, Injeção, configurações inseguras e más práticas de segurança no React/Next.js.

### 1.2. Segurança de Dependências (SCA)
- **Escopo**: `package.json` e `package-lock.json`.
- **Critérios**: Presença de CVEs conhecidas em pacotes de terceiros. Bloqueio de dependências com vulnerabilidades críticas ou altas.

### 1.3. Gestão de Segredos
- **Escopo**: Repositório completo.
- **Critérios**: Garantir que segredos (chaves API, credenciais Supabase, etc.) não estejam hardcoded ou commitados. Verificação do `.env.example` vs `.env`.

### 1.4. Infraestrutura de Segurança (Headers/Config)
- **Escopo**: `next.config.mjs` e middleware.
- **Critérios**: Implementação de Content Security Policy (CSP), HSTS, X-Content-Type-Options e outras proteções de cabeçalho.

---

## 2. Auditoria de Performance (O Quê)

### 2.1. Métricas Core Web Vitals (Lighthouse)
- **Metas**:
    - **Performance**: > 90
    - **Acessibilidade**: > 90
    - **Best Practices**: > 90
    - **SEO**: > 90
- **Foco**: LCP (Largest Contentful Paint) < 2.5s, CLS (Cumulative Layout Shift) < 0.1.

### 2.2. Análise de Bundle
- **Critérios**: Identificar "heavy hitters" no bundle de produção. Garantir que bibliotecas como `chart.js` e `gsap` estejam sendo importadas de forma otimizada (tree-shaking).

### 2.3. Otimização de Imagens e Assets
- **Escopo**: Diretório `public/` e uso do componente `<Image />` do Next.js.
- **Critérios**: Formatos modernos (WebP/AVIF), sizing correto e lazy loading.
