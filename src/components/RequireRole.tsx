import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'
import { isStaffRole, MEMBER_PANEL, STAFF_CONSOLE } from '../lib/roles'

/**
 * Route guard.
 *  - `role='member'` → any signed-in member (mess / ngo / vendor).
 *  - `role='staff'`  → FoodLoop staff only (demo console route).
 * Unauthenticated visitors go to /login (remembering the destination);
 * signed-in users with the wrong role are bounced to their own console.
 */
export default function RequireRole({ role, children }: { role: 'member' | 'staff'; children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  const userIsStaff = isStaffRole(user.role)
  const allowed = role === 'staff' ? userIsStaff : !userIsStaff
  if (!allowed) {
    return <Navigate to={userIsStaff ? STAFF_CONSOLE : MEMBER_PANEL} replace />
  }

  return <>{children}</>
}
