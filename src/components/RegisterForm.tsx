import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Send, Loader2, CircleCheck, CircleAlert, MessageCircle } from 'lucide-react'
import { ROLE_LABELS, MEMBER_ROLES, type MemberRole } from '../lib/roles'
import './RegisterForm.css'

type Status = 'idle' | 'submitting' | 'success'

interface Errors {
  [key: string]: string | undefined
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[0-9][\d\s-]{7,14}$/
const MIN_SUBMIT_MS = 2500

/** Role-specific detail questions (mirrors the backend `registrations.profile` JSONB). */
const DETAIL_FIELDS: Record<MemberRole, Array<{ name: string; label: string; placeholder: string }>> = {
  mess: [
    { name: 'daily_meals', label: 'Meals served per day', placeholder: 'e.g. 850–1,100 across 3 services' },
    { name: 'kitchen_type', label: 'Kitchen type', placeholder: 'e.g. college campus mess (self-operated)' },
  ],
  ngo: [
    { name: 'beneficiary_count', label: 'People served per day', placeholder: 'e.g. ~420 meals across 6 shelters' },
    { name: 'pickup_capability', label: 'Pickup capability', placeholder: 'e.g. 2 vans, cold boxes for 150 meals' },
  ],
  vendor: [
    { name: 'category', label: 'What do you supply or operate?', placeholder: 'e.g. cold-chain transport (reefer vans)' },
    { name: 'dispatch_capability', label: 'Dispatch capability', placeholder: 'e.g. on-call, 2-hour dispatch SLA' },
  ],
}

export default function RegisterForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [role, setRole] = useState<MemberRole>('mess')
  const [waOptIn, setWaOptIn] = useState(false)
  const [serverMsg, setServerMsg] = useState('')
  const mountedAt = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const details = DETAIL_FIELDS[role]

