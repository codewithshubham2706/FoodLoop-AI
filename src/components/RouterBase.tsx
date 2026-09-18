import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { BASE_PATH } from '../lib/env'

/**
 * Single router for the whole app. On GitHub Pages the app lives under
 * /FoodLoop-AI — that becomes the router's basename; local dev keeps the
 * default '/'. Must wrap the app exactly once (App renders routes only).
 */
export default function RouterBase({ children }: { children: ReactNode }) {
  return <BrowserRouter basename={BASE_PATH || undefined}>{children}</BrowserRouter>
}
