import { createContext, useContext } from 'react'
import type { Role } from './roles'

export type { Role } from './roles'

export interface SessionUser {
  name: string
  email: string
  role: Role
  /** Organization / mess / NGO the account belongs to. */
  org: string
  /** For pilot members: the registration shown in their panel. */
  regId?: string
}

/**
 * Demo accounts (no passwords — mirrors the OIDC design in TRD §6).
 * `mess` → /user member panel; `staff` → /staff-console (demo console only).
 */
export const DEMO_ACCOUNTS: Record<Role, SessionUser> = {
  staff: {
    name: 'FoodLoop Staff',
    email: 'staff@foodloop.ai',
    role: 'staff',
    org: 'FoodLoop AI',
  },
  mess: {
    name: 'Aarav Sharma',
    email: 'aarav@campus.edu',
    role: 'mess',
    org: 'Campus Mess 02',
    regId: 'REG-0187',
  },
  ngo: {
    name: 'Priya Nair',
    email: 'priya@annaseva.org',
    role: 'ngo',
    org: 'Anna Seva Foundation',
    regId: 'REG-0186',
  },
  vendor: {
    name: 'Rahul Verma',
    email: 'rahul@spicemart.in',
    role: 'vendor',
    org: 'SpiceMart Caterers',
    regId: 'REG-0185',
  },
}

export interface AuthState {
  user: SessionUser | null
  signIn: (role: Role) => void
  signOut: () => void
}

const SESSION_KEY = 'fl_demo_session'

export function readSession(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionUser
    const roles: Role[] = ['staff', 'mess', 'ngo', 'vendor']
    if (parsed && roles.includes(parsed.role) && typeof parsed.email === 'string') {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function writeSession(user: SessionUser | null): void {
  try {
    if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* storage unavailable (private mode) — session simply won't persist */
  }
}

export const AuthContext = createContext<AuthState>({
  user: null,
  signIn: () => {},
  signOut: () => {},
})

export function useAuth(): AuthState {
  return useContext(AuthContext)
}
