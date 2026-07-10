# 13 — Coding Rules & Conventions

Ship a clean, fast, maintainable codebase. These rules are binding for the AI coder.

## General
- **Arabic-first / RTL** is the default, not an afterthought. `<html lang="ar" dir="rtl">`. Use logical CSS (start/end) + Tailwind `rtl:` where needed. Latin numerals for prices are fine; consider Arabic-Indic where it reads better (config).
- **Mobile-first.** Design/build for phones (paid social traffic), then enhance for desktop.
- **No dead code / no TODO stubs shipped.** Every page/section in doc 06 must be real and wired.
- Keep components small and composable; one responsibility each.
- Prefer **config/constants** over magic numbers (prices, timers, scarcity, copy toggles).

## Frontend (Next.js / TS / Tailwind)
- **TypeScript strict** (`strict: true`, no `any` unless justified). Type all props, cart, product, order.
- **Server Components by default**; mark client components (`"use client"`) only where needed (cart, drawer, modals, sticky bar, pixel loader, forms).
- Styling: **Tailwind only** (brand tokens from `tailwind.config.ts`, doc 07). No inline hex; use tokens. Use `clsx`/`tailwind-merge` for conditional classes.
- Images: **`next/image`** with explicit width/height (no CLS); `priority` only on LCP/hero; rest lazy. Arabic `alt`.
- Fonts: **`next/font`** (Tajawal + Reem Kufi + Poppins), `display: swap`.
- Forms: controlled inputs + **Zod** validation; instant inline errors in Arabic; disable submit until valid.
- State: React Context for cart (localStorage `lamsa_cart`); no Redux. Derive totals via `bundleTotal` (single source of truth = `lib/pricing.ts`).
- Accessibility: semantic HTML, labeled inputs, focus traps in modals/drawers, ESC to close, `aria-*`, tap targets ≥ 44px, `prefers-reduced-motion` respected.
- Performance: defer pixels (doc 10), code-split, avoid heavy client JS, memoize where it matters. Target **Lighthouse mobile ≥ 90** across the board.
- Lint/format: **ESLint + Prettier**; no warnings on build.
- Never expose secrets: only `NEXT_PUBLIC_*` in the browser; CAPI tokens are backend-only.

## Backend (FastAPI / Python)
- **Python 3.12**, full type hints; **Pydantic v2** models for all I/O.
- **Ruff** (lint) + **Black** (format) + **mypy** (types) clean.
- Async endpoints; **httpx.AsyncClient** for outbound (reused client, timeouts, retries via tenacity).
- **Never trust the client**: re-validate phone, **recompute all prices/totals** server-side (doc 04). Reject bad input with 422 + clear message.
- **Idempotency** on `event_id` for orders. **Rate-limit** `/api/orders`.
- **Background tasks** for Sheet + CAPI — never block the order response.
- Migrations via **Alembic**, run on startup; no `create_all` in prod path (bootstrap only).
- Config via **pydantic-settings**; fail fast on missing required env (but CAPI/Sheet optional → warn, don't crash).

## Security
- Secrets only in env (EasyPanel), never in git. `.env.example` uses placeholders.
- **PII handling:** phone/name are PII. Hash for CAPI (SHA-256). **Do not log** full name+phone; log last-4 or a hash. No PII in error responses.
- CORS allowlist = frontend origins only. HTTPS enforced.
- Validate/limit payload sizes; sanitize strings before storing/forwarding.
- Apps Script webhook protected by `SHEET_SHARED_SECRET`.
- Admin endpoints behind `X-Admin-Token`.

## Git / repo hygiene
- Conventional-ish commits (`feat:`, `fix:`, `chore:`, `docs:`). Small, focused commits.
- Do **not** commit `node_modules`, `.next`, `__pycache__`, `.venv`, `.env`, build artifacts, or real secrets.
- README in `frontend/` and `backend/` with run/deploy steps.

## Testing (lightweight but present)
- Frontend: unit-test `pricing.ts` (bundle tiers, extra units) and `phone.ts` (valid/invalid KSA cases).
- Backend: test `/api/orders` (valid, invalid phone, idempotency, server re-pricing), pricing service, hashing/normalization for each platform's phone format.
- A manual QA checklist (doc 14) must pass before "done".

## Copy & content
- All user-facing copy in **KSA/Gulf dialect** where it's marketing (doc 02); policies can be MSA.
- No medical claims, no shaming, "results may vary" where relevant (doc 01 compliance).
- Prices always show `ر.س`. The **only** discounted price anywhere is the **99 SAR** post-checkout upsell.

## Definition of done (per feature)
Works on mobile + desktop, RTL correct, typed, no console errors, tracked (event fires + deduped), accessible, matches the section spec in doc 06, and passes lint/build.
