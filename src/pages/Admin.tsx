import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, MessageCircle, MailCheck, Clock, Check, X, Ban } from 'lucide-react'
import { WAITLIST_DEMO, APPROVAL_EMAIL, type WaitlistEntry, type WaitlistStatus } from '../data/demo'
import { setStatusOverride } from '../lib/waitlist-store'
import { useAuth } from '../lib/auth-context'
import { useSeo } from '../lib/seo'
import ApprovalEmailModal from '../components/ApprovalEmailModal'
import './Admin.css'

const STATUS_META: Record<WaitlistStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending review', cls: 'pending' },
  approved: { label: 'Approved · email sent', cls: 'approved' },
  rejected: { label: 'Rejected', cls: 'rejected' },
}

function roleLabel(role: string): string {
  if (role === 'kitchen') return 'Institutional kitchen / mess'
  if (role === 'ngo') return 'NGO / community kitchen'
  if (role === 'logistics') return 'Cold-chain / logistics partner'
  if (role === 'govt') return 'Government / municipal body'
  return role || 'Other'
}

export default function Admin() {
  const { user, signOut } = useAuth()
  useSeo({
    title: 'Registration Approvals — WhatsApp Channel Onboarding',
    description: 'Review pilot registrations; approving sends one email containing the WhatsApp broadcast channel invite.',
    path: '/admin',
    index: false,
  })

  const [entries, setEntries] = useState<WaitlistEntry[]>(WAITLIST_DEMO)
  const [filter, setFilter] = useState<WaitlistStatus | 'all'>('pending')
  const [preview, setPreview] = useState<WaitlistEntry | null>(null)

  const counts = useMemo(
    () => ({
      pending: entries.filter((e) => e.status === 'pending').length,
      approved: entries.filter((e) => e.status === 'approved').length,
      rejected: entries.filter((e) => e.status === 'rejected').length,
      optIns: entries.filter((e) => e.whatsapp_opt_in).length,
    }),
    [entries],
  )

  const visible = filter === 'all' ? entries : entries.filter((e) => e.status === filter)

  function decide(id: string, status: Exclude<WaitlistStatus, 'pending'>) {
    setStatusOverride(id, status) // visible to the user panel in this session
    setEntries((list) =>
      list.map((e) => (e.id === id ? { ...e, status, approved_at: status === 'approved' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : undefined } : e)),
    )
  }

  return (
    <div className="page-pad container">
      <header className="page-head">
        <div>
          <span className="eyebrow">Admin panel · {user?.name}</span>
          <h1>Registration approvals</h1>
          <p className="page-sub">
            Approving a registration sends <strong>one email</strong> to the applicant containing the{' '}
            <strong>WhatsApp broadcast channel invite</strong> — channel updates then cover surplus
            alerts, pilot news and impact digests.
          </p>
        </div>
        <div className="admin-head-actions">
          <Link className="btn btn-ghost" to="/user">
            View user panel
          </Link>
          <button type="button" className="btn btn-ghost" onClick={signOut}>
            <X size={15} aria-hidden /> Sign out
          </button>
        </div>
      </header>

      <div className="admin-kpis">
        <div className="card kpi">
          <p className="kpi-value">{counts.pending}</p>
          <p className="kpi-label">Pending review</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{counts.approved}</p>
          <p className="kpi-label">Approved</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{counts.optIns}</p>
          <p className="kpi-label">WhatsApp opt-ins</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{APPROVAL_EMAIL.channel_invite.split('/').pop()}</p>
          <p className="kpi-label">Channel code</p>
        </div>
      </div>

      <div className="card admin-panel">
        <div className="admin-toolbar" role="group" aria-label="Filter registrations by status">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <button
              key={f}
              className={`admin-tab${filter === f ? ' is-active' : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f === 'pending' && <Clock size={14} aria-hidden />}
              {f === 'approved' && <MailCheck size={14} aria-hidden />}
              {f === 'rejected' && <Ban size={14} aria-hidden />}
              {f === 'all' && <Inbox size={14} aria-hidden />}
              {f[0]?.toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <ul className="admin-list">
          {visible.length === 0 && <li className="admin-empty">Nothing here — try another filter.</li>}
          {visible.map((e) => (
            <li key={e.id} className="admin-row">
              <div className="admin-row-main">
                <span className="admin-id">{e.id}</span>
                <div>
                  <p className="admin-name">
                    {e.name} <span className="admin-org">· {e.org}</span>
                  </p>
                  <p className="admin-meta">
                    {e.email} · {roleLabel(e.role)}
                    {e.whatsapp_opt_in && (
                      <span className="admin-wa">
                        {' '}
                        · <MessageCircle size={12} aria-hidden style={{ verticalAlign: '-2px' }} /> WhatsApp
                        opt-in{e.whatsapp_phone ? ` (${e.whatsapp_phone})` : ''}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="admin-row-actions">
                <span className={`admin-status ${STATUS_META[e.status].cls}`}>
                  {STATUS_META[e.status].label}
                </span>
                {e.status === 'pending' ? (
                  <>
                    <button className="btn btn-primary admin-act" onClick={() => decide(e.id, 'approved')}>
                      <Check size={15} aria-hidden /> Approve &amp; send email
                    </button>
                    <button className="btn btn-ghost admin-act" onClick={() => decide(e.id, 'rejected')}>
                      <X size={15} aria-hidden /> Reject
                    </button>
                  </>
                ) : (
                  <button className="btn btn-ghost admin-act" onClick={() => setPreview(e)}>
                    <MailCheck size={15} aria-hidden /> View email sent
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {preview && (
        <ApprovalEmailModal name={preview.name} email={preview.email} refId={preview.id} onClose={() => setPreview(null)} />
      )}
    </div>
  )
}
