import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  X,
  Eye,
  ChevronDown,
  ClipboardList,
  Clock,
  MessageCircle,
} from 'lucide-react'
import { REGISTRATIONS_DEMO } from '../data/demo-registrations'
import {
  getStatusFor,
  setStatusOverride,
  type Registration,
  type RegStatus,
} from '../lib/registrations'
import { ROLE_SHORT, ROLE_LABELS, MEMBER_PANEL } from '../lib/roles'
import { useAuth } from '../lib/auth-context'
import { useSeo } from '../lib/seo'
import ApprovalEmailModal from '../components/ApprovalEmailModal'
import Reveal from '../components/Reveal'
import './Admin.css'

const STATUS_META: Record<RegStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'pending' },
  approved: { label: 'Approved', cls: 'approved' },
  rejected: { label: 'Rejected', cls: 'rejected' },
}

type Filter = RegStatus | 'all'

export default function StaffConsole() {
  const { user, signOut } = useAuth()
  const [filter, setFilter] = useState<Filter>('pending')
  const [preview, setPreview] = useState<Registration | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [bump, setBump] = useState(0)

  useSeo({
    title: 'Staff console',
    description: 'FoodLoop staff console — review registrations, approve or reject, send the WhatsApp invite email.',
    path: '/staff-console',
    index: false,
  })

  // Derived view: registrations with their effective (override-aware) status.
  const rows = useMemo(() => {
    void bump // re-derive after each decision
    return REGISTRATIONS_DEMO.map((reg) => ({ reg, status: getStatusFor(reg) }))
  }, [bump])

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status.status === 'pending').length,
      approved: rows.filter((r) => r.status.status === 'approved').length,
      rejected: rows.filter((r) => r.status.status === 'rejected').length,
      optIns: REGISTRATIONS_DEMO.filter((r) => r.whatsapp_opt_in).length,
    }),
    [rows],
  )

  const visible = rows.filter((r) => filter === 'all' || r.status.status === filter)

  function decide(id: string, status: Exclude<RegStatus, 'pending'>) {
    setStatusOverride(id, status)
    setBump((b) => b + 1)
    if (status === 'approved') {
      const reg = REGISTRATIONS_DEMO.find((r) => r.id === id)
      if (reg) setPreview(reg)
    }
  }

  return (
    <div className="page-pad container">
      <header className="page-head">
        <div>
          <span className="eyebrow">Staff console · internal</span>
          <h1>Registration reviews</h1>
          <p className="page-sub">
            Approve or reject new mess / NGO / vendor registrations. Approval triggers exactly one
            transactional email with the WhatsApp channel invite.
          </p>
        </div>
        <div className="admin-head-actions">
          <span className="admin-who">
            {user?.name} · {user?.org}
          </span>
          <Link to={MEMBER_PANEL} className="btn btn-ghost admin-act">
            Member panel
          </Link>
          <button type="button" className="btn btn-ghost admin-act" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* KPIs */}
      <Reveal className="admin-kpis">
        <div className="card kpi">
          <p className="kpi-value">{counts.pending}</p>
          <p className="kpi-label">Pending review</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{counts.approved}</p>
          <p className="kpi-label">Approved</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{counts.rejected}</p>
          <p className="kpi-label">Rejected</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{counts.optIns}</p>
          <p className="kpi-label">WhatsApp opt-ins</p>
        </div>
      </Reveal>

      {/* Queue */}
      <Reveal delay={60} className="card admin-panel">
        <div className="admin-toolbar" role="tablist" aria-label="Filter by status">
          {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`admin-tab${filter === f ? ' is-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : STATUS_META[f].label}
              <span className="admin-tab-count">
                {f === 'all' ? rows.length : counts[f]}
              </span>
            </button>
          ))}
        </div>

        <ul className="admin-list">
          {visible.map(({ reg, status }) => {
            const eff = status.status
            const open = expanded === reg.id
            return (
              <li key={reg.id} className="admin-row">
                <div className="admin-row-main">
                  <span className="admin-id mono">{reg.id}</span>
                  <div>
                    <p className="admin-name">
                      {reg.name} · <span className="admin-org">{reg.org}</span>
                    </p>
                    <p className="admin-meta">
                      <span className="admin-role-chip">{ROLE_SHORT[reg.role]}</span>{' '}
                      {reg.city} · applied {reg.created_at}
                      {reg.whatsapp_opt_in && (
                        <span className="admin-wa">
                          {' '}
                          · <MessageCircle size={12} aria-hidden /> WhatsApp
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="admin-row-actions">
                  <span className={`admin-status ${STATUS_META[eff].cls}`}>{STATUS_META[eff].label}</span>

                  {eff === 'pending' && (
                    <>
                      <button type="button" className="btn btn-primary admin-act" onClick={() => decide(reg.id, 'approved')}>
                        <Check size={15} aria-hidden /> Approve & send email
                      </button>
                      <button type="button" className="btn btn-ghost admin-act" onClick={() => decide(reg.id, 'rejected')}>
                        <X size={15} aria-hidden /> Reject
                      </button>
                    </>
                  )}

                  {eff === 'approved' && (
                    <button type="button" className="btn btn-ghost admin-act" onClick={() => setPreview(reg)}>
                      <Eye size={15} aria-hidden /> View email sent
                    </button>
                  )}

                  <button
                    type="button"
                    className="admin-expand"
                    aria-expanded={open}
                    aria-label={`${open ? 'Hide' : 'Show'} full details for ${reg.org}`}
                    onClick={() => setExpanded(open ? null : reg.id)}
                  >
                    <ChevronDown size={16} aria-hidden style={{ transform: open ? 'rotate(180deg)' : undefined }} />
                  </button>
                </div>

                {open && (
                  <div className="admin-details">
                    <dl>
                      <div>
                        <dt>Contact</dt>
                        <dd>
                          {reg.name} · {reg.email} · {reg.phone}
                        </dd>
                      </div>
                      <div>
                        <dt>Organisation</dt>
                        <dd>
                          {reg.org} — {ROLE_LABELS[reg.role]}, {reg.city}
                        </dd>
                      </div>
                      {Object.entries(reg.profile).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k.replace(/_/g, ' ')}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                      <div>
                        <dt>WhatsApp opt-in</dt>
                        <dd>{reg.whatsapp_opt_in ? 'Yes — invite will be emailed' : 'No — email only'}</dd>
                      </div>
                      {reg.notes && (
                        <div>
                          <dt>Staff notes</dt>
                          <dd>{reg.notes}</dd>
                        </div>
                      )}
                      {status.at && (
                        <div>
                          <dt>Decision recorded</dt>
                          <dd>
                            {STATUS_META[eff].label} · {status.at}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </li>
            )
          })}
          {visible.length === 0 && (
            <li className="admin-empty">
              <ClipboardList size={18} aria-hidden /> Nothing here — switch the filter above.
            </li>
          )}
        </ul>

        <p className="admin-pipeline-note">
          <Clock size={13} aria-hidden /> Approval sends <strong>one</strong> email (idempotent —
          retries never double-send) containing the WhatsApp channel invite. Rejection records a
          note and notifies the applicant by email. See{' '}
          <code>docs/05-backend-schema.md §3.6</code>.
        </p>
      </Reveal>

      {preview && (
        <ApprovalEmailModal name={preview.name} email={preview.email} refId={preview.id} onClose={() => setPreview(null)} />
      )}
    </div>
  )
}
