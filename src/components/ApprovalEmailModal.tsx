import { MessageCircle, MailCheck, X } from 'lucide-react'
import { APPROVAL_EMAIL } from '../data/demo'

interface Props {
  name: string
  email: string
  refId?: string
  onClose: () => void
}

/**
 * The single approval email (From/To/Subject + body with the WhatsApp channel
 * invite card). Used by the admin console to preview what will be sent and by
 * the user panel to show the member what they received.
 */
export default function ApprovalEmailModal({ name, email, refId, onClose }: Props) {
  return (
    <div className="admin-modal-scrim" onClick={onClose}>
      <div
        className="card admin-email"
        role="dialog"
        aria-modal="true"
        aria-label={`Approval email preview for ${name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-email-head">
          <span className="admin-email-chip">
            <MailCheck size={14} aria-hidden /> Email preview{refId ? ` — ${refId}` : ''}
          </span>
          <button className="admin-close" onClick={onClose} aria-label="Close email preview">
            <X size={18} />
          </button>
        </div>
        <p className="admin-email-line">
          <strong>From:</strong> {APPROVAL_EMAIL.from}
        </p>
        <p className="admin-email-line">
          <strong>To:</strong> {name} &lt;{email}&gt;
        </p>
        <p className="admin-email-line">
          <strong>Subject:</strong> {APPROVAL_EMAIL.subject}
        </p>
        <div className="admin-email-body">
          <p>Hi {name.split(' ')[0]},</p>
          <p>
            Your FoodLoop AI pilot registration is <strong>approved</strong> 🎉 Join our WhatsApp
            broadcast channel for everything that happens next:
          </p>
          <a className="admin-channel" href={APPROVAL_EMAIL.channel_invite} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden />
            <span>
              <strong>{APPROVAL_EMAIL.channel_name}</strong>
              <small>Tap to join the broadcast channel →</small>
            </span>
          </a>
          <p>On the channel you&rsquo;ll get:</p>
          <ul>
            {APPROVAL_EMAIL.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>Prefer email only? Just ignore the invite — we&rsquo;ll still mail you pilot milestones.</p>
          <p>— Team FoodLoop AI</p>
        </div>
        <p className="admin-email-note">
          Demo preview · in production this is a transactional email (Resend/SES) triggered by the{' '}
          <code>POST /v1/waitlist/{'{id}'}/approve</code> endpoint — see docs/05-backend-schema.md §3.6.
        </p>
      </div>
    </div>
  )
}
