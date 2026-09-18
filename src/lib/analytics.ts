/**
 * Consent-gated analytics.
 *
 * - Nothing loads until the visitor opts in via the cookie banner.
 * - With no GA4 measurement ID configured (or consent declined), every call
 *   is a no-op stub so the rest of the app never branches on analytics.
 */

interface GTagQueue {
  (command: 'js', date: Date): void
  (command: 'config', targetId: string, params?: Record<string, unknown>): void
  (command: 'event', name: string, params?: Record<string, unknown>): void
  (...args: unknown[]): void
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GTagQueue
  }
}

export type AnalyticsEvent =
  | 'cta_click'
  | 'waitlist_submit'
  | 'qr_scan'
  | 'page_view'

let loaded = false
let measurementId: string | null = null

function injectScript(id: string): void {
  if (loaded) return
  loaded = true

  window.dataLayer = window.dataLayer ?? []
  const gtag: GTagQueue = (...args: unknown[]) => {
    window.dataLayer?.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', id, { anonymize_ip: true })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}

/** Called by the consent layer whenever the analytics choice changes. */
export function setAnalyticsConsent(enabled: boolean, ga4Id: string): void {
  if (enabled && ga4Id) {
    measurementId = ga4Id
    injectScript(ga4Id)
  }
}

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (!measurementId || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackPageView(path: string, title: string): void {
  trackEvent('page_view', { page_path: path, page_title: title })
}
