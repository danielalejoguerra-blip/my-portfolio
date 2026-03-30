# ─── Stage 1: deps ──────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ─── Stage 2: builder ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno requeridas en tiempo de build (NEXT_PUBLIC_*)
# Se inyectan desde docker-compose o --build-arg
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_ANALYTICS_SOCKET_URL
ARG NEXT_PUBLIC_ANALYTICS_SOCKET_PATH
ARG NEXT_PUBLIC_ANALYTICS_NAMESPACE
ARG NEXT_PUBLIC_ANALYTICS_ROOM
ARG NEXT_PUBLIC_ANALYTICS_REALTIME_DAYS

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_ANALYTICS_SOCKET_URL=$NEXT_PUBLIC_ANALYTICS_SOCKET_URL
ENV NEXT_PUBLIC_ANALYTICS_SOCKET_PATH=$NEXT_PUBLIC_ANALYTICS_SOCKET_PATH
ENV NEXT_PUBLIC_ANALYTICS_NAMESPACE=$NEXT_PUBLIC_ANALYTICS_NAMESPACE
ENV NEXT_PUBLIC_ANALYTICS_ROOM=$NEXT_PUBLIC_ANALYTICS_ROOM
ENV NEXT_PUBLIC_ANALYTICS_REALTIME_DAYS=$NEXT_PUBLIC_ANALYTICS_REALTIME_DAYS

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Stage 3: runner ────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public         ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
