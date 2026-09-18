# FoodLoop AI — Backend Schema & API Contracts

**Related:** [02-trd.md](02-trd.md) · Synthetic fixtures mirroring these contracts: `src/data/demo.ts`

## 1. Entity relationship overview

```
sites 1─* batches 1─1 quality_inspections
                │ 1─* custody_events
                │ 1─1 impact_entries
                │ 1─1 qr_codes
ngos  1─* ngo_capacity 1─* matches *─1 batches
sites 1─* demand_forecasts
businesses 1─1 reward_accounts 1─* reward_ledger
vehicles 1─* routes 1─* route_stops *─1 batches
users ─ sites / ngos (role-based)
```

## 2. PostgreSQL DDL (core tables)

```sql
-- Sites (kitchens, stores) with geo for matching
CREATE TABLE sites (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('mess','processor','cold_storage','store')),
  geog         geography(Point, 4326) NOT NULL,
  address      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partner NGOs
CREATE TABLE ngos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  geog         geography(Point, 4326) NOT NULL,
  contact      JSONB NOT NULL,            -- {phone, email, hours}
  verified     BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ngo_capacity (
  ngo_id       UUID REFERENCES ngos(id),
  day_of_week  SMALLINT CHECK (day_of_week BETWEEN 0 AND 6),
  meals_cap    INT  NOT NULL,
  dietary      TEXT[] NOT NULL DEFAULT '{}',   -- {veg, halal, jain...}
  PRIMARY KEY (ngo_id, day_of_week)
);

-- Surplus batches (the digital twin root)
CREATE TABLE batches (
  id           TEXT PRIMARY KEY,          -- 'FL-2026-0042'
  site_id      UUID REFERENCES sites(id),
  item         TEXT NOT NULL,
  qty_kg       NUMERIC(8,2) NOT NULL,
  meals_est    INT,
  window_from  TIME NOT NULL,
  window_until TIME NOT NULL,
  status       TEXT NOT NULL DEFAULT 'surplus_detected'
               CHECK (status IN ('surplus_detected','quality_check','alert_generated',
                                 'matched','in_transit','delivered','impact_recorded',
                                 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CV + IoT quality gate (append-only)
CREATE TABLE quality_inspections (
  id            BIGSERIAL PRIMARY KEY,
  batch_id      TEXT REFERENCES batches(id),
  cv_score      NUMERIC(4,3),             -- 0..1 freshness
  cv_model      TEXT,
  iot_summary   JSONB,                    -- {min_temp, max_temp, minutes_above}
  rules_passed  JSONB,                    -- evaluated food-safety rules
  grade         TEXT NOT NULL CHECK (grade IN ('A','B','REJECT')),
  inspected_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full lineage (QR trace reads this)
CREATE TABLE custody_events (
  id         BIGSERIAL PRIMARY KEY,
  batch_id   TEXT REFERENCES batches(id),
  stage      TEXT NOT NULL,               -- 'predicted','quality_check','alert_generated',...
  detail     JSONB NOT NULL,
  prev_hash  BYTEA,
  hash       BYTEA NOT NULL,              -- hash chain → tamper-evident
  ts         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX custody_batch_idx ON custody_events (batch_id, ts);

-- Impact ledger (FAO/UNEP FLW factors; append-only)
CREATE TABLE impact_entries (
  id           BIGSERIAL PRIMARY KEY,
  batch_id     TEXT UNIQUE REFERENCES batches(id),
  meals_served INT NOT NULL,
  co2e_kg      NUMERIC(10,2) NOT NULL,
  water_m3     NUMERIC(10,2),
  landfill_diverted_kg NUMERIC(8,2) NOT NULL,
  factor_set   TEXT NOT NULL,             -- 'FAO/UNEP FLW 2024'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE impact_ledger_hashes (
  entry_id  BIGINT PRIMARY KEY REFERENCES impact_entries(id),
  hash      BYTEA NOT NULL
);

-- Rewards
CREATE TABLE reward_accounts (
  business_id UUID PRIMARY KEY REFERENCES sites(id),
  points      INT NOT NULL DEFAULT 0,
  tier        TEXT NOT NULL DEFAULT 'Seedling' CHECK (tier IN ('Seedling','Sapling','Canopy'))
);

CREATE TABLE reward_ledger (
  id          BIGSERIAL PRIMARY KEY,
  business_id UUID REFERENCES sites(id),
  delta       INT NOT NULL,
  reason      TEXT NOT NULL,              -- 'diverted_kg','cold_chain_streak',...
  ref_batch   TEXT REFERENCES batches(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forecasts (explainable)
CREATE TABLE demand_forecasts (
  id          BIGSERIAL PRIMARY KEY,
  site_id     UUID REFERENCES sites(id),
  item        TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  yhat        NUMERIC(8,1) NOT NULL,
  p10         NUMERIC(8,1),
  p90         NUMERIC(8,1),
  factors     JSONB NOT NULL,             -- {menu:…, attendance:…, weekday:…, weather:…}
  model_ver   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (site_id, item, forecast_date, model_ver)
);
```

## 3. REST API (FastAPI, all under HTTPS)

### 3.1 Forecast
```
GET /v1/forecast/{site_id}?days=7&items=veg,nonveg,produce
→ 200 {
  "model": "foodloop-demand-v3",
  "generated_at": "2026-09-18T05:30:00Z",
  "site_id": "CAMPUS-MESS-01",
  "horizon_days": 7,
  "items": [{ "item": "Cooked meals (veg)", "yhat": [420,435,410,390,460,505,480],
              "lower": [...], "upper": [...],
              "factors": { "menu": 0.41, "attendance": 0.27, "weekday": 0.18, "weather": 0.14 } }]
}
```

