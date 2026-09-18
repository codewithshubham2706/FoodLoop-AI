import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Loader2, ChefHat, HeartHandshake, Store, ShieldCheck } from 'lucide-react'
import { DEMO_ACCOUNTS, useAuth } from '../lib/auth-context'
import type { SessionUser } from '../lib/auth-context'
import { MEMBER_PANEL, STAFF_CONSOLE, isStaffRole, type Role } from '../lib/roles'
import { useSeo } from '../lib/seo'
import Reveal from '../components/Reveal'
import './Login.css'

/** Google's four-colour "G" mark. */
function GLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

const ROLE_ICON: Record<Role, typeof ChefHat> = {
  staff: ShieldCheck,
  mess: ChefHat,
  ngo: HeartHandshake,
  vendor: Store,
}

const HINTS: Record<Role, string> = {
  staff: 'FoodLoop operator — staff console',
  mess: 'Institutional mess — member panel',
  ngo: 'NGO partner — member panel',
  vendor: 'Vendor / caterer — member panel',
}

const ACCOUNTS: SessionUser[] = [DEMO_ACCOUNTS.mess, DEMO_ACCOUNTS.ngo, DEMO_ACCOUNTS.vendor, DEMO_ACCOUNTS.staff]
const ACCOUNT_BY_EMAIL = new Map(ACCOUNTS.map((a) => [a.email.toLowerCase(), a]))

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [step, setStep] = useState<'choose' | 'password'>('choose')
  const [selected, setSelected] = useState<SessionUser | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)

  useSeo({
    title: 'Sign in',
    description: 'Sign in to FoodLoop AI — member panel for messes and NGOs, staff console for FoodLoop operators.',
    path: '/login',
    index: false,
  })

  useEffect(() => {
    if (step === 'password') pwRef.current?.focus()
  }, [step])

  function panelFor(account: SessionUser): string {
    return from ?? (isStaffRole(account.role) ? STAFF_CONSOLE : MEMBER_PANEL)
  }

  function finish(account: SessionUser) {
    setBusy(true)
    // Simulated network latency, like a real OAuth round-trip.
    window.setTimeout(() => {
      signIn(account.role)
      navigate(panelFor(account), { replace: true })
    }, 650)
  }

  function choose(account: SessionUser) {
    setSelected(account)
    setError('')
    setStep('password')
  }

  function useAnother() {
    setSelected(null)
    setEmail('')
    setPassword('')
    setError('')
    setStep('password')
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return

    let account = selected
    if (!account) {
      const match = ACCOUNT_BY_EMAIL.get(email.trim().toLowerCase())
      if (!match) {
        setError("Couldn't find that account. Use one of the demo accounts listed.")
        emailRef.current?.focus()
        return
      }
      account = match
      setSelected(match)
    }

    if (password.trim().length < 4) {
      setError('Enter a password with at least 4 characters (any password works in this demo).')
      pwRef.current?.focus()
      return
    }
    setError('')
    finish(account)
  }

  // Already signed in? Offer a quick hop to the matching console.
  const signedInPanel = user ? (isStaffRole(user.role) ? STAFF_CONSOLE : MEMBER_PANEL) : null

  return (
    <div className="g-page">
      <Reveal className="g-card">
        <GLogo />
        <h1 className="g-title">
          {step === 'choose' ? 'Choose an account' : selected ? 'Welcome' : 'Sign in'}
        </h1>
        <p className="g-sub">
          {step === 'choose' ? (
            <>
              to continue to <strong>FoodLoop AI</strong>
            </>
          ) : selected ? (
            <>
              {selected.name} · {selected.org}
            </>
          ) : (
            <>
              with your account to continue to <strong>FoodLoop AI</strong>
            </>
          )}
        </p>

        {signedInPanel && (
          <p className="g-signedin" role="status">
            Signed in as <strong>{user?.name}</strong>. <Link to={signedInPanel}>Open your panel →</Link>
          </p>
        )}

        {step === 'choose' && (
          <div className="g-accounts">
            {ACCOUNTS.map((a) => {
              const Icon = ROLE_ICON[a.role]
              return (
                <button key={a.email} type="button" className="g-account" onClick={() => choose(a)}>
                  <span className={`g-avatar${isStaffRole(a.role) ? ' is-admin' : ''}`} aria-hidden>
                    {isStaffRole(a.role) ? <Icon size={19} /> : initial(a.name)}
                  </span>
                  <span className="g-account-body">
                    <strong>{a.name}</strong>
                    <small>{a.email}</small>
                    <em>{HINTS[a.role]}</em>
                  </span>
                </button>
              )
            })}
            <button type="button" className="g-account" onClick={useAnother}>
              <span className="g-avatar g-avatar-empty" aria-hidden>
                +
              </span>
              <span className="g-account-body">
                <strong>Use another account</strong>
                <small>Type an email and password manually</small>
              </span>
            </button>
          </div>
        )}

        {step === 'password' && (
          <form className="g-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <p className="g-error" role="alert">
                {error}
              </p>
            )}

            {!selected && (
              <div className={`g-field${email ? ' is-filled' : ''}`}>
                <input
                  ref={emailRef}
                  id="g-email"
                  type="email"
                  autoComplete="username"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="g-email">Email</label>
              </div>
            )}

            <div className="g-field g-field-pw">
              <input
                ref={pwRef}
                id="g-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="g-password">Enter your password</label>
              <button
                type="button"
                className="g-pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={17} aria-hidden /> : <Eye size={17} aria-hidden />}
              </button>
            </div>
            <p className="g-hint">Demo build — any password with 4+ characters works.</p>

            <div className="g-actions">
              <button type="button" className="g-btn-text" onClick={() => setStep('choose')}>
                <ArrowLeft size={15} aria-hidden /> Back
              </button>
              <button type="submit" className="g-btn-next" disabled={busy}>
                {busy ? <Loader2 className="g-spin" size={17} aria-hidden /> : 'Sign in'}
              </button>
            </div>
          </form>
        )}

        <div className="g-register-cta">
          <p>
            New mess, NGO or vendor? <Link to="/register">Register your organisation</Link> — staff
            review it, then your approval email with the WhatsApp invite arrives.
          </p>
        </div>
      </Reveal>

      <footer className="g-footer">
        <span>English (India)</span>
        <nav aria-label="Sign-in help">
          <a href="#help" onClick={(e) => e.preventDefault()}>
            Help
          </a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </footer>
      <p className="g-demo-note">Demo — Google-style sign-in for the FoodLoop AI prototype; not a real Google service.</p>
    </div>
  )
}
