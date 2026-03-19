# ── Stage 1: install deps ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY app/package.json app/package-lock.json ./app/
RUN cd app && npm ci

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app

COPY app/ ./app/
RUN cd app && npm run build:api

# ── Stage 3: production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ARG BUILD_DATE
ARG VERSION
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.source="https://github.com/willian-matrixenergia/dashsync" \
      org.opencontainers.image.title="DashSync API"

COPY app/package.json app/package-lock.json ./app/
RUN cd app && npm ci --production

COPY --from=builder /app/app/dist ./app/dist

RUN addgroup -g 1001 -S dashsync && adduser -S dashsync -u 1001 -G dashsync
USER dashsync

ENV NODE_ENV=production \
    PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3001/health || exit 1

CMD ["node", "app/dist/index.js"]
