import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CircleCheck,
  Clock,
  MessageCircle,
  MailCheck,
  CircleAlert,
  ListChecks,
  Building2,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import { REGISTRATIONS_DEMO, DEFAULT_REGISTRATION } from '../data/demo-registrations'
import { APPROVAL_EMAIL } from '../data/demo'
import { getStatusFor } from '../lib/registrations'
import { useAuth } from '../lib/auth-context'
import { ROLE_LABELS } from '../lib/roles'
import { useSeo } from '../lib/seo'
import ApprovalEmailModal from '../components/ApprovalEmailModal'
import Reveal from '../components/Reveal'
import './UserPanel.css'

const CHECKLIST = [
  { label: 'Connect 4 weeks of mess / operations data', done: false },
  { label: 'Name a pilot coordinator', done: false },
  { label: 'Join the WhatsApp broadcast channel', done: true },
  { label: 'Schedule cold-chain walkthrough (optional)', done: false },
]

const PROFILE_LABELS: Record<string, string> = {
  daily_meals: 'Meals per day',
  kitchen_type: 'Kitchen type',
  beneficiary_count: 'People served',
  beneficiary_type: 'Beneficiary type',
  pickup_capability: 'Pickup capability',
  category: 'Category',
  dispatch_capability: 'Dispatch capability',
  surplus_freq: 'Surplus frequency',
  servings_typical: 'Typical surplus',
  storage: 'Cold storage',
}

