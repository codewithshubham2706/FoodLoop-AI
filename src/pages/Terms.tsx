import { useSeo } from '../lib/seo'
import { CONTACT_EMAIL } from '../lib/env'
import './Legal.css'

export default function Terms() {
  useSeo({
    title: 'Terms & Conditions',
    description:
      'Terms for using the FoodLoop AI website and demo: acceptable use, demo-data disclaimer, food-safety responsibilities, liability limits and governing law.',
    path: '/terms',
  })

  return (
    <div className="legal container">
      <span className="eyebrow">Legal</span>
      <h1>Terms &amp; conditions</h1>
      <p className="legal-effective">Effective date: September 18, 2026</p>

      <section>
        <h2>1. Acceptance</h2>
        <p>
          By using this website you agree to these terms. If you don&rsquo;t agree, please stop
          using the site. For pilot agreements with institutions, a separate contract will govern.
        </p>
      </section>

      <section>
        <h2>2. Demo status</h2>
        <p>
          This site is a <strong>prototype</strong>. Dashboard figures, forecasts, NGOs
          and impact numbers are synthetic demonstrations, not real claims. Features may change or
          be withdrawn without notice.
        </p>
      </section>

      <section>
        <h2>3. Acceptable use</h2>
        <ul>
          <li>Don&rsquo;t attack, overload or reverse the site or its APIs.</li>
          <li>Don&rsquo;t submit false information or automated spam through forms.</li>
          <li>Don&rsquo;t scrape contact details or attempt to identify real individuals in demo data.</li>
        </ul>
      </section>

      <section>
        <h2>4. Food safety — important</h2>
        <p>
          FoodLoop AI supports decisions; it does not replace them. Quality grades from computer
          vision and IoT sensors are <strong>advisory signals only</strong>. Final judgment on
          whether food is safe to donate or serve always rests with the food business operator and
          recipient, following FSSAI rules and applicable law. High-impact decisions require
          human approval by design.
        </p>
      </section>

      <section>
        <h2>5. Intellectual property</h2>
        <p>
          The FoodLoop AI name, interface and code are the property of the team unless stated
          otherwise. You may share screenshots and link to the site; you may not rebrand or
          resell it.
        </p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <p>
          The site is provided &ldquo;as is&rdquo; without warranties. To the maximum extent
          permitted by law, we are not liable for indirect or consequential losses arising from
          use of this demo.
        </p>
      </section>

      <section>
        <h2>7. Governing law</h2>
        <p>
          These terms are governed by the laws of India, with courts in Delhi having exclusive
          jurisdiction. Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </div>
  )
}
