# Dockerfile

# 1. Estágio de Dependências
FROM node:18-alpine AS deps
WORKDIR /app

# Instala apenas as dependências, aproveitando o cache do Docker
COPY package.json package-lock.json* ./
RUN npm install

# 2. Estágio de Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de ambiente para o build (se houver)
# ENV NEXT_PUBLIC_API_URL=https://api.example.com

RUN npm run build

# 3. Estágio de Produção
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Desabilita o telemetry do Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Copia a pasta standalone otimizada
COPY --from=builder /app/.next/standalone ./

# Copia a pasta public e .next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expõe a porta e define o comando para iniciar o servidor
EXPOSE 3000
CMD ["node", "server.js"]
