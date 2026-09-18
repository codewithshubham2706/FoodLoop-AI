import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ArrowRight, CircleUserRound, ShieldCheck } from 'lucide-react'
import { useAuth } from '../lib/auth-context'
import './Header.css'

const NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/trace', label: 'QR Trace' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/esg', label: 'ESG' },
]

export default function Header() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  // Close the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/brand/favicon.svg" alt="" width={34} height={34} />
          <span>
            FoodLoop <em>AI</em>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-cta">
          {user ? (
            <div className="auth-chip-wrap">
              <Link
                to={user.role === 'admin' ? '/admin' : '/user'}
                className={`auth-chip${user.role === 'admin' ? ' is-admin' : ''}`}
                title={`Open your ${user.role === 'admin' ? 'admin' : 'user'} panel`}
              >
                {user.role === 'admin' ? <ShieldCheck size={15} aria-hidden /> : <CircleUserRound size={15} aria-hidden />}
                {user.role === 'admin' ? 'Admin' : 'My panel'}
              </Link>
              <button type="button" className="auth-signout" onClick={signOut} aria-label="Sign out" title="Sign out">
                <X size={13} aria-hidden />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-ghost header-btn header-login">
              Sign in
            </Link>
          )}
          <Link to="/#waitlist" className="btn btn-primary header-btn">
            Join the pilot <ArrowRight size={16} />
          </Link>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/user'}
                className={`auth-chip${user.role === 'admin' ? ' is-admin' : ''}`}
                onClick={() => setOpen(false)}
              >
                {user.role === 'admin' ? <ShieldCheck size={15} aria-hidden /> : <CircleUserRound size={15} aria-hidden />}
                {user.role === 'admin' ? 'Admin panel' : 'My panel'}
              </Link>
              <button
                type="button"
                className="auth-chip auth-signout-mobile"
                onClick={() => {
                  signOut()
                  setOpen(false)
                }}
              >
                <X size={15} aria-hidden /> Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="auth-chip" onClick={() => setOpen(false)}>
              <CircleUserRound size={15} aria-hidden /> Sign in
            </Link>
          )}
          <Link to="/#waitlist" className="btn btn-primary" onClick={() => setOpen(false)}>
            Join the pilot <ArrowRight size={16} />
          </Link>
        </nav>
      )}
    </header>
  )
}
