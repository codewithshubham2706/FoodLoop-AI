import { createContext, useContext } from 'react'

const STORAGE_KEY = 'foodloop-consent-v1'

export interface ConsentState {
  /** Analytics cookies (GA4) allowed? */
  analytics: boolean
  /** Timestamp of the explicit choice, if any. */
  decidedAt: string | null
}

export const DEFAULT_CONSENT: ConsentState = { analytics: false, decidedAt: null }
export { STORAGE_KEY }

interface ConsentContextValue extends ConsentState {
  /** True until the visitor actively accepts or declines. */
  isPending: boolean
  decide: (choice: { analytics: boolean }) => void
  reset: () => void
}

export const ConsentContext = createContext<ConsentContextValue | null>(null)

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>')
  return ctx
}