export default function UserPanel() {
  const { user, signOut } = useAuth()
  const [showEmail, setShowEmail] = useState(false)

  useSeo({
    title: 'My panel — pilot member',
    description: 'Your FoodLoop AI pilot registration, approval status, WhatsApp channel invite and onboarding checklist.',
    path: '/user',
    index: false,
  })

  const reg = useMemo(() => {
    const base = REGISTRATIONS_DEMO.find((r) => r.id === user?.regId) ?? DEFAULT_REGISTRATION
    const status = getStatusFor(base)
    return { base, status }
  }, [user])

  const step = reg.status.status === 'approved' ? 2 : reg.status.status === 'rejected' ? 0 : 1

  // Full org profile = submitted form data (demo shows it for the signed-in member).
  const profileEntries = Object.entries(reg.base.profile).filter(([, v]) => Boolean(v))

  return (
    <div className="page-pad container">
      <header className="page-head">
        <div>
          <span className="eyebrow">Member panel · {ROLE_LABELS[reg.base.role]}</span>
          <h1>Welcome, {user?.name.split(' ')[0]}</h1>
          <p className="page-sub">
            Registration <strong>{reg.base.id}</strong> — your status, organisation profile,
            WhatsApp channel and next steps in one place.
          </p>
        </div>
        <div className="user-head-actions">
          <Link to="/dashboard" className="btn btn-ghost">
            Live demo
          </Link>
          <button type="button" className="btn btn-ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── Registration status timeline ───────────────────────── */}
      <Reveal className="card user-status-card">
        <div className="user-status-head">
          <h2>Registration status</h2>
          <span className={`admin-status ${reg.status.status}`}>
            {reg.status.status === 'pending'
              ? 'Pending staff review'
              : reg.status.status === 'approved'
                ? 'Approved · invite sent'
                : 'Rejected'}
          </span>
        </div>

        <ol className="user-steps">
          <li className={step >= 1 ? 'done' : ''}>
            {step >= 1 ? <CircleCheck size={18} aria-hidden /> : <Clock size={18} aria-hidden />}
            Registration submitted — {reg.base.created_at}
          </li>
          <li className={step >= 2 ? 'done' : reg.status.status === 'rejected' ? 'failed' : ''}>
            {reg.status.status === 'rejected' ? (
              <CircleAlert size={18} aria-hidden />
            ) : step >= 2 ? (
              <CircleCheck size={18} aria-hidden />
            ) : (
              <Clock size={18} aria-hidden />
            )}
            Staff review {reg.status.status === 'rejected' ? '— rejected' : '— usually within one working day'}
          </li>
          <li className={step >= 2 ? 'done' : ''}>
            {step >= 2 ? <MailCheck size={18} aria-hidden /> : <Clock size={18} aria-hidden />}
            Approval email {reg.base.whatsapp_opt_in ? '+ WhatsApp channel invite' : ''} — sent to {reg.base.email}
          </li>
        </ol>

        {reg.status.status === 'approved' && (
          <div className="user-approved-box">
            <p>
              Approved on <strong>{reg.status.at}</strong> — the invite email went out to{' '}
              <strong>{reg.base.email}</strong>.
            </p>
            <div className="user-approved-actions">
              <button type="button" className="btn btn-primary" onClick={() => setShowEmail(true)}>
                <MailCheck size={16} aria-hidden /> View the email you received
              </button>
              <a className="btn btn-ghost" href={APPROVAL_EMAIL.channel_invite} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} aria-hidden /> Join channel directly
              </a>
            </div>
          </div>
        )}
        {reg.status.status === 'rejected' && (
          <p className="user-rejected-note">
            {reg.base.notes ?? 'Your registration was not approved in this phase.'} Questions? Email{' '}
            <a href="mailto:hello@foodloop.ai">hello@foodloop.ai</a>.
          </p>
        )}
      </Reveal>

      {/* ── Full organisation profile ──────────────────────────── */}
      <Reveal delay={70} className="card user-profile-card">
        <h2>
          <Building2 size={19} aria-hidden /> Organisation profile
        </h2>
        <dl className="user-profile-grid">
          <div>
            <dt>
              <Building2 size={13} aria-hidden /> Organisation
            </dt>
            <dd>
              {reg.base.org} — {ROLE_LABELS[reg.base.role]}
            </dd>
          </div>
          <div>
            <dt>
              <MapPin size={13} aria-hidden /> City
            </dt>
            <dd>{reg.base.city}</dd>
          </div>
          <div>
            <dt>
              <Mail size={13} aria-hidden /> Email
            </dt>
            <dd>{reg.base.email}</dd>
          </div>
          <div>
            <dt>
              <Phone size={13} aria-hidden /> Phone
            </dt>
            <dd>{reg.base.phone}</dd>
          </div>
          {profileEntries.map(([k, v]) => (
            <div key={k}>
              <dt>{PROFILE_LABELS[k] ?? k.replace(/_/g, ' ')}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* ── WhatsApp channel card ──────────────────────────────── */}
      <Reveal delay={130} className="card user-channel-card">
        <span className="user-channel-icon" aria-hidden>
          <MessageCircle size={22} />
        </span>
        <div className="user-channel-body">
          <h2>{APPROVAL_EMAIL.channel_name}</h2>
          <p>
            Surplus alerts, onboarding steps and monthly impact digests —{' '}
            {reg.base.whatsapp_opt_in ? 'you opted in during registration.' : 'you chose email-only updates.'}
          </p>
        </div>
        {reg.status.status === 'approved' ? (
          <button type="button" className="btn btn-primary" onClick={() => setShowEmail(true)}>
            <MailCheck size={15} aria-hidden /> Open invite email
          </button>
        ) : (
          <span className="admin-status pending">Unlocks after approval</span>
        )}
      </Reveal>

      {/* ── Onboarding checklist ───────────────────────────────── */}
      <Reveal delay={190} className="card user-checklist-card">
        <h2>
          <ListChecks size={19} aria-hidden /> Onboarding checklist
        </h2>
        <ul className="user-checklist">
          {CHECKLIST.map((item) => (
            <li key={item.label} className={item.done ? 'done' : ''}>
              {item.done ? <CircleCheck size={17} aria-hidden /> : <span className="user-todo-dot" aria-hidden />}
              {item.label}
              {item.done && <span className="admin-status approved">Done</span>}
            </li>
          ))}
        </ul>
      </Reveal>

      {showEmail && (
        <ApprovalEmailModal name={reg.base.name} email={reg.base.email} refId={reg.base.id} onClose={() => setShowEmail(false)} />
      )}
    </div>
  )
}
