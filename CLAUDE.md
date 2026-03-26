# DashSync - Claude Code Configuration

## Project Overview

DashSync is a high-performance analytics dashboard platform built with TypeScript, React, and ClickHouse.

## Available Skills

This project is configured with the full **antigravity-awesome-skills** toolkit. Use these skills via the `/skill-name` command:

### Planning & Product
| Skill | Command | When to use |
|-------|---------|-------------|
| Product Manager Toolkit | `/product-manager-toolkit` | Define features, RICE scoring, PRDs |
| Brainstorming | `/brainstorming` | Explore solutions, evaluate trade-offs |
| Concise Planning | `/concise-planning` | Create minimal, clean implementation plans |

### Architecture & Code
| Skill | Command | When to use |
|-------|---------|-------------|
| DDD Core Domain | `/design-ddd-core-domain` | Design bounded contexts, aggregates, domain events |
| TypeScript Expert | `/typescript-expert` | Advanced typing, strict mode, patterns |
| React Patterns | `/react-patterns` | Component design, hooks, state management |

### AI & Intelligence
| Skill | Command | When to use |
|-------|---------|-------------|
| Prompt Engineering | `/prompt-engineering` | Design LLM prompts, evaluation frameworks |
| MCP Builder | `/mcp-builder` | Build MCP servers, define LLM tools |

### Data & Visualization
| Skill | Command | When to use |
|-------|---------|-------------|
| ClickHouse IO | `/clickhouse-io` | Schema design, analytical queries, optimization |
| Sankhya Dashboard | `/sankhya-dashboard-html-jsp-custom-best-pratices` | BI dashboards, KPI widgets, JSP/HTML |
| Analytics Marketing | `/analytics-marketing` | Event tracking, funnels, cohort analysis |

### Security & Audit
| Skill | Command | When to use |
|-------|---------|-------------|
| Threat Modeling | `/threat-modeling-expert` | STRIDE analysis, attack surface review |
| Security Review | `/security-review` | OWASP audit, code vulnerability scanning |
| API Security | `/api-security-best-practices` | Auth, rate limiting, input validation |

### DevOps & Documentation
| Skill | Command | When to use |
|-------|---------|-------------|
| GitHub Actions | `/github-actions-templates` | CI/CD workflows, Docker builds, deployments |
| README | `/readme` | Project documentation generation |

## Development Workflow

Follow the **antigravity-awesome-skills** development cycle:

1. **Planning** → `/product-manager-toolkit` + `/brainstorming`
2. **Architecture** → `/design-ddd-core-domain` + `/concise-planning`
3. **Implementation** → `/typescript-expert` + `/react-patterns`
4. **AI Features** → `/prompt-engineering` + `/mcp-builder`
5. **Data Layer** → `/clickhouse-io` + `/analytics-marketing`
6. **Security Gate** → `/threat-modeling-expert` + `/security-review` + `/api-security-best-practices`
7. **Delivery** → `/github-actions-templates` + `/readme`

## Idioma Padrão — Português Brasil (PT-BR)

**Todo o conteúdo visível ao usuário DEVE estar em PT-BR:**
- Labels, títulos, descrições, mensagens de erro, tooltips, placeholders → sempre PT-BR
- Comentários de código → PT-BR
- Nunca usar inglês em textos visíveis ao usuário final

## UI Component Library — shadcn/ui (OBRIGATÓRIO)

O projeto usa **shadcn/ui** como biblioteca de componentes padrão. **Sempre use componentes shadcn antes de criar markup customizado.**

### Regras de uso
- **Verificar instalados** antes de usar: `npx shadcn@latest info`
- **Adicionar** via CLI: `npx shadcn@latest add <component>`
- **Pesquisar** disponíveis: `npx shadcn@latest search`
- **Consultar docs** antes de implementar: `npx shadcn@latest docs <component>`
- **Cores semânticas sempre**: `bg-primary`, `text-muted-foreground` — nunca valores raw como `bg-blue-500`
- **`cn()` para classes condicionais** — nunca template literals manuais
- **`gap-*` para espaçamento** — nunca `space-x-*` ou `space-y-*`
- **`size-*` quando width = height** — nunca `w-10 h-10` separados

### Mapeamento obrigatório
| Necessidade | Componente shadcn |
|---|---|
| Botão/ação | `Button` com variant apropriado |
| Formulários | `Input`, `Select`, `Switch`, `Checkbox`, `Textarea` |
| Dados tabulares | `Table`, `Card`, `Badge` |
| Navegação | `Sidebar`, `Tabs`, `Breadcrumb`, `Pagination` |
| Overlays | `Dialog`, `Sheet`, `Drawer`, `AlertDialog` |
| Feedback | `sonner` (toast), `Alert`, `Progress`, `Skeleton` |
| Gráficos | `Chart` (wrapper Recharts) |
| Estados vazios | `Empty` |
| Menus | `DropdownMenu`, `ContextMenu` |

### Cores Matrix com shadcn (CSS variables em `app/globals.css`)
- `--primary`: `#FF4A00` (Laranja Matrix) / `--primary-foreground`: `#FFFFFF`
- Background: `#151B1C` (Grafite) ou `#F1F3F0` (Off-white)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript 5 (strict)
- **UI Components**: shadcn/ui (base-nova preset, Tailwind v3, `components.json` na raiz)
- **Backend**: Node.js 20, TypeScript, Fastify
- **Database**: ClickHouse (OLAP) + PostgreSQL (OLTP)
- **Cache**: Redis
- **AI**: Claude API (claude-sonnet-4-6), MCP
- **CI/CD**: GitHub Actions
- **Infra**: Docker, GitHub Container Registry

## Coding Standards

- TypeScript strict mode — no `any`, no `!` without justification
- DDD architecture: `domain/` → `application/` → `infrastructure/`
- All API endpoints: authenticated, rate-limited, validated with Zod
- Tests required: happy path + at least 1 edge case per function
- No function > 20 lines, no file > 200 lines
- PII never logged, secrets in environment variables only

## Security Rules

- All endpoints require explicit authorization check
- Object-level access verified (IDOR prevention)
- Rate limiting on all auth endpoints (5 req/15min max)
- SQL: parameterized queries only (never string interpolation)
- Secrets managed via environment variables or Vault