### 3.2 Batches
```
POST /v1/batches                    { site_id, item, qty_kg, meals_est, window_from, window_until }
→ 201 { "id": "FL-2026-0043", "status": "surplus_detected", "qr_url": "https://…/trace?batch=FL-2026-0043" }

GET  /v1/batches?status=in_transit&site_id=…
→ 200 [ { id, item, qty_kg, meals_est, window{from,until}, site{name,lat,lon},
          quality{grade,score,signals[]}, status, ngo?, co2_saved_kg? } ]

GET  /v1/batches/{id}/trace         (public; cached; powers QR page)
→ 200 [ { ts, stage, detail, ok } ]
```

### 3.3 Quality gate
```
POST /v1/batches/{id}/inspection    { cv_score, cv_model, iot_summary }
→ 201 { "grade": "A", "rules_passed": ["temp≤5°C","window≥2h","seal_ok"] }
```

### 3.4 Matching & routing
```
POST /v1/batches/{id}/match
→ 200 { "ngo_id": "…", "score": 0.91, "alternates": [ {ngo_id, score} … ] }

POST /v1/matches/{match_id}/reject  → re-matches to next-ranked NGO ≤ 30 s

POST /v1/routes/solve               { batch_ids[], vehicles[] }
→ 200 { "routes": [ { vehicle_id, stops: [{batch_id, eta, seq}], distance_km, solve_ms } ] }
```

### 3.5 Impact & rewards
```
POST /v1/batches/{id}/pod           { received_by, meals_actual }
→ 201 { "impact": { "meals_served": 120, "co2e_kg": 76, "factor_set": "FAO/UNEP FLW 2024" } }

GET  /v1/impact/summary?period=2026-Q2&site_id=…
→ 200 { "meals": 4460, "co2e_tons": 7.9, "water_m3": 1420, "landfill_kg": 380 }

GET  /v1/rewards/{business_id}      → { points, tier, history[] }
POST /v1/rewards/{business_id}/redeem
```

### 3.6 Waitlist, admin approval & WhatsApp channel (public site)

Registration → approval → single approval email flow:

```
POST /api/waitlist
  { name, email, org, role, whatsapp_opt_in: bool, whatsapp_phone?: string,
    company_website?: "" (honeypot), elapsed_ms }
→ 202 { "id": "WL-0187", "status": "pending" } | 429 (rate limited) | 400 (validation)
Server enforces: honeypot empty, elapsed ≥ 2.5 s, ≤ 5 req/hour/IP, email/org uniqueness.

-- Admin (staff OIDC role) reviews pending entries in the /admin console:
GET  /v1/waitlist?status=pending          → 200 [ { id, name, email, org, role,
                                                   whatsapp_opt_in, whatsapp_phone?,
                                                   status, created_at } ]
POST /v1/waitlist/{id}/approve            → 202 — sets status=approved, appends
                                                  approval_emails row, enqueues the
                                                  transactional email
POST /v1/waitlist/{id}/reject             → 202 — sets status=rejected (no email)
```

**Approval email (sent once, triggered by approve):** To = applicant; subject
"You are approved — join the FoodLoop AI WhatsApp channel"; body contains the WhatsApp
channel invite (`https://whatsapp.com/channel/…`), channel name, and what the channel
broadcasts (surplus alerts, pilot onboarding, monthly impact digests). Idempotency: the
`approval_emails` UNIQUE(waitlist_id) row guarantees one email per registration even if the
endpoint is retried. Provider: Resend/SES template `wl-approval-v1`.

```sql
-- Registration + approval audit trail (public-site PII, business contacts only)
CREATE TABLE waitlist (
  id              TEXT PRIMARY KEY,          -- 'WL-0187'
  name            TEXT NOT NULL,
  email           CITEXT NOT NULL UNIQUE,
  org             TEXT NOT NULL,
  role            TEXT NOT NULL,
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT false,
  whatsapp_phone  TEXT,                      -- E.164; only if opt_in
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected')),
  reviewed_by     UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at     TIMESTAMPTZ
);

CREATE TABLE approval_emails (
  waitlist_id  TEXT PRIMARY KEY REFERENCES waitlist(id),  -- 1:1 ⇒ one email each
  provider     TEXT NOT NULL,                -- 'resend' | 'ses'
  message_id   TEXT NOT NULL,
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE broadcast_channel (             -- single channel, versioned invite
  id            SMALLINT PRIMARY KEY DEFAULT 1,
  channel_name  TEXT NOT NULL,
  invite_url    TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 4. MQTT topics (IoT cold-chain)

```
foodloop/{site_id}/sensors/{device_id}/temperature   (30 s interval)
foodloop/{site_id}/sensors/{device_id}/fill_level
foodloop/{site_id}/alerts/cold_chain_breach          (retained, QoS 1)
```
Bridge authenticates with per-device certs (TLS); messages ≤ 256 B CBOR.

## 5. Event pipeline (batch state machine)

```
scan/POS → surplus_detected → quality_check ──REJECT──→ recycled
                                    │ grade A/B
                                    ▼
                             alert_generated → matched ──reject──→ next NGO
                                    │                │
                                    ▼                ▼
                              in_transit ← route_solved
                                    │ POD
                                    ▼
                             impact_recorded  (+reward_ledger entry)
```

## 6. Non-functional backend notes

- **Auth:** OIDC with two console roles — `member` (sees own registration in the user panel)
  and `staff` (admin approval console). Panel access = role check server-side, not just a
  hidden route. Signed device certs (IoT), scoped API keys (POS).
- **Rate limiting:** Redis token bucket — 100 req/min/user, stricter on public endpoints.
- **Privacy:** PII limited to business contacts; trace endpoint serves zero PII (QR-safe).
- **Observability:** OpenTelemetry traces; alert SLOs per TRD §5.
