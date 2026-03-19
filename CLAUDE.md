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

## Tech Stack

- **Frontend**: React 18, TypeScript 5 (strict), Vite
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
