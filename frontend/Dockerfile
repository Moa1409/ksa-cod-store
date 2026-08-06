# syntax=docker/dockerfile:1
# Multi-stage Next.js standalone — tuned for EasyPanel / small VPS.
# Keep EasyPanel BuildKit cache ON. Bump CACHEBUST only when you need a fresh build layer.

FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048" \
    NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_FETCH_RETRIES=3 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=10000

COPY package.json package-lock.json ./
# BuildKit cache mount keeps npm downloads between deploys (huge win on EasyPanel).
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048" \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Declared LATE on purpose: changing CACHEBUST / pixel IDs must NOT invalidate npm ci.
ARG CACHEBUST=tiktok-head-2026-08-06
RUN echo "cachebust=$CACHEBUST" \
  && test -f public/DEPLOY_STAMP.txt \
  && test -d src/app/admin \
  && test -d src/app/cod

ARG NEXT_PUBLIC_SITE_URL=https://lamsaglow.shop
ARG NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop
ARG NEXT_PUBLIC_ENABLE_PIXELS=true
ARG NEXT_PUBLIC_META_PIXEL_ID=
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID=D9QCPGRC77U97D5QCMK0
ARG NEXT_PUBLIC_SNAP_PIXEL_ID=df328e90-b942-4e26-8b36-1e90da17865b
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_ENABLE_PIXELS=$NEXT_PUBLIC_ENABLE_PIXELS \
    NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID \
    NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID

RUN npm run build \
  && rm -rf node_modules

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    API_URL=https://api.lamsaglow.shop

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
