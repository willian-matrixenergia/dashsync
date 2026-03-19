# ── Stage 1: install all deps ─────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json    ./packages/api/

RUN pnpm install --frozen-lockfile --filter @dashsync/api... --filter @dashsync/shared

# ── Stage 2: build shared + api ───────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app

COPY packages/shared/ ./packages/shared/
COPY packages/api/    ./packages/api/

RUN pnpm --filter @dashsync/shared build && \
    pnpm --filter @dashsync/api    build

# ── Stage 3: production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ARG BUILD_DATE
ARG VERSION
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.source="https://github.com/willian-matrixenergia/dashsync" \
      org.opencontainers.image.title="DashSync API"

RUN corepack enable && corepack prepare pnpm@9 --activate

# Production-only deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json    ./packages/api/

RUN pnpm install --frozen-lockfile --prod --filter @dashsync/api... --filter @dashsync/shared

# Copy compiled output
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/api/dist    ./packages/api/dist

# Non-root user
RUN addgroup -g 1001 -S dashsync && adduser -S dashsync -u 1001 -G dashsync
USER dashsync

ENV NODE_ENV=production \
    PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3001/health || exit 1

CMD ["node", "packages/api/dist/server.js"]
