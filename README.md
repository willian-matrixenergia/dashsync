# DashSync — Video Wall & Tablet Control System

Real-time dashboard platform for infrastructure project portfolio management. A Fastify API syncs a **video wall** (4 screens) with a **Surface tablet** remote control via WebSocket, consuming weekly Excel data (Base01–04) and live camera streams.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Meeting Room                              │
│                                                             │
│  ┌─────────────────────────────────┐    ┌───────────────┐  │
│  │         Video Wall (4:1)        │    │ Surface Tablet│  │
│  │  [01 Portfolio] [02 Progress]   │◄───│  Remote Ctrl  │  │
│  │  [03 Photos]    [04 Live Cam]   │    │               │  │
│  └─────────────────────────────────┘    └───────────────┘  │
│              ▲ WebSocket STATE_SYNC ▲                       │
└──────────────┼──────────────────────┼──────────────────────┘
               │                      │
        ┌──────┴──────────────────────┴──────┐
        │         DashSync API (Fastify)      │
        │   REST · WebSocket · AI · Proxy     │
        └─────┬────────────────────┬──────────┘
              │                    │
       ┌──────▼──────┐    ┌────────▼────────┐
       │ Excel Files  │    │   ClickHouse    │
       │ Base01–04   │    │  (analytics)    │
       └─────────────┘    └─────────────────┘
```

### Monorepo Structure

```
dashsync/
├── packages/
│   ├── shared/          # DTOs, Zod schemas, WebSocket message types
│   ├── api/             # Fastify backend
│   │   └── src/
│   │       ├── domain/           # Projeto, SessaoControle aggregates
│   │       ├── application/      # Use cases
│   │       └── infrastructure/   # HTTP routes, WS hub, Excel watcher, AI, ClickHouse
│   ├── wall/            # React SPA — video wall (4 screens)
│   └── tablet/          # React SPA — tablet remote control
├── migrations/          # ClickHouse SQL migrations
├── docs/                # Tracking plan, architecture docs
├── Dockerfile
└── docker-compose.yml
```

## Screens

| Screen | Content |
|--------|---------|
| **01 Portfolio** | KPI cards, project table with criticality highlighting, Gantt chart |
| **02 Progress** | S-curve (plan/actual/trend), labor histogram, speedometers, delta scroller |
| **03 Photos/Videos** | Media gallery with lightbox, 360° tour (VR) |
| **04 Live Monitoring** | Live camera proxy stream, timelapse video |

## Quick Start

### Prerequisites

- Node.js 20+, pnpm 9+
- Docker & Docker Compose

### Local Development

```bash
# Clone and install
git clone https://github.com/willian-matrixenergia/dashsync
cd dashsync
pnpm install

# Copy env
cp .env.example .env
# Edit .env — set WS_SECRET, DASHSYNC_API_KEY, ANTHROPIC_API_KEY

# Start ClickHouse + API in Docker
docker compose up -d clickhouse
pnpm --filter @dashsync/api dev

# In separate terminals:
pnpm --filter @dashsync/wall   dev   # http://localhost:5173
pnpm --filter @dashsync/tablet dev   # http://localhost:5174
```

### Docker (production)

```bash
docker compose up -d
```

API available at `http://localhost:3001`.

### Data Setup

Drop Excel files into `./data/`:

```
data/
├── Base01.xlsx   # Portfolio (project list, KPIs)
├── Base02.xlsx   # S-curve & labor weekly series
├── Base03.xlsx   # Discipline Gantt (Engenharia, Suprimentos, Construção, Comissionamento)
└── Base04.xlsx   # Media metadata (photos, videos, 360°)
```

The API watches these files with a 2-second debounce — changes trigger an automatic reload and broadcast to all connected clients.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WS_SECRET` | Yes (prod) | 32+ byte secret for WS session token signing. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DASHSYNC_API_KEY` | Yes (prod) | Static key for REST admin endpoints. Generate: `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"` |
| `ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins, e.g. `http://192.168.1.100` |
| `ANTHROPIC_API_KEY` | AI features | Claude API key for risk assessment and summaries |
| `CLICKHOUSE_URL` | Analytics | Default: `http://localhost:8123` |
| `CLICKHOUSE_USER` | Analytics | Default: `default` |
| `CLICKHOUSE_PASSWORD` | Analytics | ClickHouse password |
| `CLICKHOUSE_DB` | Analytics | Default: `dashsync` |
| `DATA_DIR` | No | Path to Excel files. Default: `../../data` |
| `MEDIA_DIR` | No | Path to media files. Default: `../../media` |
| `CAMERA_URL_{ID}` | Live screen | Per-project camera URL, e.g. `CAMERA_URL_PROJ001` |

