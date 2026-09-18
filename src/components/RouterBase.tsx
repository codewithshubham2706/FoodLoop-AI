import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { BASE_PATH } from '../lib/env'

/**
 * On GitHub Pages the app lives under /FoodLoop-AI — give the router its
 * basename here. App's own <BrowserRouter> is skipped when BASE_PATH is set,
 * so local dev keeps base '' and behavior is unchanged.
 */
export default function RouterBase({ children }: { children: ReactNode }) {
  return BASE_PATH ? <BrowserRouter basename={BASE_PATH}>{children}</BrowserRouter> : <>{children}</>
}
