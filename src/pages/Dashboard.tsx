import { TrendingUp, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FORECAST, BATCHES, DAYS, type BatchStatus } from '../data/demo'
import { useSeo } from '../lib/seo'
import './Dashboard.css'

const STATUS_LABEL: Record<BatchStatus, string> = {
  surplus_detected: 'Surplus detected',
  quality_check: 'Quality check',
  alert_generated: 'Alert',
  matched: 'NGO matched',
  in_transit: 'In transit',
  delivered: 'Delivered',
  impact_recorded: 'Impact recorded',
}

const MAX = 560

function Sparkbars({ values }: { values: number[] }) {
  return (
    <svg
      className="sparkbars"
      viewBox={`0 0 ${values.length * 28} 100`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`7-day forecast: ${values.map((v, i) => `${DAYS[i] ?? i} ${v}`).join(', ')}`}
    >
      {values.map((v, i) => (
        <rect
          key={i}
          x={i * 28 + 6}
          y={100 - (v / MAX) * 100}
          width={16}
          height={(v / MAX) * 100}
          rx={3}
          className={i >= 5 ? 'weekend' : 'weekday'}
        />
      ))}
    </svg>
  )
}

export default function Dashboard() {
  useSeo({
    title: 'Live Dashboard — Demand Forecast & Surplus Batches',
    description:
      'Watch the FoodLoop AI closed loop run: 7-day demand forecast, live surplus batches, quality grades, NGO matches and optimized routes.',
    path: '/dashboard',
  })

  return (
    <div className="page-pad container">
      <header className="page-head">
        <div>
          <span className="eyebrow">Demo environment</span>
          <h1>Live dashboard</h1>
          <p className="page-sub">
            Synthetic pilot data for <strong>{FORECAST.site_id}</strong> · model:{' '}
            <strong>{FORECAST.model}</strong>
          </p>
        </div>
        <Link to="/#waitlist" className="btn btn-primary">
          Join the pilot
        </Link>
      </header>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="card kpi">
          <p className="kpi-value">250</p>
          <p className="kpi-label">Meals redistributed today</p>
          <p className="kpi-delta">▲ 18% vs last week</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">107 kg</p>
          <p className="kpi-label">CO₂e avoided today</p>
          <p className="kpi-delta">▲ 12% vs last week</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">₹18,400</p>
          <p className="kpi-label">Procurement cost saved (MTD)</p>
          <p className="kpi-delta">▲ 9% vs last month</p>
        </div>
        <div className="card kpi">
          <p className="kpi-value">96%</p>
          <p className="kpi-label">Cold-chain compliance</p>
          <p className="kpi-delta">▲ 4 pts vs last month</p>
        </div>
      </div>

      {/* Forecast */}
      <section className="card forecast-card">
        <div className="forecast-head">
          <div>
            <h2>7-day demand forecast</h2>
            <p>Explainable, factor-wise: menu + attendance + weather + day-of-week</p>
          </div>
          <span className="forecast-badge">
            <TrendingUp size={15} aria-hidden /> v3 · MAPE 8.4%
          </span>
        </div>
        <div className="forecast-grid">
          {FORECAST.items.map((series) => (
            <div key={series.item} className="forecast-series">
              <p className="series-name">{series.item}</p>
              <Sparkbars values={series.yhat} />
              <div className="series-days" aria-hidden>
                {DAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Batches */}
      <section className="card batches-card">
        <div className="forecast-head">
          <div>
            <h2>Active surplus batches</h2>
            <p>Quality-checked, matched and routed — automatically</p>
          </div>
          <span className="forecast-badge">
            <PackageSearch size={15} aria-hidden /> {BATCHES.length} live
          </span>
        </div>

        <div className="table-scroll">
          <table>
            <caption className="sr-only">Active surplus batches with quality grade and status</caption>
            <thead>
              <tr>
                <th scope="col">Batch</th>
                <th scope="col">Item</th>
                <th scope="col">Qty</th>
                <th scope="col">Grade</th>
                <th scope="col">Status</th>
                <th scope="col">NGO</th>
                <th scope="col">Trace</th>
              </tr>
            </thead>
            <tbody>
              {BATCHES.map((b) => (
                <tr key={b.id}>
                  <td className="mono">{b.id}</td>
                  <td>{b.item}</td>
                  <td>{b.qty_kg} kg</td>
                  <td>
                    <span className={`grade grade-${b.quality.grade}`}>
                      {b.quality.grade} · {Math.round(b.quality.score * 100)}
                    </span>
                  </td>
                  <td>
                    <span className={`status st-${b.status}`}>{STATUS_LABEL[b.status]}</span>
                  </td>
                  <td>{b.ngo ?? '—'}</td>
                  <td>
                    <Link className="trace-link" to={`/trace?batch=${b.id}`}>
                      QR
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
