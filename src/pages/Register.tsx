import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, MailCheck, MessageCircle } from 'lucide-react'
import RegisterForm from '../components/RegisterForm'
import Reveal from '../components/Reveal'
import { useSeo } from '../lib/seo'
import './Register.css'

const STEPS = [
  {
    icon: ShieldCheck,
    title: 'Staff review',
    desc: 'FoodLoop operators verify your organisation, capacity and food-safety readiness — usually within one working day.',
  },
  {
    icon: MailCheck,
    title: 'Approval email',
    desc: 'One transactional email lands in your inbox the moment you are approved, containing your WhatsApp channel invite.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp broadcast',
    desc: 'The channel carries surplus alerts near you, onboarding steps and monthly impact digests. Leave anytime.',
  },
]

export default function Register() {
  useSeo({
    title: 'Register your organisation',
    description:
      'Register your mess, NGO or vendor operation for the FoodLoop AI pilot. Staff review, approval email with WhatsApp channel invite, live impact tracking.',
    path: '/register',
    index: false,
  })

  return (
    <div className="page-pad container register-page">
      <header className="page-head">
        <div>
          <span className="eyebrow">Pilot onboarding</span>
          <h1>Register your organisation</h1>
          <p className="page-sub">
            Tell us about your mess, NGO or vendor operation. FoodLoop staff review every
            registration — approved members get the WhatsApp broadcast channel and full panel access.
          </p>
        </div>
      </header>

      <div className="register-layout">
        <Reveal className="card register-form-card">
          <RegisterForm />
        </Reveal>

        <aside className="register-aside">
          <Reveal delay={80} className="card register-steps-card">
            <h2>What happens next</h2>
            <ol className="register-steps">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="register-step-icon" aria-hidden>
                    <s.icon size={18} />
                  </span>
                  <div>
                    <strong>
                      {i + 1}. {s.title}
                    </strong>
                    <p>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={140} className="card register-note-card">
            <Clock size={18} aria-hidden />
            <p>
              Already registered? <Link to="/login">Sign in</Link> and open{' '}
              <strong>My panel</strong> to see your live status timeline.
            </p>
          </Reveal>
        </aside>
      </div>
    </div>
  )
}
