# ---- build (single stage: lower peak memory on small VPS) ----
FROM node:20-alpine AS build
WORKDIR /app

# Helps Next/webpack on low-RAM builders (EasyPanel)
ENV NODE_OPTIONS="--max-old-space-size=2048" \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm config set maxsockets 1 \
    && npm config set fetch-retries 3 \
    && if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

COPY . .

# Bust EasyPanel/BuildKit stale layers when admin/config changes
ARG CACHEBUST=contactus-email-2026-08-03
RUN echo "cachebust=$CACHEBUST" \
  && test -f public/DEPLOY_STAMP.txt \
  && ! grep -q "0e6b63" public/admin.html \
  && ! grep -q 'lang="ar"' public/admin.html \
  && test -d src/app/admin \
  && test -d src/app/cod

# NEXT_PUBLIC_* must be present at build time — set in EasyPanel env before deploy.
# Pixel IDs are public (ship in client JS). Override in EasyPanel if needed.
ARG NEXT_PUBLIC_SITE_URL=https://lamsaglow.shop
ARG NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop
ARG NEXT_PUBLIC_ENABLE_PIXELS=true
ARG NEXT_PUBLIC_META_PIXEL_ID=
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID=D9NPS13C77U1NSLT1RRG
ARG NEXT_PUBLIC_SNAP_PIXEL_ID=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_ENABLE_PIXELS=$NEXT_PUBLIC_ENABLE_PIXELS \
    NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID \
    NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID

RUN npm run build

# ---- run ----
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
