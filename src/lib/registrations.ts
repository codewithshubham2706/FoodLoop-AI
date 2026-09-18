/**
 * Registration lifecycle shared by the public site (status timeline on the
 * member panel) and the staff console (approve / reject actions).
 *
 * In production the source of truth is the backend (`registrations` table +
 * `POST /v1/registrations/{id}/approve|reject` in docs/05-backend-schema.md).
 * In this demo both panels read the same overrides map, so a decision made in
 * the staff console is reflected in the member's panel of the same browser.
 */

import type { MemberRole } from './roles'

export type RegStatus = 'pending' | 'approved' | 'rejected'

export interface Registration {
  id: string
  name: string
  email: string
  phone: string
  role: MemberRole
  org: string
  city: string
  status: RegStatus
  created_at: string
  approved_at?: string
  whatsapp_opt_in: boolean
  /** Full organisation profile submitted at registration (member panel + staff console). */
  profile: {
    /** Messes / kitchens */
    daily_meals?: string
    kitchen_type?: string
    /** NGOs */
    beneficiary_count?: string
    beneficiary_type?: string
    pickup_capability?: string
    /** Vendors */
    category?: string
    dispatch_capability?: string
    /** All members */
    surplus_freq?: string
    servings_typical?: string
    storage?: string
  }
  notes?: string
}

const KEY = 'fl_reg_status_overrides'

type Overrides = Record<string, { status: RegStatus; at: string }>

function readOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as Overrides) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOverrides(next: Overrides): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — demo console just won't persist decisions */
  }
}

export function getStatusOverrides(): Overrides {
  return readOverrides()
}

export function getStatusFor(reg: Registration): { status: RegStatus; at?: string } {
  const override = readOverrides()[reg.id]
  if (override) return { status: override.status, at: override.at }
  return { status: reg.status, at: reg.approved_at }
}

export function setStatusOverride(id: string, status: Exclude<RegStatus, 'pending'>): void {
  const next = readOverrides()
  next[id] = { status, at: new Date().toISOString().slice(0, 16).replace('T', ' ') }
  writeOverrides(next)
}
