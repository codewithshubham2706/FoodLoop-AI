import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'

/**
 * Panel guard: renders children only when signed in with the right role,
 * otherwise redirects to /login (remembering where the user was headed).
 */
export default function RequireRole({ role, children }: { role: 'user' | 'admin'; children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (user.role !== role) {
    // Wrong panel for this role — send them to their own.
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />
  }
  return <>{children}</>
}
