import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../lib/env'
import { useConsent } from '../lib/consent-context'
import './Footer.css'

export default function Footer() {
  const { reset } = useConsent()

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/brand/favicon.svg" alt="" width={30} height={30} />
            <span>
              FoodLoop <em>AI</em>
            </span>
          </div>
          <p>
            Predict demand, prevent waste, redistribute surplus, measure impact — a closed loop
            from kitchen to community.
          </p>
          <a className="footer-mail" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav aria-label="Platform">
          <h3>Platform</h3>
          <Link to="/dashboard">Live dashboard</Link>
          <Link to="/trace">QR food trace</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/esg">ESG dashboard</Link>
        </nav>

        <nav aria-label="Legal">
          <h3>Legal</h3>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms &amp; conditions</Link>
          <button type="button" className="cookie-settings" onClick={reset}>
            Cookie settings
          </button>
        </nav>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} FoodLoop AI. Demo data only — no real personal data is collected.</p>
      </div>
    </footer>
  )
}
