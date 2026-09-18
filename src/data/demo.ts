/**
 * Demo data shaped exactly like the documented backend contracts
 * (see docs/05-backend-schema.md) so the UI and API stay in lock-step.
 * All data is synthetic; no real personal data anywhere.
 */

export type BatchStatus =
  | 'surplus_detected'
  | 'quality_check'
  | 'alert_generated'
  | 'matched'
  | 'in_transit'
  | 'delivered'
  | 'impact_recorded'

export interface ForecastResponse {
  model: string
  generated_at: string
  site_id: string
  horizon_days: number
  items: Array<{ item: string; yhat: number[] }>
}

export interface SurplusBatch {
  id: string
  item: string
  qty_kg: number
  meals_est: number
  window: { from: string; until: string }
  site: { name: string; lat: number; lon: number }
  quality: { grade: 'A' | 'B'; score: number; signals: string[] }
  status: BatchStatus
  ngo?: string
  co2_saved_kg?: number
}

export const PIPELINE_STEPS: Array<{
  id: BatchStatus
  label: string
  hint: string
  accent: boolean
}> = [
  { id: 'surplus_detected', label: 'Surplus detected', hint: 'Demand gap predicted by DEMAND AI', accent: false },
  { id: 'quality_check', label: 'Quality check', hint: 'CV + IoT cold-chain sensors', accent: false },
  { id: 'alert_generated', label: 'Alert generated', hint: 'Auto-alert to ops + partner NGOs', accent: false },
  { id: 'matched', label: 'NGO matched', hint: 'MATCHING AI ranks eligible NGOs', accent: false },
  { id: 'in_transit', label: 'Route optimized', hint: 'ROUTE AI solves VRPTW', accent: false },
  { id: 'delivered', label: 'Delivered', hint: 'POD confirmed by NGO app', accent: true },
  { id: 'impact_recorded', label: 'Impact recorded', hint: 'CO₂e + meals ledger entry', accent: false },
]

export const FORECAST: ForecastResponse = {
  model: 'TFT demand model · vLLM-served (foodloop-demand-v3)',
  generated_at: '2026-09-18T05:30:00Z',
  site_id: 'CAMPUS-MESS-01',
  horizon_days: 7,
  items: [
    { item: 'Cooked meals (veg)', yhat: [420, 435, 410, 390, 460, 505, 480] },
    { item: 'Cooked meals (non-veg)', yhat: [180, 175, 190, 170, 210, 230, 205] },
    { item: 'Fresh produce', yhat: [95, 90, 85, 120, 110, 140, 125] },
  ],
}

export const BATCHES: SurplusBatch[] = [
  {
    id: 'FL-2026-0042',
    item: 'Cooked veg meals',
    qty_kg: 42,
    meals_est: 120,
    window: { from: '13:10', until: '16:00' },
    site: { name: 'Campus Mess 01', lat: 28.545, lon: 77.192 },
    quality: { grade: 'A', score: 0.96, signals: ['Core temp 4°C (2h)', 'CV freshness 0.96', 'Sealed trays intact'] },
    status: 'in_transit',
    ngo: 'Annapurna Seva Trust',
    co2_saved_kg: 76,
  },
  {
    id: 'FL-2026-0041',
    item: 'Fresh produce — mixed veg',
    qty_kg: 18,
    meals_est: 60,
    window: { from: '11:45', until: '14:30' },
    site: { name: 'Campus Mess 02', lat: 28.552, lon: 77.185 },
    quality: { grade: 'B', score: 0.82, signals: ['Core temp 6°C (1h)', 'CV freshness 0.84', 'Minor bruising flagged'] },
    status: 'delivered',
    ngo: 'Sahyog Community Kitchen',
    co2_saved_kg: 31,
  },
  {
    id: 'FL-2026-0040',
    item: 'Cooked non-veg meals',
    qty_kg: 25,
    meals_est: 70,
    window: { from: '12:30', until: '15:00' },
    site: { name: 'Campus Mess 01', lat: 28.545, lon: 77.192 },
    quality: { grade: 'A', score: 0.93, signals: ['Core temp 3°C (3h)', 'CV freshness 0.93', 'Cold-chain unbroken'] },
    status: 'matched',
    ngo: 'Hope Foundation Shelter',
  },
  {
    id: 'FL-2026-0039',
    item: 'Dairy — curd packs',
    qty_kg: 12,
    meals_est: 0,
    window: { from: '09:20', until: '11:00' },
    site: { name: 'Central Store', lat: 28.549, lon: 77.19 },
    quality: { grade: 'B', score: 0.41, signals: ['Core temp 11°C (40m)', 'CV label check OK', 'Cold-chain breach — REJECT'] },
    status: 'alert_generated',
  },
]

export interface RewardLedgerEntry {
  month: string
  waste_diverted_kg: number
  points: number
  tier: 'Seedling' | 'Sapling' | 'Canopy'
}

export const REWARDS: { business: string; points: number; tier: RewardLedgerEntry['tier']; history: RewardLedgerEntry[] } = {
  business: 'Campus Mess 01',
  points: 4820,
  tier: 'Canopy',
  history: [
    { month: 'Apr 2026', waste_diverted_kg: 310, points: 1240, tier: 'Seedling' },
    { month: 'May 2026', waste_diverted_kg: 420, points: 1480, tier: 'Sapling' },
    { month: 'Jun 2026', waste_diverted_kg: 505, points: 2100, tier: 'Canopy' },
  ],
}