See `.env.example` for the complete reference.

## API Reference

### Authentication

All `/api/` endpoints (except public health) require:
```
X-Api-Key: <DASHSYNC_API_KEY>
```

WebSocket `/ws/control` requires a signed token:
```
ws://host:3001/ws/control?token=<signed-token>&role=wall|tablet
```

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List projects (filterable by `programa`, `criticidade`, `busca`) |
| `GET` | `/api/projects/:id` | Project detail with disciplines and timeline |
| `GET` | `/api/projects/:id/scurve` | S-curve series (planejado/realizado/tendência) |
| `GET` | `/api/projects/:id/labor` | Labor histogram series |
| `GET` | `/api/projects/:id/media` | Media gallery items |
| `POST` | `/api/admin/reload` | Force Excel reload |
| `GET` | `/api/health` | Health check (includes ClickHouse ping) |
| `POST` | `/api/ai/risk` | AI risk assessment for a project |
| `POST` | `/api/ai/summary` | AI executive summary |
| `POST` | `/api/ai/filter` | Natural-language → filter translation |
| `GET` | `/api/stream/:id/live` | Live camera proxy (URL never exposed to frontend) |

### WebSocket Messages

**Tablet → Server (control):**
```json
{ "type": "SELECT_PROJECT", "projetoId": "PROJ001" }
{ "type": "APPLY_FILTER", "filtro": { "programa": "BESS" } }
{ "type": "NAVIGATE_SCREEN", "ecra": 2 }
```

**Server → All clients (sync):**
```json
{ "type": "STATE_SYNC", "state": { "projetoSelecionado": "PROJ001", "ecrãAtivo": 2, "filtro": {} } }
{ "type": "DATA_UPDATED", "timestamp": "2026-03-17T10:00:00Z" }
```

## Security

- **WS tokens**: HMAC-SHA256 signed, 4-hour TTL
- **API key**: Timing-safe comparison (`timingSafeEqual`)
- **Rate limiting**: Sliding window per IP — 5/15min on auth, 200/min general, 20/min AI
- **CORS**: Explicit allow-list, no wildcard
- **Security headers**: CSP, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy
- **Input validation**: Zod on all query params and request bodies
- **Injection prevention**: Parameterized ClickHouse queries, table name whitelist, `Object.create(null)` in Excel parser
- **Camera URLs**: Server-side only — never returned to frontend
- **Prototype pollution**: Excel row parsing guards `__proto__`, `constructor`, `prototype` keys

## AI Features (Claude Integration)

Powered by `claude-sonnet-4-6`:

- **Risk Assessment** — Classifies project risk (low/medium/high/critical) with recommended actions
- **Executive Summary** — Generates Portuguese-language weekly briefing from portfolio data
- **NL Filter** — Translates natural language queries to structured filter objects
- **Excel Anomaly Detection** — Identifies data quality issues in Excel uploads

Requires `ANTHROPIC_API_KEY` in environment.

## MCP Server

DashSync exposes an MCP server (`packages/mcp`) for direct LLM integration:

```bash
pnpm --filter @dashsync/mcp build
```

Register in `.mcp.json` (already included). Tools exposed:

- `list_projects` — Portfolio list with optional filtering
- `get_project_detail` — Full project data
- `get_scurve` — S-curve time series
- `assess_risk` — AI risk assessment
- `generate_summary` — AI executive summary
- `translate_nl_filter` — NL → filter
- `reload_data` — Trigger Excel reload
- `get_stats` — Portfolio aggregate statistics

## Analytics (ClickHouse)

Run migrations:
```bash
curl -s http://localhost:8123/ --data-binary @migrations/001_initial_schema.sql
curl -s http://localhost:8123/ --data-binary @migrations/002_analytics_queries.sql
```

Tables: `progresso_semanal`, `portfolio_snapshot`, `dashboard_events`

Materialized views: `criticidade_weekly_mv`, `usage_daily_mv`, `top_projetos_mv`

## CI/CD

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | PR / push to main, develop | typecheck · lint · test (with ClickHouse) · security audit |
| `docker.yml` | Push to main / version tags | Multi-stage Docker build → GHCR |

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `GITHUB_TOKEN` | Auto-provided — GHCR push |

## Development Scripts

```bash
pnpm typecheck        # Type-check all packages
pnpm lint             # ESLint all packages
pnpm build            # Build all packages
pnpm test:unit        # Unit tests
pnpm test:integration # Integration tests (requires ClickHouse)
```

## License

Proprietary — Matrix Energia © 2026
