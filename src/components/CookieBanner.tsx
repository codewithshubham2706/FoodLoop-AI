import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'
import { useConsent } from '../lib/consent-context'
import './CookieBanner.css'

export default function CookieBanner() {
  const { isPending, decide } = useConsent()

  if (!isPending) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="cookie-icon" aria-hidden>
        <Cookie size={20} />
      </div>
      <div className="cookie-copy">
        <p>
          We use essential cookies to run this site. Analytics cookies (Google Analytics, with IP
          anonymization) help us improve it — they load <strong>only if you accept</strong>. Details
          in our <Link to="/privacy">privacy policy</Link>.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="btn btn-ghost cookie-decline" onClick={() => decide({ analytics: false })}>
          Essential only
        </button>
        <button type="button" className="btn btn-primary" onClick={() => decide({ analytics: true })}>
          Accept all
        </button>
      </div>
    </div>
  )
}
