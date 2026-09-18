# FoodLoop AI

**AI-powered closed-loop food surplus platform** — predict, prevent, redistribute, measure.

> **Predict → Prevent → Redistribute → Measure**

FoodLoop AI shifts institutional kitchens from *reactive* ("waste → collect → dispose") to a
closed loop: AI demand prediction, CV + IoT quality gates, automatic NGO matching, optimized
routes, and an auditable impact ledger (meals served, CO₂e avoided).

![Node](https://img.shields.io/badge/Node-20%2B-0b3d2e) ![React](https://img.shields.io/badge/React-19-0b3d2e) ![TypeScript](https://img.shields.io/badge/TS-strict-0b3d2e) ![License](https://img.shields.io/badge/status-prototype-8a5a00)

## Quick start

```bash
npm install
npm run dev            # http://localhost:5173
```

Other commands:

```bash
npm run build          # typecheck + production build (dist/)
npm run preview        # serve the production build locally
npm run lint           # eslint
npm run check:links    # broken-link / alt-text / sitemap audit
npm run check:contrast # WCAG 2.1 AA token audit
npm run assets:qr      # regenerate demo batch QR (public/images/batch-qr.png)
npm run assets:brand   # regenerate favicon PNGs + OG image from SVG sources
```

## What's inside

| Surface | Route | Purpose |
| --- | --- | --- |
| Landing + waitlist | `/` | Pitch, closed-loop pipeline, single CTA |
| Live dashboard | `/dashboard` | Forecast chart, KPIs, batch table (synthetic data) |
| QR food trace | `/trace?batch=FL-2026-0042` | Digital-twin custody timeline |
| Rewards | `/rewards` | Points, tiers, perks for waste reducers |
| ESG dashboard | `/esg` | Audit-ready quarterly impact |
| Privacy / Terms | `/privacy`, `/terms` | Legal |
| 404 | any unknown route | Custom recovery page (+ static `public/404.html`) |

## Documentation

| Doc | File |
| --- | --- |
| Product Requirements (PRD) | [docs/01-prd.md](docs/01-prd.md) |
| Technical Requirements (TRD) | [docs/02-trd.md](docs/02-trd.md) |
| App Flow | [docs/03-app-flow.md](docs/03-app-flow.md) |
| UI/UX Brief | [docs/04-uiux-brief.md](docs/04-uiux-brief.md) |
| Backend Schema & API Contracts | [docs/05-backend-schema.md](docs/05-backend-schema.md) |
| Implementation Plan | [docs/06-implementation-plan.md](docs/06-implementation-plan.md) |

## Security & privacy model

- **No secrets in the front end.** `src/lib/env.ts` is the single reader of `import.meta.env`;
  only `VITE_`-prefixed public values exist (see `.env.example`). Real API keys live server-side.
- **HTTPS everywhere.** `public/_headers` ships HSTS (2 y, preload), CSP, nosniff,
  `X-Frame-Options: DENY`, strict referrer, locked-down Permissions-Policy.
- **Consent-gated analytics.** GA4 loads only after an explicit opt-in via the cookie banner;
  IP anonymization on; withdrawable anytime ("Cookie settings" in the footer).
- **Anti-spam waitlist.** Honeypot field + time-trap client-side; rate-limit contract for the
  future server endpoint.
- **DPDP/GDPR-aligned** privacy policy; demo data is synthetic and contains no PII.

## Quality gates

Every PR should pass:

```bash
npm run lint && npm run build && npm run check:links && npm run check:contrast
```

Current status: ✅ lint clean · ✅ strict `tsc` clean · ✅ 30/30 contrast pairs AA ·
✅ routes/sitemap/assets audit clean.

## Pre-launch checklist (all implemented)

Privacy policy · Terms & conditions · secrets off the front end · forced HTTPS · cookie consent
banner · meta titles & descriptions · social preview image · favicon · sitemap & robots.txt ·
alt text · compressed images · fast load (~102 KB JS gzip total) · AA color contrast ·
mobile friendly · custom 404 · broken-link audit · form validation · spam-bot protection ·
consent-gated analytics · one clear CTA ("Join the pilot").

## Tech stack

React 19 · TypeScript (strict) · Vite · React Router 7 · lucide-react · Sharp (asset pipeline) ·
qrcode (demo QR). Planned backend: FastAPI + Postgres/PostGIS + Redis, vLLM-served demand
models, OR-Tools routing — see [docs/02-trd.md](docs/02-trd.md).
