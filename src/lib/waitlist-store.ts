/**
 * Demo persistence bridge: the admin console and the user panel are separate
 * routes with in-memory state. This sessionStorage map lets an approval (or
 * rejection) made in the admin panel be reflected in the user panel of the
 * same tab — mirroring how the real backend would be the source of truth.
 */
const KEY = 'fl_demo_waitlist_status'

export type DecidedStatus = 'approved' | 'rejected'

export function getStatusOverrides(): Record<string, DecidedStatus> {
  try {
    const raw = sessionStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, DecidedStatus>) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function setStatusOverride(id: string, status: DecidedStatus): void {
  try {
    const next = { ...getStatusOverrides(), [id]: status }
    sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — demo panels just won't share state */
  }
}
