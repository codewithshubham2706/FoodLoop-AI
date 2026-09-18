import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import { useConsent } from '../lib/consent-context'
import { setAnalyticsConsent, trackPageView } from '../lib/analytics'
import { GA4_MEASUREMENT_ID } from '../lib/env'

export default function Layout() {
  const { pathname } = useLocation()
  const { analytics } = useConsent()

  // Scroll to top on route change (respecting #hash anchors).
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 })
  }, [pathname])

  // Load/unload analytics strictly according to consent.
  useEffect(() => {
    setAnalyticsConsent(analytics, GA4_MEASUREMENT_ID)
  }, [analytics])

  // Page-view tracking — only when consent is granted.
  useEffect(() => {
    if (analytics) {
      trackPageView(pathname, document.title)
    }
  }, [pathname, analytics])

  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