export interface EsgRecord {
  period: string
  meals: number
  co2e_tons: number
  water_m3: number
  landfill_kg: number
}

export const ESG: { site: string; records: EsgRecord[] } = {
  site: 'Campus cluster — 3 kitchens',
  records: [
    { period: 'Q1 2026', meals: 3120, co2e_tons: 5.4, water_m3: 980, landfill_kg: 540 },
    { period: 'Q2 2026', meals: 4460, co2e_tons: 7.9, water_m3: 1420, landfill_kg: 380 },
  ],
}

export interface TraceEvent {
  ts: string
  stage: string
  detail: string
  ok: boolean
}

export const TRACE: Record<string, TraceEvent[]> = {
  'FL-2026-0042': [
    { ts: '2026-09-18 05:30', stage: 'Predicted', detail: 'DEMAND AI forecast gap: 38–46 kg after lunch service', ok: true },
    { ts: '2026-09-18 13:10', stage: 'Surplus detected', detail: '42 kg cooked veg meals — scale + tray count', ok: true },
    { ts: '2026-09-18 13:12', stage: 'Quality check', detail: 'CV freshness 0.96 · core temp 4°C · grade A', ok: true },
    { ts: '2026-09-18 13:12', stage: 'Alert generated', detail: 'Ops + 3 eligible NGOs notified', ok: true },
    { ts: '2026-09-18 13:19', stage: 'NGO matched', detail: 'Annapurna Seva Trust — capacity 150 meals, 4.1 km', ok: true },
    { ts: '2026-09-18 13:24', stage: 'Route optimized', detail: 'VRPTW route: 2 stops · ETA 14:05 · cold box V-12', ok: true },
    { ts: '2026-09-18 13:58', stage: 'Delivered', detail: 'POD signed by NGO volunteer · 120 meals', ok: true },
    { ts: '2026-09-18 14:00', stage: 'Impact recorded', detail: '76 kg CO₂e avoided · ledger entry #8412', ok: true },
  ],
}

export function traceFor(batchId: string): TraceEvent[] {
  return TRACE[batchId] ?? []
}

/* ── Waitlist → admin approval → WhatsApp channel email ──────────
   Flow: user registers (with optional WhatsApp opt-in) → admin approves
   in the /admin console → ONE transactional email is sent to their
   address containing the WhatsApp channel invite; broadcast updates
   (surplus alerts, pilot news, impact digests) arrive on that channel.
   Mirrors the contracts in docs/05-backend-schema.md §3.6–3.7. */

export type WaitlistStatus = 'pending' | 'approved' | 'rejected'

export interface WaitlistEntry {
  id: string
  name: string
  email: string
  org: string
  role: string
  whatsapp_opt_in: boolean
  whatsapp_phone?: string
  status: WaitlistStatus
  created_at: string
  approved_at?: string
}

export const DEFAULT_WAITLIST_ENTRY: WaitlistEntry = {
  id: 'WL-0187',
  name: 'Aarav Sharma',
  email: 'aarav@campus.edu',
  org: 'Campus Mess 02',
  role: 'Institutional kitchen / mess',
  whatsapp_opt_in: true,
  whatsapp_phone: '+91 98••• ••042',
  status: 'pending',
  created_at: '2026-09-17 09:12',
}

export const WAITLIST_DEMO: WaitlistEntry[] = [
  DEFAULT_WAITLIST_ENTRY,
  {
    id: 'WL-0186',
    name: 'Meera Nair',
    email: 'meera@annapurnaseva.org',
    org: 'Annapurna Seva Trust',
    role: 'NGO / community kitchen',
    whatsapp_opt_in: true,
    status: 'pending',
    created_at: '2026-09-16 18:40',
  },
  {
    id: 'WL-0185',
    name: 'Karan Malhotra',
    email: 'karan@freshplate.in',
    org: 'FreshPlate Cloud Kitchen',
    role: 'Institutional kitchen / mess',
    whatsapp_opt_in: false,
    status: 'pending',
    created_at: '2026-09-16 14:03',
  },
  {
    id: 'WL-0183',
    name: 'Rohit Verma',
    email: 'rohit@coldlink.in',
    org: 'ColdLink Logistics',
    role: 'Cold-chain / logistics partner',
    whatsapp_opt_in: false,
    status: 'approved',
    created_at: '2026-09-15 11:05',
    approved_at: '2026-09-15 16:20',
  },
  {
    id: 'WL-0181',
    name: 'Priya Das',
    email: 'priya@citymunicipal.gov.in',
    org: 'City Municipal Body',
    role: 'Government / municipal body',
    whatsapp_opt_in: true,
    whatsapp_phone: '+91 81••• ••220',
    status: 'rejected',
    created_at: '2026-09-14 15:22',
  },
]

/** The single approval email: contains the WhatsApp channel invite. */
export const APPROVAL_EMAIL = {
  from: 'FoodLoop AI <hello@foodloop.ai>',
  subject: 'You are approved — join the FoodLoop AI WhatsApp channel',
  channel_name: 'FoodLoop AI · Pilot Broadcast',
  channel_invite: 'https://whatsapp.com/channel/0029VaFoodLoopPilot',
  bullets: [
    'Surplus alerts from kitchens near you (grade, qty, pickup window)',
    'Pilot onboarding steps and data-connect sessions',
    'Monthly impact digests — meals served, CO₂e avoided',
  ],
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
