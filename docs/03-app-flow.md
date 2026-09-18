# FoodLoop AI — App Flow

**Related:** [01-prd.md](01-prd.md) · [04-uiux-brief.md](04-uiux-brief.md) · [05-backend-schema.md](05-backend-schema.md)

## 1. The core loop

```
Food Prepared → AI Predicts Demand
        ↓
 Surplus Detected
        ↓
 Quality Check (CV + Sensors)
        ↓
 Alert Generated
        ↓
 NGO Matched Automatically
        ↓
 Optimized Delivery Route
        ↓
 Food Delivered
        ↓
 Impact Recorded (CO₂ saved, meals served)
```

The same loop renders as the seven-tile pipeline on the landing page (`PipelineLoop.tsx`) and
drives the batch state machine:

```
surplus_detected → quality_check → alert_generated → matched
      → in_transit → delivered → impact_recorded
                    ↘ (reject) → recycled / composted
```

## 2. Site map & routes

| Route | Page | Purpose | Sitemap priority |
| --- | --- | --- | --- |
| `/` | Landing | Pitch, closed loop, engines, waitlist CTA | 1.0 |
| `/dashboard` | Live demo | Forecast, KPIs, batch table | 0.8 |
| `/trace?batch=ID` | QR trace | Digital-twin custody timeline | 0.6 |
| `/rewards` | Rewards | Points, tiers, perks, ledger | 0.6 |
| `/esg` | ESG dashboard | Quarterly impact, frameworks | 0.6 |
| `/privacy` | Privacy policy | Legal | 0.3 |
| `/terms` | Terms | Legal | 0.3 |
| `/login` | Demo sign-in | Choose panel (user/admin) — OIDC in production | — |
| `/user` | **User panel** | Registration status, WhatsApp invite, onboarding checklist | — |
| `/admin` | **Admin panel** | Approvals; approve ⇒ one email w/ channel invite | — |
| `*` | 404 | Catch-all (also static `404.html`) | — |

## 3. Key journeys

### 3.1 Visitor → waitlist (the one CTA)
1. Land on `/` → hero states the promise; **single primary button: "Join the pilot"**.
2. Button anchor-scrolls to `#waitlist` (or header CTA from any page).
3. Form validates name/email/org/role inline (ARIA `aria-invalid` + `role="alert"`).
4. Honeypot + time-trap filter bots silently; success state confirms.
5. Event: `waitlist_submit` (GA4, only if consented).

### 3.2 Two panels (demo sign-in at /login)

**User panel (`/user`)** — for approved pilot members (kitchen/NGO staff):
registration status timeline (submitted → admin review → approval email), the WhatsApp
channel invite card ("view the email you received" or join directly), and an onboarding
checklist. Guarded by `RequireRole role="user"`.

**Admin panel (`/admin`)** — for FoodLoop staff: KPI tiles, filterable registration list,
approve/reject actions; approving records the decision and previews the single WhatsApp-invite
email. Guarded by `RequireRole role="admin"`. Wrong-role visits redirect to their own panel.

In the demo build an approval in the admin panel is reflected in the user panel of the same
browser session (sessionStorage bridge). Production: OIDC roles + `users` table; panels read
the same backend.

### 3.3 Demo exploration (judges)
1. `/dashboard` — KPI tiles → 7-day forecast (SVG bars) → batch table.
2. Click **QR** on a batch row → `/trace?batch=FL-2026-0042`.
3. Trace page: summary facts → custody timeline → demo QR panel → try other batches.
4. `/rewards` shows the incentive engine; `/esg` shows audit-ready reporting.

### 3.4 Kitchen ops (target production flow)
```
Login → site overview → forecast (adjust cook plan, human-approved)
      → service ends → surplus detected (auto)
      → quality gate (CV+IoT auto; A/B/reject)
      → alert (auto) → NGO match (auto; reject → fallback)
      → route sheet → pickup → POD → impact ledger entry
```

### 3.5 NGO coordinator (target production flow)
```
Push/SMS alert (batch, qty, window, grade) → accept / reject
      → accept: pickup ETA + driver info → receive → POD
      → rejection auto-triggers next-ranked NGO (30 s)
```

### 3.5 Consent journey
First visit → cookie banner (essential vs analytics) → choice stored in localStorage →
analytics loads **only** on accept; "Cookie settings" in footer reopens the choice anytime.

## 4. States & edge cases

| Case | Behavior |
| --- | --- |
| Unknown batch ID in `/trace` | Friendly "not found" card + demo batch chips |
| JS disabled | `<noscript>` message with contact email; static 404 still works |
| Direct deep link (`/esg`) on static host | SPA fallback rewrites to `/index.html`; GitHub Pages uses `404.html` |
| Form double-submit | Submit disabled while pending |
| Slow network | Fonts `display=swap`; images sized/lazy; no layout shift |
| Reduced motion | `prefers-reduced-motion` disables animations/transitions |