  function validate(data: FormData): Errors {
    const errs: Errors = {}
    const get = (k: string) => String(data.get(k) ?? '').trim()

    if (get('name').length < 2) errs.name = 'Enter the contact person name (min 2 characters).'
    if (!EMAIL_RE.test(get('email'))) errs.email = 'Enter a valid email — the approval letter goes here.'
    if (!PHONE_RE.test(get('phone'))) errs.phone = 'Enter a valid phone number (7–15 digits).'
    if (get('org').length < 2) errs.org = 'Enter your organisation name.'
    if (get('city').length < 2) errs.city = 'Enter your city.'
    if (!get('role')) errs.role = 'Choose what best describes your organisation.'

    for (const f of DETAIL_FIELDS[(get('role') as MemberRole) ?? 'mess'] ?? []) {
      if (get(f.name).length < 2) errs[f.name] = 'This helps staff review your registration — please fill it in.'
    }
    if (!data.get('consent')) errs.consent = 'Please accept the Terms & Privacy Policy to continue.'
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
      const first = Object.keys(errs)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    // ── Anti-spam: honeypot + time-trap ─────────────────────────────
    if (String(data.get('company_website') ?? '') !== '') {
      setStatus('success') // silently discard bot submissions
      return
    }
    if (Date.now() - mountedAt.current < MIN_SUBMIT_MS) {
      setServerMsg('That was quick! Please take a moment and try again.')
      setStatus('idle')
      return
    }

    setStatus('submitting')
    try {
      // Demo build: no backend yet. Production contract:
      //   POST /v1/registrations  (docs/05-backend-schema.md §3.6)
      await new Promise((r) => setTimeout(r, 800))
      setStatus('success')
    } catch {
      setServerMsg('Something went wrong. Please try again or email us directly.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="reg-success" role="status">
        <CircleCheck size={30} aria-hidden />
        <h3>Registration submitted</h3>
        <p>
          FoodLoop staff review new registrations within one working day. Once approved, a single
          email arrives at your address with your WhatsApp broadcast channel invite — that channel
          then carries surplus alerts, onboarding steps and monthly impact digests.
        </p>
        <p className="reg-success-hint">
          Track progress anytime: <strong>Sign in → My panel</strong> shows your live status timeline.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setStatus('idle')
            setRole('mess')
            setWaOptIn(false)
            setErrors({})
          }}
        >
          Submit another registration
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="reg-form" onSubmit={handleSubmit} noValidate>
      {serverMsg && (
        <p className="reg-server-msg" role="alert">
          <CircleAlert size={15} aria-hidden /> {serverMsg}
        </p>
      )}

      {/* ── 1. Contact person ─────────────────────────────────── */}
      <fieldset>
        <legend>
          <span className="reg-step-num" aria-hidden>
            1
          </span>{' '}
          Contact person
        </legend>
        <div className="reg-grid">
          <div className="field">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              name="name"
              autoComplete="name"
              placeholder="Aarav Sharma"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'reg-name-err' : undefined}
            />
            {errors.name && (
              <p className="reg-field-error" id="reg-name-err" role="alert">
                <CircleAlert size={13} aria-hidden /> {errors.name}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="reg-email">Work email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="aarav@campus.edu"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'reg-email-err' : undefined}
            />
            {errors.email && (
              <p className="reg-field-error" id="reg-email-err" role="alert">
                <CircleAlert size={13} aria-hidden /> {errors.email}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="reg-phone">Phone</label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'reg-phone-err' : undefined}
            />
            {errors.phone && (
              <p className="reg-field-error" id="reg-phone-err" role="alert">
                <CircleAlert size={13} aria-hidden /> {errors.phone}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── 2. Organisation ───────────────────────────────────── */}
      <fieldset>
        <legend>
          <span className="reg-step-num" aria-hidden>
            2
          </span>{' '}
          Organisation
        </legend>
        <div className="reg-grid">
          <div className="field">
            <label htmlFor="reg-org">Organisation name</label>
            <input
              id="reg-org"
              name="org"
              autoComplete="organization"
              placeholder="Campus Mess 02"
              aria-invalid={errors.org ? true : undefined}
              aria-describedby={errors.org ? 'reg-org-err' : undefined}
            />
            {errors.org && (
              <p className="reg-field-error" id="reg-org-err" role="alert">
                <CircleAlert size={13} aria-hidden /> {errors.org}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="reg-city">City</label>
            <input
              id="reg-city"
              name="city"
              autoComplete="address-level2"
              placeholder="New Delhi"
              aria-invalid={errors.city ? true : undefined}
              aria-describedby={errors.city ? 'reg-city-err' : undefined}
            />
            {errors.city && (
              <p className="reg-field-error" id="reg-city-err" role="alert">
                <CircleAlert size={13} aria-hidden /> {errors.city}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="reg-role">Organisation type</label>
            <select
              id="reg-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              aria-invalid={errors.role ? true : undefined}
              aria-describedby={errors.role ? 'reg-role-err' : undefined}
            >
              {MEMBER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="reg-field-error" id="reg-role-err" role="alert">
                <CircleAlert size={13} aria-hidden /> {errors.role}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── 3. Operational details (role-specific) ────────────── */}
      <fieldset>
        <legend>
          <span className="reg-step-num" aria-hidden>
            3
          </span>{' '}
          Operational details
        </legend>
        <div className="reg-grid">
          {details.map((f) => (
            <div className="field" key={f.name}>
              <label htmlFor={`reg-${f.name}`}>{f.label}</label>
              <input
                id={`reg-${f.name}`}
                name={f.name}
                placeholder={f.placeholder}
                aria-invalid={errors[f.name] ? true : undefined}
                aria-describedby={errors[f.name] ? `reg-${f.name}-err` : undefined}
              />
              {errors[f.name] && (
                <p className="reg-field-error" id={`reg-${f.name}-err`} role="alert">
                  <CircleAlert size={13} aria-hidden /> {errors[f.name]}
                </p>
              )}
            </div>
          ))}
        </div>
      </fieldset>

      {/* ── 4. Consent + WhatsApp opt-in ──────────────────────── */}
      <fieldset>
        <legend>
          <span className="reg-step-num" aria-hidden>
            4
          </span>{' '}
          Consent
        </legend>

        {/* Honeypot — hidden from humans & screen readers, filled only by bots */}
        <div className="reg-hp" aria-hidden="true">
          <label htmlFor="reg-hp">Company website</label>
          <input id="reg-hp" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="reg-wa-optin">
          <input
            type="checkbox"
            name="whatsapp_opt_in"
            checked={waOptIn}
            onChange={(e) => setWaOptIn(e.target.checked)}
          />
          <span className="reg-reg-wa-optin-box" aria-hidden>
            <MessageCircle size={16} strokeWidth={2.4} />
          </span>
          <span className="reg-reg-wa-optin-text">
            <strong>Send me the WhatsApp broadcast channel invite</strong> once my registration is
            approved. The channel carries surplus alerts, onboarding steps and monthly impact
            digests — leave anytime, or leave this unchecked and we&rsquo;ll use email only.
          </span>
        </label>

        <label className="reg-consent">
          <input type="checkbox" name="consent" />
          <span>
            I agree to the <Link to="/terms">Terms &amp; Conditions</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>, and confirm the information above is accurate.
          </span>
        </label>
        {errors.consent && (
          <p className="reg-field-error" role="alert">
            <CircleAlert size={13} aria-hidden /> {errors.consent}
          </p>
        )}
      </fieldset>

      <button type="submit" className="btn btn-primary reg-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? <Loader2 className="spin" size={18} aria-hidden /> : <Send size={18} aria-hidden />}
        {status === 'submitting' ? 'Submitting…' : 'Submit registration'}
      </button>
      <p className="reg-pipeline-note">
        Pipeline: <strong>submit → staff review → approval email + WhatsApp invite</strong>. Track
        status anytime under <strong>Sign in → My panel</strong>.
      </p>
    </form>
  )
}
