# FoodLoop AI — Product Requirements Document (PRD)

**Project:** FoodLoop AI
**Status:** Draft v1.0 · Sep 2026
**Related:** [02-trd.md](02-trd.md) · [03-app-flow.md](03-app-flow.md) · [04-uiux-brief.md](04-uiux-brief.md) · [05-backend-schema.md](05-backend-schema.md) · [06-implementation-plan.md](06-implementation-plan.md)

---

## 1. Problem statement

Institutional kitchens (campus messes, food-processing units, cold-storage operators) routinely
overproduce. The surplus follows a **reactive** path — *waste → collect → dispose* — ending in
landfill, emitting methane/CO₂e, and wasting embedded water, energy and money, while nearby NGOs
go under-supplied.

## 2. Product vision

Shift institutions to a **proactive** closed loop:

> **Predict → Prevent → Redistribute → Measure**

Five connected AI engines (Demand, Surplus, Quality-CV, Matching, Route) plus a **Food Digital
Twin** trace every batch from procurement to consumption. Every prediction ships with an
explainable, factor-wise breakdown — no black boxes.

## 3. Goals & non-goals (MVP)

| Goal | Non-goal (this phase) |
| --- | --- |
| 7-day demand forecast per item per site | Procurement auto-ordering |
| Surplus batch detection & quality grading (CV + IoT rules) | Microbiological safety certification |
| Automatic NGO matching with eligibility ranking | Volunteer marketplace |
| VRPTW route optimization for pickups | Fleet ownership/telematics hardware |
| QR batch traceability (digital twin) | Blockchain settlement |
| Impact ledger: meals, CO₂e, money saved | Carbon-credit trading |
| Rewards for waste-reducing businesses | Cash payouts |
| ESG dashboard aligned to FAO/UNEP FLW + BRSR | Third-party ESG certification |

## 4. Personas

1. **Mess manager (P1)** — runs campus mess; wants accurate cook counts, fewer leftovers, no extra work.
2. **NGO coordinator (P2)** — wants early, reliable alerts with clear safety info and realistic ETAs.
3. **Institution admin / ESG officer (P3)** — wants audit-ready reports and recognition.
4. **Ops/volunteer driver (P4)** — wants a simple run sheet and POD flow.

## 5. User stories (selected, with acceptance criteria)

| ID | Story | Acceptance criteria |
| --- | --- | --- |
| S1 | As P1 I see tomorrow's forecast per item so I can right-size cooking | Forecast shows per-item daily quantities; each value exposes factor-wise contribution (menu, attendance, weekday, weather) |
| S2 | As P1 I get a surplus alert within 15 min of service end | Detection → alert ≤ 15 min p95; alert lists qty, safe-until time, grade |
| S3 | As P2 I receive matched batches I can actually accept | Matching respects capacity, dietary fit, distance, window; reject flow re-routes to next NGO |
| S4 | As P4 I get an optimized run sheet | Route respects time windows and cold-box capacity; ≤ 2 min solve time for 50 stops |
| S5 | As P3 I export a quarterly impact report | CSV/PDF export with meals, CO₂e, water, landfill-diverted; factor methodology cited |
| S6 | As any user I can scan a batch QR to see its lineage | QR → trace page shows prediction, quality signals, custody chain, impact entry |

## 6. Functional requirements

- **FR-1 Demand engine:** ingest POS/menu/attendance; produce item-level daily forecasts with P10/P50/P90 bands.
- **FR-2 Surplus detection:** compare prepared vs. consumed; auto-classify batches with quantity, safe window.
- **FR-3 Quality gate:** CV freshness score + IoT cold-chain rules → grade A/B/reject. Vision alone never clears a batch; temperature/time rules are mandatory.
- **FR-4 Alerting:** automated routine alerts; high-impact production changes require human approval.
- **FR-5 Matching engine:** rank eligible NGOs by capacity/fit/distance/window; auto-match top choice, fallback on rejection.
- **FR-6 Routing:** OR-Tools VRPTW solve; ETA, vehicle, cold-box assignment.
- **FR-7 Digital twin/QR:** every batch gets QR → full event lineage (append-only).
- **FR-8 Impact ledger:** on POD, compute meals served, CO₂e avoided (FAO/UNEP factors), money saved; immutable entries.
- **FR-9 Rewards:** points per kg diverted + compliance bonuses; tiers (Seedling/Sapling/Canopy); perks.
- **FR-10 ESG dashboard:** quarterly aggregates; export aligned to BRSR structure.
- **FR-11 Public site:** marketing pages, privacy policy, terms, cookie consent, waitlist with anti-spam.

## 7. Non-functional requirements

- **Security:** HTTPS/HSTS only; no secrets in front-end bundle; CSP; rate limiting; consent-gated analytics.
- **Privacy:** DPDP Act 2023 + GDPR principles; data minimization; no ad trackers.
- **Performance:** LCP < 2.5 s on mid-range Android; JS bundle < 300 KB gzip.
- **Accessibility:** WCAG 2.1 AA contrast; keyboard-navigable; alt text on images.
- **Reliability:** matching degrades gracefully (manual confirm) if models unavailable.
- **Explainability:** every AI output carries factor-wise reasons.

## 8. Success metrics

- ≥ 30% reduction in cooked surplus within 8 weeks of pilot.
- ≥ 85% of Grade-A batches matched within 20 minutes.
- ≥ 95% cold-chain compliance on redistributed batches.
- ≥ 90% waitlist-form spam rejection accuracy (honeypot+time-trap+rate limit).
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best-practices ≥ 95, SEO ≥ 95.

## 9. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| IoT/camera cost for small kitchens | Start with weigh-scale + manual inputs; sensors optional add-on |
| Limited historical data | Public datasets + clearly-labelled synthetic data for demo |
| CV can't confirm microbiological safety | Vision only *flags*; safety decided by temp/time rules + human |
| Trust & adoption | Human-approved high-impact actions; explainable factor breakdowns |
| Real-time routing under traffic | OR-Tools with time windows; re-solve on deviation |

## 10. Future scope

QR-based food tracking (MVP ships it) · rewards (MVP) · ESG dashboard (MVP) ·
**Government integration:** FSSAI surplus-food donation network alignment, municipal food-bank
federation, Suraksha-style API integration (future).
