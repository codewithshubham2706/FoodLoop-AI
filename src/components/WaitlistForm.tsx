import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Send, Loader2, CircleCheck, CircleAlert, MessageCircle } from 'lucide-react'
import './WaitlistForm.css'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FieldErrors {
  name?: string
  email?: string
  org?: string
  role?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MIN_SUBMIT_MS = 2500 // humans need time; bots don't

export default function WaitlistForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverMsg, setServerMsg] = useState('')
  const [waOptIn, setWaOptIn] = useState(false)
  const mountedAt = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)

  // Time-trap baseline: set after mount (keeps render pure).
  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  // Honeypot field name chosen to be invisible & uninteresting to humans.
  const honeypot = useRef<HTMLInputElement>(null)

  const orgPlaceholder = useMemo(() => 'Campus mess, NGO, cold-storage…', [])

  function validate(data: FormData): FieldErrors {
    const errs: FieldErrors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const org = String(data.get('org') ?? '').trim()
    const role = String(data.get('role') ?? '')

    if (name.length < 2) errs.name = 'Please enter your name (min 2 characters).'
    if (!EMAIL_RE.test(email)) errs.email = 'Please enter a valid email address.'
    if (org.length < 2) errs.org = 'Tell us about your organization (min 2 characters).'
    if (!role) errs.role = 'Please choose what best describes you.'
    return errs
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    const form = e.currentTarget
    const data = new FormData(form)
    const errs = validate(data)
    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      setServerMsg('')
      // Move focus to first invalid field for keyboard & screen-reader users.
      const first = Object.keys(errs)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    // ── Anti-spam: honeypot + time-trap ────────────────────────────
    if (String(data.get('company_website') ?? '') !== '') {
      setStatus('success') // silently discard bot submission
      return
    }
    if (Date.now() - mountedAt.current < MIN_SUBMIT_MS) {
      setServerMsg('That was quick! Please take a moment and try again.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    try {
      // Demo build: no backend is wired yet. The real endpoint (POST /api/waitlist)
      // is specified in docs/05-backend-schema.md; swap this stub when it exists.
      await new Promise((r) => setTimeout(r, 700))
      setStatus('success')
      formRef.current?.reset()
    } catch {
      setServerMsg('Something went wrong. Please try again or email us directly.')
      setStatus('error')
    }
  }

  return (
    <form ref={formRef} className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <div className="field-row">
        <div className="field">
          <label htmlFor="wl-name">Full name</label>
          <input
            id="wl-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Aarav Sharma"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'wl-name-err' : undefined}
          />
          {errors.name && (
            <p className="field-error" id="wl-name-err" role="alert">
              <CircleAlert size={14} aria-hidden /> {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="wl-email">Work email</label>
          <input
            id="wl-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="aarav@campus.edu"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'wl-email-err' : undefined}
          />
          {errors.email && (
            <p className="field-error" id="wl-email-err" role="alert">
              <CircleAlert size={14} aria-hidden /> {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="wl-org">Organization</label>
          <input
            id="wl-org"
            name="org"
            type="text"
            autoComplete="organization"
            placeholder={orgPlaceholder}
            aria-invalid={errors.org ? true : undefined}
            aria-describedby={errors.org ? 'wl-org-err' : undefined}
          />
          {errors.org && (
            <p className="field-error" id="wl-org-err" role="alert">
              <CircleAlert size={14} aria-hidden /> {errors.org}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="wl-role">I am a…</label>
          <select
            id="wl-role"
            name="role"
            defaultValue=""
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={errors.role ? 'wl-role-err' : undefined}
          >
            <option value="" disabled>
              Choose one
            </option>
            <option value="kitchen">Institutional kitchen / mess</option>
            <option value="ngo">NGO / community kitchen</option>
            <option value="logistics">Cold-chain / logistics partner</option>
            <option value="govt">Government / municipal body</option>
            <option value="other">Other</option>
          </select>
          {errors.role && (
            <p className="field-error" id="wl-role-err" role="alert">
              <CircleAlert size={14} aria-hidden /> {errors.role}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot — visually hidden, ignored by screen readers, filled only by bots */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="wl-hp">Company website</label>
        <input ref={honeypot} id="wl-hp" name="company_website" type="text" tabIndex={-1} autoComplete="number" />
      </div>

      {/* WhatsApp broadcast opt-in — OFF by default; after admin approval the
          member receives ONE email containing the WhatsApp channel invite. */}
      <label className="wa-optin">
        <input
          type="checkbox"
          name="whatsapp_opt_in"
          checked={waOptIn}
          onChange={(e) => setWaOptIn(e.target.checked)}
        />
        <span className="wa-optin-box" aria-hidden>
          <MessageCircle size={16} strokeWidth={2.4} />
        </span>
        <span className="wa-optin-text">
          <strong>Send me the WhatsApp broadcast channel invite</strong> once I&rsquo;m approved.
          The channel carries surplus alerts, pilot updates and monthly impact digests. You can
          unsubscribe from the channel anytime — or leave this unchecked and we&rsquo;ll only use
          email. Demo only — no message is sent and nothing is stored.
        </span>
      </label>

      <button type="submit" className="btn btn-primary wl-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? <Loader2 className="spin" size={18} aria-hidden /> : <Send size={18} aria-hidden />}
        {status === 'submitting' ? 'Joining…' : 'Request pilot access'}
      </button>

      {status === 'success' && (
        <p className="wl-feedback success" role="status">
          <CircleCheck size={16} aria-hidden />{' '}
          {waOptIn
            ? "You're on the list! Once approved, one email arrives with your WhatsApp channel invite."
            : "You're on the list! We'll reach out with pilot details by email."}
        </p>
      )}
      {status === 'error' && serverMsg && (
        <p className="wl-feedback error" role="alert">
          <CircleAlert size={16} aria-hidden /> {serverMsg}
        </p>
      )}
    </form>
  )
}
