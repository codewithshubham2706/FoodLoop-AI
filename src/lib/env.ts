/**
 * Centralized access to *public* runtime configuration.
 *
 * SECURITY: anything prefixed `VITE_` is compiled into the bundle and is
 * world-readable. This module is the ONLY place that reads import.meta.env,
 * so a stray secret in a component is easy to spot in review. Server-side
 * secrets (API keys, DB credentials, signing keys) live ONLY in the backend
 * environment — the browser talks to the API over HTTPS and never sees them.
 */

function read(name: string, fallback: string): string {
  const raw = import.meta.env[name]
  return typeof raw === 'string' && raw.length > 0 ? raw : fallback
}

export const SITE_URL = read('VITE_SITE_URL', 'https://foodloop.ai').replace(/\/+$/, '')

export const CONTACT_EMAIL = read('VITE_CONTACT_EMAIL', 'hello@foodloop.ai')

/** GA4 measurement ID (public identifier — not a secret). Empty ⇒ analytics no-ops. */
export const GA4_MEASUREMENT_ID = read('VITE_GA4_MEASUREMENT_ID', '')

export const SITE_NAME = 'FoodLoop AI'

/** Absolute URL helper for canonical/OG tags. */
export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}
