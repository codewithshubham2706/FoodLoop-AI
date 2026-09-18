import { FileCheck, Scale, Leaf, Recycle } from 'lucide-react'
import { ESG, DAYS } from '../data/demo'
import { useSeo } from '../lib/seo'
import './Esg.css'

export default function Esg() {
  useSeo({
    title: 'ESG Dashboard — Audit-Ready Impact Reporting',
    description:
      'Quarterly ESG reporting for food waste: meals redistributed, CO₂e avoided, water footprint recovered and landfill diversion — aligned with FAO/UNEP FLW and BRSR disclosure needs.',
    path: '/esg',
  })

  const latest = ESG.records[ESG.records.length - 1]
  const prev = ESG.records[ESG.records.length - 2]
  if (!latest || !prev) return null

  const delta = (now: number, before: number) => {
    const pct = Math.round(((now - before) / before) * 100)
    return `${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct)}% QoQ`
  }

  return (
    <div className="page-pad container">
      <header className="page-head">
        <div>
          <span className="eyebrow">Compliance & reporting</span>
          <h1>ESG dashboard</h1>
          <p className="page-sub">
            {ESG.site} · reporting aligned to FAO/UNEP FLW emission factors and BRSR disclosure
            structure. Demo data.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" disabled title="Export ships with the pilot build">
          Export report (CSV)
        </button>
      </header>

      <div className="kpi-grid">
        <div className="card kpi">
          <p className="kpi-value">{latest.meals.toLocaleString('en-IN')}</p>
          <p className="kpi-label">Meals redistributed — {latest.period}</p>
          <p className="kpi-delta">{delta(latest.meals, prev.meals)}</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{latest.co2e_tons} t</p>
          <p className="kpi-label">CO₂e avoided — {latest.period}</p>
          <p className="kpi-delta">{delta(latest.co2e_tons, prev.co2e_tons)}</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{latest.water_m3.toLocaleString('en-IN')} m³</p>
          <p className="kpi-label">Water footprint recovered</p>
          <p className="kpi-delta">{delta(latest.water_m3, prev.water_m3)}</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">{latest.landfill_kg.toLocaleString('en-IN')} kg</p>
          <p className="kpi-label">Sent to landfill (lower = better)</p>
          <p className="kpi-delta down">{delta(latest.landfill_kg, prev.landfill_kg)}</p>
        </div>
      </div>

      <section className="card esg-trend">
        <h2>Landfill diversion trend</h2>
        <p className="esg-trend-sub">
          Share of surplus food diverted from landfill — rolling 7-week view (synthetic).
        </p>
        <svg viewBox="0 0 560 180" className="esg-chart" role="img"
          aria-label={`Landfill diversion rising from 61% to 88% over ${DAYS.length} weeks`}>
          <defs>
            <linearGradient id="esgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b7a5c" stopOpacity="0.35" />
              <stop offset="1" stopColor="#1b7a5c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 45, 90, 135, 180].map((y) => (
            <line key={y} x1="0" y1={y} x2="560" y2={y} className="gridline" />
          ))}
          <path d="M0,130 L80,120 L160,122 L240,100 L320,88 L400,64 L480,52 L560,30" className="trend-line" />
          <path d="M0,130 L80,120 L160,122 L240,100 L320,88 L400,64 L480,52 L560,30 L560,180 L0,180 Z" fill="url(#esgFill)" />
        </svg>
        <div className="esg-weeks" aria-hidden>
          {DAYS.map((d, i) => (
            <span key={d}>W{i + 1}</span>
          ))}
        </div>
      </section>

      <section className="esg-frameworks">
        <article className="card">
          <span className="engine-icon" aria-hidden>
            <Scale size={20} />
          </span>
          <h3>FAO / UNEP FLW standard</h3>
          <p>
            Diversion quantities and emission factors follow the Food Loss &amp; Waste reporting
            framework, so numbers survive third-party scrutiny.
          </p>
        </article>
        <article className="card">
          <span className="engine-icon" aria-hidden>
            <FileCheck size={20} />
          </span>
          <h3>BRSR-ready disclosures</h3>
          <p>
            Quarterly aggregates map to India's BRSR waste-management indicators for institutional
            filings.
          </p>
        </article>
        <article className="card">
          <span className="engine-icon" aria-hidden>
            <Recycle size={20} />
          </span>
          <h3>Append-only ledger</h3>
          <p>
            Every batch's impact entry is immutable and traceable to its QR custody record — no
            retroactive edits.
          </p>
        </article>
        <article className="card">
          <span className="engine-icon" aria-hidden>
            <Leaf size={20} />
          </span>
          <h3>Methane avoided</h3>
          <p>
            Landfilled food is a top methane source; diversion events convert to CO₂e using
            published factors.
          </p>
        </article>
      </section>
    </div>
  )
}
