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

export const SITE_URL = read('VITE_SITE_URL', 'https://codewithshubham2706.github.io').replace(/\/+$/, '')

/**
 * Deploy base path (no trailing slash): '' locally, '/FoodLoop-AI' on GitHub
 * Pages. Vite prefixes hashed assets with its own base; use this for any
 * asset refs the app renders itself and for joining SITE_URL + route paths.
 * Convention: SITE_URL never ends with '/', BASE_PATH is '' or '/xxx', and
 * every route path starts with '/' — so `${SITE_URL}${BASE_PATH}${path}`.
 */
export const BASE_PATH = read('VITE_BASE_PATH', '').replace(/\/+$/, '')

export const CONTACT_EMAIL = read('VITE_CONTACT_EMAIL', 'hello@foodloop.ai')

/** GA4 measurement ID (public identifier — not a secret). Empty ⇒ analytics no-ops. */
export const GA4_MEASUREMENT_ID = read('VITE_GA4_MEASUREMENT_ID', '')

export const SITE_NAME = 'FoodLoop AI'

/** Absolute URL helper for canonical/OG tags (base-path aware). */
export function absoluteUrl(pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${SITE_URL}${BASE_PATH}${p}`
}

/** Root-relative path helper for image tags and assets the app renders itself. */
export function assetUrl(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}
