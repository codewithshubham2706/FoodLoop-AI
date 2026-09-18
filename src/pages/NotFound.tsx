import { Link } from 'react-router-dom'
import { ArrowRight, UtensilsCrossed } from 'lucide-react'
import { useSeo } from '../lib/seo'
import './NotFound.css'

export default function NotFound() {
  useSeo({
    title: '404 — Page not found',
    description: 'That plate is empty. Head back to FoodLoop AI.',
    path: '/404',
    index: false,
  })

  return (
    <div className="nf container">
      <div className="nf-plate" aria-hidden>
        <UtensilsCrossed size={44} strokeWidth={1.6} />
      </div>
      <p className="nf-code">404</p>
      <h1>This plate is empty</h1>
      <p className="nf-sub">
        The page you&rsquo;re looking for was served to someone else. Let&rsquo;s get you back to
        closing the food loop.
      </p>
      <div className="nf-links">
        <Link to="/" className="btn btn-primary">
          Back home <ArrowRight size={16} aria-hidden />
        </Link>
        <Link to="/dashboard" className="btn btn-ghost">
          Open the dashboard
        </Link>
      </div>
    </div>
  )
}
