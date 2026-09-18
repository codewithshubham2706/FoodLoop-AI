/**
 * Role registry for FoodLoop AI.
 *
 * Two staff roles exist in the product, but only `member` roles are
 * public-facing in this front end:
 *
 *  - `staff` (FoodLoop operators) work in a separate internal console that
 *    lives in the backend, NOT in this public app. The demo preview of that
 *    console lives at /staff-console and is not linked from public navigation
 *    (mirrors production, where it is an internal tool behind SSO).
 *  - `mess` / `ngo` / `vendor` are pilot members: they register with full
 *    organisation details, get approved by staff, and then use the member
 *    panel (/user).
 */

export type Role = 'staff' | 'mess' | 'ngo' | 'vendor'

export type MemberRole = Exclude<Role, 'staff'>

export const STAFF_ROLE: Role = 'staff'

export const MEMBER_ROLES: readonly MemberRole[] = ['mess', 'ngo', 'vendor'] as const

export function isMemberRole(role: Role): role is MemberRole {
  return role !== 'staff'
}

export function isStaffRole(role: Role): role is 'staff' {
  return role === 'staff'
}

/** Human labels used across the login page, forms and panels. */
export const ROLE_LABELS: Record<Role, string> = {
  staff: 'FoodLoop staff',
  mess: 'Institutional mess / kitchen',
  ngo: 'NGO / food redistribution partner',
  vendor: 'Local vendor / caterer',
}

export const ROLE_SHORT: Record<Role, string> = {
  staff: 'Staff',
  mess: 'Mess',
  ngo: 'NGO',
  vendor: 'Vendor',
}

/** Member panel route (staff have no panel in the public app). */
export const MEMBER_PANEL = '/user'

export const STAFF_CONSOLE = '/staff-console'
