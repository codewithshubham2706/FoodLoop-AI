import { useState, type ReactNode } from 'react'
import { AuthContext, DEMO_ACCOUNTS, readSession, writeSession, type SessionUser, type Role } from './auth-context'

/**
 * Session provider for the demo sign-in. Session lives in sessionStorage so
 * each browser tab can hold its own panel session (handy for comparing the
 * member and staff consoles side by side).
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readSession())

  const value = {
    user,
    signIn: (role: Role) => {
      const u = DEMO_ACCOUNTS[role]
      writeSession(u)
      setUser(u)
    },
    signOut: () => {
      writeSession(null)
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
