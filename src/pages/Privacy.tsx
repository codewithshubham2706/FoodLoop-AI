import type { ReactNode } from 'react'
import { useSeo } from '../lib/seo'
import { CONTACT_EMAIL } from '../lib/env'
import './Legal.css'

const SECTIONS: Array<{ h: string; body: ReactNode }> = [
  {
    h: '1. Who we are',
    body: (
      <>
        <p>
          FoodLoop AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a food-surplus management platform.
          This policy explains what we collect on this website, why, and the controls you have.
          Questions? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    h: '2. What we collect',
    body: (
      <>
        <p>
          <strong>Waitlist form.</strong> If you submit the pilot waitlist form we store the name,
          email, organization and role you provide — solely to review your registration and contact
          you about the pilot. This is the only place on this site where personal data is collected.
        </p>
        <p>
          <strong>WhatsApp broadcast (optional).</strong> Only if you tick the WhatsApp opt-in, we
          add your number to the broadcast-channel invite list. After an administrator approves your
          registration you receive <strong>one email</strong> containing the WhatsApp channel invite;
          the channel itself carries surplus alerts, pilot updates and impact digests. WhatsApp is a
          Meta service — its own terms and privacy policy apply on that platform. You can leave the
          channel anytime, or skip the opt-in entirely and stay on email.
        </p>
        <p>
          <strong>Essential storage.</strong> A small localStorage entry records your cookie choice
          so we don&rsquo;t ask again. It contains no personal data.
        </p>
        <p>
          <strong>Analytics (optional).</strong> Only with your consent, Google Analytics 4 records
          anonymized usage events (page views, button clicks) with IP anonymization enabled. If you
          decline, no analytics script loads at all.
        </p>
        <p>
          <strong>Demo data.</strong> Batches, forecasts, NGO names and impact numbers shown in the
          dashboard are synthetic. No real individual is identifiable in them.
        </p>
      </>
    ),
  },
  {
    h: '3. What we never do',
    body: (
      <ul>
        <li>We never sell or rent personal data.</li>
        <li>We never place advertising or cross-site tracking cookies.</li>
        <li>We never load third-party trackers before you opt in.</li>
        <li>Batch QR codes encode only a batch ID — no personal data.</li>
      </ul>
    ),
  },
  {
    h: '4. Your choices & rights',
    body: (
      <p>
        You can withdraw analytics consent anytime via &ldquo;Cookie settings&rdquo; in the footer.
        You may request access to, correction of, or deletion of your waitlist details by emailing{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>; we respond within 30 days. This
        site is designed around DPDP Act 2023 and GDPR principles: lawfulness, purpose limitation,
        data minimization and storage limitation.
      </p>
    ),
  },
  {
    h: '5. Security',
    body: (
      <p>
        The site is served over HTTPS with HSTS. Secrets are never embedded in front-end code —
        the browser only ever talks to our API over TLS. Form submissions are rate-limited and
        protected against automated spam.
      </p>
    ),
  },
  {
    h: '6. Changes',
    body: (
      <p>
        If this policy changes materially we will update this page and the effective date below
        before the change takes effect.
      </p>
    ),
  },
]

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy',
    description:
      'How FoodLoop AI collects, uses and protects data: consent-gated analytics, no ad tracking, DPDP & GDPR-aligned rights, and security practices.',
    path: '/privacy',
  })

  return (
    <div className="legal container">
      <span className="eyebrow">Legal</span>
      <h1>Privacy policy</h1>
      <p className="legal-effective">Effective date: September 18, 2026</p>

      {SECTIONS.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.body}
        </section>
      ))}
    </div>
  )
}
