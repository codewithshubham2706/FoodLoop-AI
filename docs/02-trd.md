# FoodLoop AI — Technical Requirements Document (TRD)

**Related:** [01-prd.md](01-prd.md) · [03-app-flow.md](03-app-flow.md) · [05-backend-schema.md](05-backend-schema.md)

## 1. System context

```
┌────────────┐   ┌──────────────┐   ┌───────────────┐   ┌──────────────┐
│ POS / ERP  │   │ ESP32 + MQTT │   │ Camera (RTSP) │   │ Ops / NGO UI │
└─────┬──────┘   └──────┬───────┘   └──────┬────────┘   └──────┬───────┘
      │ REST batch      │ TLS/MQTT         │ frame samples     │ HTTPS
      ▼                 ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (FastAPI, HTTPS)                     │
│  authn/z · rate limiting · request signing · schema validation          │
└───────┬───────────────────┬────────────────────┬───────────────────────┘
        ▼                   ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌────────────────┐
│ Core services │   │  AI services  │   │ Static web app │
│ (this repo's  │   │ (Python)      │   │ (React/Vite —  │
│  contracts)   │   │ demand · CV · │   │  this code)    │
└───────┬───────┘   │ matching ·    │   └────────────────┘
        │           │ routing       │
        ▼           └───────┬───────┘
┌───────────────┐           ▼
│ PostgreSQL    │   ┌───────────────┐
│ + PostGIS     │   │ Redis (cache, │
│ (ledger DB)   │   │  queues)      │
└───────────────┘   └───────────────┘
```

## 2. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Web app | React 19 + TypeScript + Vite | Fast build, small bundle, team familiarity |
| Routing/data | React Router 7 · REST (FastAPI) | SPA simplicity for MVP; SSR can come later |
| Backend | Python 3.12 · FastAPI | Typed, async, first-class OpenAPI |
| DB | PostgreSQL 16 + PostGIS | Relational ledger + geo queries for matching |
| Cache/queue | Redis | Forecast cache, Celery tasks, rate limits |
| ML serving | vLLM (LLM explanations) · XGBoost/LightGBM · TFT | Tabular + sequence forecasting |
| Vision | YOLO/ResNet via OpenCV | Freshness scoring |
| Routing | Google OR-Tools | VRPTW solver |
| IoT | ESP32 → MQTT (TLS) → bridge | Cold-chain telemetry |
| Hosting | Static CDN for web · containers for API | Cheap, fast, secure defaults |

## 3. Front-end architecture (this codebase)

```
src/
  lib/        env.ts (public config) · seo.ts · consent.tsx · analytics.ts
  components/ Header · Footer · CookieBanner · PipelineLoop · WaitlistForm · Layout
  pages/      Home · Dashboard · Trace · Rewards · Esg · Privacy · Terms · NotFound
  data/       demo.ts (synthetic payloads matching backend schemas)
scripts/      generate-brand-assets.mjs · generate-qr.mjs · check-links.mjs · contrast-check.mjs
public/       robots.txt · sitemap.xml · _headers · 404.html · og-image.png · brand/
docs/         PRD · TRD · app flow · UI/UX brief · backend schema · implementation plan
```

Key decisions:
- **`src/lib/env.ts` is the only module reading `import.meta.env`.** Only `VITE_`-prefixed,
  public values are allowed; secrets live server-side. `.env.example` documents the contract.
- **Consent gate:** `ConsentProvider` → `CookieBanner` → `Layout` effect → `setAnalyticsConsent`.
  No third-party script loads pre-consent (see `src/lib/analytics.ts`).
- **SEO:** `useSeo` hook syncs title/description/canonical/OG/Twitter per route; static
  `robots.txt`, `sitemap.xml`, `404.html`, `_headers` live in `public/`.
- **Security headers** are declarative in `public/_headers` (host-agnostic; see §7).

## 4. AI/ML pipeline (backend contracts summarized)

1. **Demand engine** — features: menu, POS history, attendance, weekday, weather, events;
   models: LightGBM (tabular) + TFT (sequence); output: item-day `yhat` with P10/P90.
2. **Surplus detection** — rule engine over prepared-vs-consumed deltas; creates `surplus_batches`.
3. **Quality gate** — CV freshness score (0–1) + IoT rule evaluation (time-above-threshold etc.)
   → `grade ∈ {A, B, REJECT}`. Vision never clears a batch alone.
4. **Matching engine** — PostGIS radius query + eligibility filter + scoring
   (capacity fit, dietary fit, distance, window feasibility) → ranked NGOs.
5. **Route optimization** — OR-Tools VRPTW with cold-box capacity + ETAs.
6. **Impact engine** — FAO/UNEP FLW emission factors → append-only `impact_ledger` rows.

## 5. Data flows & SLAs

| Flow | Trigger | SLA |
| --- | --- | --- |
| Forecast refresh | Nightly + on menu change | ≤ 5 min full-site recompute |
| Surplus alert | Service-end scan | Detection → NGO notify ≤ 15 min p95 |
| Matching | Batch publish | Rank + assign ≤ 30 s |
| Routing | Match confirm | Solve ≤ 2 min @ 50 stops |
| QR trace read | Public scan | p95 < 300 ms (cached) |
| Impact write | POD confirm | ≤ 1 min ledger visibility |

## 6. Security & privacy engineering

- Transport: HTTPS enforced, HSTS preload, `upgrade-insecure-requests` (see `public/_headers`).
- Headers: CSP (self + GA4 + fonts), `X-Frame-Options: DENY`, nosniff, strict referrer,
  Permissions-Policy locking camera/mic/geo.
- Secrets: **never** in front-end; backend env/secret manager; `VITE_` namespace is public.
- Consent: granular analytics opt-in, stored locally, withdrawable anytime (footer link).
- Anti-spam: honeypot field + time-trap + server-side rate limiting (per IP + per form).
- Data minimization: waitlist stores 4 fields only; QR codes carry batch IDs, never PII.
- Auditability: append-only impact ledger; custody events are tamper-evident (hash-chained).

## 7. Hosting notes (static `_headers`)

`public/_headers` is Netlify/Cloudflare-Pages syntax. On other hosts, replicate via platform
config (nginx `add_header`, Vercel `vercel.json`, Apache `.htaccess`). Rules included:
force-HTTPS semantics via HSTS + upgrade-insecure-requests, long-cache immutable `/assets/*`,
never-cache `/index.html`.

## 8. Testing strategy

- **Static:** `tsc -b` (strict), ESLint.
- **Unit (planned):** validation logic in `WaitlistForm`, consent reducer, seo tag upserts.
- **Contract:** `src/data/demo.ts` mirrors `docs/05-backend-schema.md` payloads.
- **A11y/UX audits (shipped as scripts):** `npm run check:links`, `npm run check:contrast`.
- **E2E (planned):** Playwright — waitlist happy path, QR trace lookup, 404 catch-all.
