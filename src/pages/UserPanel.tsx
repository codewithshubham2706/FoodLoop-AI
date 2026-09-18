import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CircleCheck,
  Clock,
  MessageCircle,
  MailCheck,
  CircleAlert,
  ListChecks,
} from 'lucide-react'
import { WAITLIST_DEMO, DEFAULT_WAITLIST_ENTRY, APPROVAL_EMAIL } from '../data/demo'
import { getStatusOverrides } from '../lib/waitlist-store'
import { useAuth } from '../lib/auth-context'
import { useSeo } from '../lib/seo'
import ApprovalEmailModal from '../components/ApprovalEmailModal'
import Reveal from '../components/Reveal'
import './UserPanel.css'

const CHECKLIST = [
  { label: 'Connect 4 weeks of mess/POS data', done: false },
  { label: 'Name a pilot coordinator', done: false },
  { label: 'Join the WhatsApp broadcast channel', done: true },
  { label: 'Schedule cold-chain sensor walkthrough (optional)', done: false },
]

export default function UserPanel() {
  const { user } = useAuth()
  const [showEmail, setShowEmail] = useState(false)

  useSeo({
    title: 'My pilot — member panel',
    description: 'Your FoodLoop AI pilot registration status, WhatsApp channel invite and onboarding checklist.',
    path: '/user',
    index: false,
  })

  const reg = useMemo(() => {
    const base = WAITLIST_DEMO.find((e) => e.id === user?.waitlistId) ?? DEFAULT_WAITLIST_ENTRY
    const override = getStatusOverrides()[base.id]
    if (override && base.status === 'pending') {
      return { ...base, status: override, approved_at: new Date().toISOString().slice(0, 16).replace('T', ' ') }
    }
    return base
  }, [user])

  const steps =
    reg.status === 'approved'
      ? 2
      : reg.status === 'rejected'
        ? 0
        : 1

  return (
    <div className="page-pad container">
      <header className="page-head">
        <div>
          <span className="eyebrow">User panel · {user?.org}</span>
          <h1>Welcome, {user?.name.split(' ')[0]}</h1>
          <p className="page-sub">
            Your pilot registration <strong>{reg.id}</strong> — status, WhatsApp channel and next
            steps in one place.
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-ghost">
          Open live demo
        </Link>
      </header>

      {/* Registration status timeline */}
      <Reveal className="card user-status-card">
        <div className="user-status-head">
          <h2>Registration status</h2>
          <span className={`admin-status ${reg.status}`}>
            {reg.status === 'pending' ? 'Pending review' : reg.status === 'approved' ? 'Approved · invite sent' : 'Rejected'}
          </span>
        </div>
        <ol className="user-steps" aria-label="Registration progress">
          <li className={steps >= 1 ? 'done' : ''}>
            <CircleCheck size={18} aria-hidden /> Registration submitted
          </li>
          <li className={steps >= 2 ? 'done' : reg.status === 'rejected' ? 'failed' : ''}>
            {reg.status === 'rejected' ? <CircleAlert size={18} aria-hidden /> : steps >= 2 ? <CircleCheck size={18} aria-hidden /> : <Clock size={18} aria-hidden />}
            {reg.status === 'rejected' ? 'Rejected by admin' : 'Admin review'}
          </li>
          <li className={steps >= 2 ? 'done' : ''}>
            {steps >= 2 ? <MailCheck size={18} aria-hidden /> : <Clock size={18} aria-hidden />}
            Approval email + WhatsApp invite
          </li>
        </ol>

        {reg.status === 'approved' && (
          <div className="user-approved-box">
            <p>
              Approved {reg.approved_at ? `on ${reg.approved_at}` : ''} — your invite email went out
              to <strong>{reg.email}</strong>.
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
        {reg.status === 'pending' && (
          <p className="user-wait-note">
            An admin reviews new registrations before the WhatsApp invite email goes out. You&rsquo;ll
            hear back within one working day.
          </p>
        )}
      </Reveal>

      {/* WhatsApp channel card */}
      <Reveal delay={80} className="card user-channel-card">
        <span className="user-channel-icon" aria-hidden>
          <MessageCircle size={22} />
        </span>
        <div className="user-channel-body">
          <h2>{APPROVAL_EMAIL.channel_name}</h2>
          <p>
            Surplus alerts, pilot onboarding and monthly impact digests — one broadcast channel,
            {reg.whatsapp_opt_in ? ' you opted in during registration.' : ' you did not opt in during registration.'}
          </p>
        </div>
        {reg.status === 'approved' ? (
          <button type="button" className="btn btn-primary" onClick={() => setShowEmail(true)}>
            <MailCheck size={15} aria-hidden /> Open invite email
          </button>
        ) : (
          <span className="admin-status pending">Unlocks after approval</span>
        )}
      </Reveal>

      {/* Onboarding checklist */}
      <Reveal delay={140} className="card user-checklist-card">
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
        <ApprovalEmailModal name={reg.name} email={reg.email} refId={reg.id} onClose={() => setShowEmail(false)} />
      )}
    </div>
  )
}
