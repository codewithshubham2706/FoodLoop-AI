# FoodLoop AI — Implementation Plan

**Related:** [01-prd.md](01-prd.md) · [02-trd.md](02-trd.md) · [05-backend-schema.md](05-backend-schema.md)

## Phase 0 — Prototype (this repo)

| Workstream | Deliverable | Status |
| --- | --- | --- |
| Static web app | Landing + 4 demo surfaces + legal + 404 | ✅ Built |
| Design system | Tokens, components, a11y contract | ✅ Built |
| SEO surface | Meta/OG per route, sitemap, robots, canonical | ✅ Built |
| Security baseline | Headers, consent gate, no-frontend-secrets, anti-spam | ✅ Built |
| Docs | PRD · TRD · flow · UI/UX · schema · this plan | ✅ Built |
| QA scripts | `check:links` · `check:contrast` | ✅ Built |

## Phase 1 — MVP backend (weeks 1–4)

1. FastAPI skeleton: auth (OIDC), rate limiting, OpenAPI, CI (lint+test+typecheck).
2. Postgres+PostGIS schema (see 05) + Alembic migrations + seed synthetic pilot data.
3. Demand engine v1: LightGBM per item-site; nightly training; factor JSON (explainability).
4. Batch lifecycle APIs: create → inspect → match → route → POD.
5. Matching v1: PostGIS radius + eligibility + weighted score; reject→fallback chain.
6. Waitlist API: honeypot/time-trap/rate-limit server-side; admin export.

**Exit criteria:** demo batch completes full loop via API in < 15 min end-to-end; every
prediction returns factor breakdown.

## Phase 2 — Intelligence & hardware (weeks 5–8)

1. TFT demand model (sequence) + backtest vs LightGBM; pick per-segment champion.
2. CV service: YOLO/ResNet freshness scoring on sample trays; threshold calibration.
3. ESP32 firmware: temp/fill telemetry → MQTT (TLS) → rules engine (time-above-threshold).
4. OR-Tools VRPTW routing service; cold-box capacity; re-solve on POD failure.
5. Impact engine: FAO/UNEP FLW emission factors; hash-chained ledger writes.

**Exit criteria:** CV+IoT grade agrees with food-safety officer on ≥ 95% of pilot trays;
route solve ≤ 2 min at 50 stops.

## Phase 3 — Pilot (weeks 9–12)

1. One campus kitchen + 2–3 NGOs onboarded.
2. Ops dashboards (forecast adjustments with human approval), NGO alert console.
3. Rewards ledger live; ESG quarterly export (BRSR-aligned).
4. Feedback loops: model drift monitor, alert precision review, route adherence.

**Exit criteria:** ≥ 30% cooked-surplus reduction vs 4-week baseline; ≥ 85% batches matched
< 20 min; zero cold-chain incidents on Grade-A deliveries.

## Phase 4 — Scale & government integration (post-launch)

- City federation: multi-tenant sites, municipal food-bank console.
- FSSAI surplus-donation network alignment; Suraksha-style API integration.
- Carbon accounting partnerships for verified CO₂e claims.
- Regional language support for NGO/volunteer apps.

## Pre-launch audit → implementation map

| Audit item | Where it lives |
| --- | --- |
| Privacy policy page | `src/pages/Privacy.tsx` · route `/privacy` |
| Terms & conditions | `src/pages/Terms.tsx` · route `/terms` |
| Secrets off the front end | `src/lib/env.ts` single reader · `.env.example` · `.gitignore` |
| Forced HTTPS | `public/_headers` (HSTS preload + upgrade-insecure-requests) |
| Cookie consent banner | `src/components/CookieBanner.tsx` + `src/lib/consent.tsx` (GA4 loads only post-consent) |
| Meta titles & descriptions | `index.html` defaults + `src/lib/seo.ts` per route |
| Social preview image | `public/og-image.png` (1200×630, 38 KB) + OG/Twitter tags |
| Favicon | `public/brand/favicon.svg` + PNG fallbacks + `manifest.webmanifest` |
| Sitemap & robots | `public/sitemap.xml` · `public/robots.txt` |
| Alt text on images | All `<img>` audited (see `scripts/check-links.mjs` alt check) |
| Image compression | Sharp palette PNGs (favicon 3 KB, OG 38 KB, QR 4 KB) |
| Page load speed | No render-blocking JS; `display=swap` fonts; inline SVG charts; single small bundle |
| Color contrast | `scripts/contrast-check.mjs` (AA audit of all token pairs) |
| Mobile friendly | Mobile-first CSS; breakpoints 560/720/860/900/980 |
| Custom 404 | `src/pages/NotFound.tsx` (SPA) + `public/404.html` (static host) |
| Broken links | `npm run check:links` (routes + hrefs + images) |
| Form validation | `src/components/WaitlistForm.tsx` (ARIA errors, focus management) |
| Spam-bot protection | Honeypot + time-trap client; rate-limit contract for server |
| Analytics | `src/lib/analytics.ts` GA4 — consent-gated, anonymized IP, no-op without ID |
| One clear CTA | "Join the pilot" — hero, header, page headers, 404 |

## Commands

```bash
npm install
npm run dev            # local dev
npm run build          # tsc -b && vite build
npm run preview        # serve dist (tests static 404 + headers manually)
npm run assets:qr      # regenerate demo batch QR
npm run assets:brand   # regenerate favicon PNGs + OG image
npm run check:links    # internal route/link audit
npm run check:contrast # WCAG AA token audit
npm run lint
```

## Deployment

1. Static host (Netlify/Cloudflare Pages): build → deploy `dist/`. `_headers` ships automatically.
2. Set `VITE_SITE_URL`, `VITE_GA4_MEASUREMENT_ID` at build time (public values only).
3. Add real backend origin to CSP `connect-src` when API goes live (edit `public/_headers`).
4. Submit `https://foodloop.ai/sitemap.xml` in Search Console; validate OG with metatags.io.
