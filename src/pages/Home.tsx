import { Link } from 'react-router-dom'
import { ArrowRight, BrainCircuit, ShieldCheck, HeartHandshake, QrCode, Award, BarChart3, Scale, Building2, Sprout } from 'lucide-react'
import PipelineLoop from '../components/PipelineLoop'
import Reveal from '../components/Reveal'
import WaitlistForm from '../components/WaitlistForm'
import { useSeo } from '../lib/seo'
import './Home.css'

const ENGINES = [
  {
    icon: BrainCircuit,
    name: 'DEMAND AI',
    desc: 'Forecasts meal demand per item from POS, menu and attendance history — so surplus is prevented before it exists.',
    tags: ['XGBoost · LightGBM', 'LSTM / TFT'],
  },
  {
    icon: ShieldCheck,
    name: 'QUALITY AI',
    desc: 'Computer vision + IoT cold-chain sensors grade every batch. Food-safety rules, not vision alone, decide safety.',
    tags: ['YOLO · EfficientNet', 'ESP32 + MQTT'],
  },
  {
    icon: HeartHandshake,
    name: 'MATCHING AI',
    desc: 'Ranks nearby NGOs by capacity, dietary fit, distance and pickup window — matched automatically in seconds.',
    tags: ['Geo-ranking', 'PostGIS'],
  },
  {
    icon: QrCode,
    name: 'FOOD DIGITAL TWIN',
    desc: 'Every batch gets a QR: full farm-to-fork lineage — predictions, quality signals, custody chain, impact.',
    tags: ['QR tracking', 'Append-only ledger'],
  },
]

const EXTRAS = [
  {
    icon: QrCode,
    title: 'QR-based food tracking',
    desc: 'Scan any batch to see its live journey and safety record.',
    to: '/trace',
    cta: 'Try the live demo',
  },
  {
    icon: Award,
    title: 'Rewards for waste reducers',
    desc: 'Points, tiers and recognition for businesses that divert surplus.',
    to: '/rewards',
    cta: 'See reward tiers',
  },
  {
    icon: BarChart3,
    title: 'ESG compliance dashboard',
    desc: 'Audit-ready CO₂e, meals and landfill-diversion reporting per BRSR & ESG frameworks.',
    to: '/esg',
    cta: 'Open the dashboard',
  },
  {
    icon: Building2,
    title: 'Government integration',
    desc: 'Future scope: FSSAI, municipal bodies and food-bank networks on one rail.',
    to: '/esg',
    cta: 'View the roadmap',
  },
]

export default function Home() {
  useSeo({
    title: 'FoodLoop AI — Predict, Prevent & Redistribute Food Waste with AI',
    description:
      'FoodLoop AI predicts food demand and surplus, checks quality with CV + IoT, matches safe surplus with nearby NGOs and optimizes delivery routes — measuring meals served and CO₂ saved.',
    path: '/',
  })

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AI-powered food surplus platform</span>
            <h1>
              Waste less. <span className="grad">Feed more.</span>
            </h1>
            <p className="hero-sub">
              FoodLoop AI shifts institutions from <strong>reactive</strong> “waste → collect →
              dispose” to <strong>proactive</strong> <em>Predict → Prevent → Redistribute →
              Measure</em> — across procurement, production, storage and distribution.
            </p>
            <div className="hero-actions">
              {/* The one clear call to action */}
              <a href="#waitlist" className="btn btn-primary btn-lg" id="cta-join-pilot">
                Join the pilot <ArrowRight size={18} aria-hidden />
              </a>
              <Link to="/dashboard" className="btn btn-ghost btn-lg">
                See the live demo
              </Link>
            </div>
            <p className="hero-proof">Pilot program · campus kitchens + NGO network · onboarding in 2 weeks</p>
          </div>

          <div className="hero-panel" aria-hidden="true">
            <div className="panel-card">
              <div className="panel-row">
                <span className="panel-dot ok" />
                <div>
                  <p className="panel-kicker">Batch FL-2026-0042 · grade A</p>
                  <p className="panel-strong">42 kg veg meals → Annapurna Seva Trust</p>
                </div>
              </div>
              <div className="panel-spark" />
              <div className="panel-cols">
                <div>
                  <p className="panel-num">120</p>
                  <p className="panel-cap">meals served</p>
                </div>
                <div>
                  <p className="panel-num">76 kg</p>
                  <p className="panel-cap">CO₂e avoided</p>
                </div>
                <div>
                  <p className="panel-num">14:05</p>
                  <p className="panel-cap">ETA · route #2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closed loop ──────────────────────────────────────── */}
      <section className="section" id="how">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">The closed loop</span>
            <h2>From extra trays to measured impact — automatically</h2>
            <p>
              Five connected AI engines run as one pipeline. Routine alerts and matching are
              automated; high-impact production changes stay human-approved.
            </p>
          </Reveal>
          <PipelineLoop />
        </div>
      </section>

      {/* ── Engines ──────────────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">The engines</span>
            <h2>Five AIs, one feedback loop</h2>
            <p>
              Every prediction ships with an explainable, factor-wise breakdown — no black boxes.
            </p>
          </Reveal>
          <div className="engine-grid">
            {ENGINES.map((eng, i) => (
              <Reveal key={eng.name} delay={i * 80}>
                <article className="card engine-card">
                  <span className="engine-icon" aria-hidden>
                    <eng.icon size={22} />
                  </span>
                  <h3>{eng.name}</h3>
                  <p>{eng.desc}</p>
                  <div className="engine-tags">
                    {eng.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Extra winning ideas ──────────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Beyond the core</span>
            <h2>Built to win — and to keep compounding</h2>
          </Reveal>
          <div className="extras-grid">
            {EXTRAS.map((x, i) => (
              <Reveal key={x.title} delay={i * 80}>
                <Link to={x.to} className="card extra-card">
                  <span className="engine-icon" aria-hidden>
                    <x.icon size={20} />
                  </span>
                  <h3>{x.title}</h3>
                  <p>{x.desc}</p>
                  <span className="extra-cta">
                    {x.cta} <ArrowRight size={14} aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact band ──────────────────────────────────────── */}
      <section className="impact-band">
        <div className="container">
          <Reveal className="impact-copy">
            <span className="eyebrow eyebrow-dark">Impact, measured</span>
            <h2>KPIs judges and auditors can verify</h2>
            <p>
              Every redistributed batch writes to an append-only impact ledger — CO₂e avoided,
              meals served, money saved — reportable per FAO/UNEP FLW frameworks.
            </p>
            <div className="impact-facts">
              <div>
                <Scale size={18} aria-hidden />
                <span>FAO/UNEP FLW methodology</span>
              </div>
              <div>
                <Sprout size={18} aria-hidden />
                <span>FSSAI-aligned food safety</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Waitlist — the single CTA target ─────────────────── */}
      <section className="section" id="waitlist">
        <div className="container waitlist-wrap">
          <Reveal className="waitlist-copy">
            <h2>Bring FoodLoop AI to your campus or NGO</h2>
            <p>
              Two-week pilot: connect your mess data, see live forecasts, and watch surplus become
              served meals. No hardware purchase required to start.
            </p>
            <ul className="waitlist-points">
              <li>Demand + surplus forecasting on your historical data</li>
              <li>NGO matching and route optimization out of the box</li>
              <li>Impact reporting you can put in an ESG filing</li>
            </ul>
          </Reveal>
          <Reveal delay={120} className="card waitlist-card">
            <WaitlistForm />
          </Reveal>
        </div>
      </section>
    </div>
  )
}
