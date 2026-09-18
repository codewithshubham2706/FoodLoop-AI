import { createContext, useContext } from 'react'

export type Role = 'user' | 'admin'

export interface DemoUser {
  name: string
  email: string
  role: Role
  org: string
  /** For pilot-member accounts: the waitlist registration shown in their panel. */
  waitlistId?: string
}

/**
 * Demo accounts (no passwords — mirrors the OIDC design in TRD §6).
 * `user` → /user panel; `admin` → /admin approval console.
 */
export const DEMO_ACCOUNTS: Record<Role, DemoUser> = {
  user: {
    name: 'Aarav Sharma',
    email: 'aarav@campus.edu',
    role: 'user',
    org: 'Campus Mess 02',
    waitlistId: 'WL-0187',
  },
  admin: {
    name: 'FoodLoop Staff',
    email: 'staff@foodloop.ai',
    role: 'admin',
    org: 'FoodLoop AI',
  },
}

export interface AuthState {
  user: DemoUser | null
  signIn: (role: Role) => void
  signOut: () => void
}

const SESSION_KEY = 'fl_demo_session'

export function readSession(): DemoUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoUser
    if (parsed && (parsed.role === 'user' || parsed.role === 'admin') && typeof parsed.email === 'string') {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function writeSession(user: DemoUser | null): void {
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
