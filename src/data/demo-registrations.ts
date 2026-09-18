import type { Registration } from '../lib/registrations'

/**
 * Demo registrations shaped exactly like the documented backend contract
 * (docs/05-backend-schema.md §3.6 — `registrations` table). Synthetic data
 * only; no real personal data.
 */
export const REGISTRATIONS_DEMO: Registration[] = [
  {
    id: 'REG-0187',
    name: 'Aarav Sharma',
    email: 'aarav@campus.edu',
    phone: '+91 98••• ••042',
    role: 'mess',
    org: 'Campus Mess 02',
    city: 'New Delhi',
    status: 'pending',
    created_at: '2026-09-17 09:12',
    whatsapp_opt_in: true,
    profile: {
      daily_meals: '850–1,100 across 3 services',
      kitchen_type: 'College campus mess (self-operated)',
      surplus_freq: 'Daily, after lunch & dinner service',
      servings_typical: '40–90 meals per service',
      storage: '2 reach-in chillers (4°C) + 20 insulated crates',
    },
  },
  {
    id: 'REG-0186',
    name: 'Meera Nair',
    email: 'meera@annaseva.org',
    phone: '+91 97••• ••118',
    role: 'ngo',
    org: 'Anna Seva Foundation',
    city: 'New Delhi',
    status: 'pending',
    created_at: '2026-09-16 18:40',
    whatsapp_opt_in: true,
    profile: {
      beneficiary_count: '~420 meals/day across 6 shelters',
      beneficiary_type: 'Homeless shelter + community kitchen',
      pickup_capability: '2 vans, 1 driver, cold boxes for 150 meals',
      storage: '1 walk-in chiller at HQ (6°C)',
      surplus_freq: 'Can pick up 2 slots daily, 11:00–15:00',
    },
  },
  {
    id: 'REG-0185',
    name: 'Karan Malhotra',
    email: 'karan@freshplate.in',
    phone: '+91 90••• ••771',
    role: 'mess',
    org: 'FreshPlate Cloud Kitchen',
    city: 'Gurugram',
    status: 'pending',
    created_at: '2026-09-16 14:03',
    whatsapp_opt_in: false,
    profile: {
      daily_meals: '600 delivery orders/day',
      kitchen_type: 'Cloud kitchen (multi-brand)',
      surplus_freq: '3–4 times/week, mostly dinner',
      servings_typical: '25–60 meals per event',
      storage: 'Blast chiller + 12 crates',
    },
  },
  {
    id: 'REG-0183',
    name: 'Rohit Verma',
    email: 'rohit@coldlink.in',
    phone: '+91 99••• ••330',
    role: 'vendor',
    org: 'ColdLink Logistics',
    city: 'Noida',
    status: 'approved',
    created_at: '2026-09-15 11:05',
    approved_at: '2026-09-15 16:20',
    whatsapp_opt_in: false,
    profile: {
      category: 'Cold-chain transport partner (reefer vans)',
      surplus_freq: 'On-call, 2h dispatch SLA',
      storage: '6 reefer vans (0–8°C), GPS + temp loggers',
    },
  },
  {
    id: 'REG-0181',
    name: 'Priya Das',
    email: 'priya@citymunicipal.gov.in',
    phone: '+91 81••• ••220',
    role: 'ngo',
    org: 'City Municipal Food Cell',
    city: 'Delhi',
    status: 'rejected',
    created_at: '2026-09-14 15:22',
    whatsapp_opt_in: true,
    notes: 'Outside current pilot geography — revisit in phase 3.',
    profile: {
      beneficiary_count: 'Municipal-wide programme',
      beneficiary_type: 'Ward-level community kitchens',
      surplus_freq: 'N/A (coordinator role)',
    },
  },
]

// Dataset literal is non-empty by construction.
export const DEFAULT_REGISTRATION = REGISTRATIONS_DEMO[0]!
