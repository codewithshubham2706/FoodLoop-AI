import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ConsentContext, DEFAULT_CONSENT, STORAGE_KEY } from './consent-context'
import type { ConsentState } from './consent-context'

function loadStored(): ConsentState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONSENT
    const parsed = JSON.parse(raw) as Partial<ConsentState>
    return {
      analytics: parsed.analytics === true,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : null,
    }
  } catch {
    return DEFAULT_CONSENT
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(() =>
    typeof window === 'undefined' ? DEFAULT_CONSENT : loadStored(),
  )

  const decide = useCallback((choice: { analytics: boolean }) => {
    const next: ConsentState = { analytics: choice.analytics, decidedAt: new Date().toISOString() }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable (private mode) — keep in-memory only */
    }
    setConsent(next)
  }, [])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setConsent(DEFAULT_CONSENT)
  }, [])

  const value = useMemo(
    () => ({ ...consent, isPending: consent.decidedAt === null, decide, reset }),
    [consent, decide, reset],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}
