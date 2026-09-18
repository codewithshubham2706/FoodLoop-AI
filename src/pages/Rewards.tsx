import { Award, Coins, Sprout, Trophy } from 'lucide-react'
import { REWARDS } from '../data/demo'
import { useSeo } from '../lib/seo'
import './Rewards.css'

const PERKS = [
  { icon: Coins, title: 'Fee credits', desc: 'Reduce platform fees as your diversion streak grows.' },
  { icon: Trophy, title: 'City leaderboard', desc: 'Recognition for top waste-reducing institutions each quarter.' },
  { icon: Sprout, title: 'Green audits', desc: 'Points convert to verified diversion certificates for ESG filings.' },
]

export default function Rewards() {
  useSeo({
    title: 'Rewards — Points for Businesses Reducing Waste',
    description:
      'FoodLoop AI rewards kitchens and businesses that divert surplus: points per kg redistributed, tier upgrades, fee credits and auditable green certificates.',
    path: '/rewards',
  })

  const nextTierAt = 6000
  const progress = Math.min(100, Math.round((REWARDS.points / nextTierAt) * 100))

  return (
    <div className="page-pad container rewards-page">
      <header className="page-head">
        <div>
          <span className="eyebrow">Green loyalty</span>
          <h1>Rewards for waste reducers</h1>
          <p className="page-sub">
            Every verified kilogram diverted earns points. Demo account:{' '}
            <strong>{REWARDS.business}</strong>
          </p>
        </div>
      </header>

      <div className="rewards-hero card">
        <div className="rewards-score">
          <span className="rewards-tier-badge">
            <Award size={16} aria-hidden /> {REWARDS.tier} tier
          </span>
          <p className="rewards-points">{REWARDS.points.toLocaleString('en-IN')}</p>
          <p className="rewards-points-label">green points</p>
          <div
            className="tier-progress"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress to next tier: ${progress}%`}
          >
            <div className="tier-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="tier-hint">{(nextTierAt - REWARDS.points).toLocaleString('en-IN')} points to Canopy+ status</p>
        </div>

        <div className="rewards-why">
          <h2>How points work</h2>
          <ul>
            <li><strong>+2 pts</strong> per kg of surplus safely redistributed</li>
            <li><strong>+25 pts</strong> for a perfect month of cold-chain compliance</li>
            <li><strong>+50 pts</strong> for demand-forecast adoption (less overproduction)</li>
            <li>Points never expire while your pilot stays active</li>
          </ul>
        </div>
      </div>

      <section className="card rewards-table-card">
        <h2>Monthly ledger</h2>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Monthly reward ledger: waste diverted and points earned</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Waste diverted</th>
                <th scope="col">Points earned</th>
                <th scope="col">Tier reached</th>
              </tr>
            </thead>
            <tbody>
              {REWARDS.history.map((h) => (
                <tr key={h.month}>
                  <td className="mono">{h.month}</td>
                  <td>{h.waste_diverted_kg} kg</td>
                  <td>+{h.points.toLocaleString('en-IN')}</td>
                  <td>
                    <span className="tier-chip">{h.tier}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="perks-grid">
        {PERKS.map((p) => (
          <article key={p.title} className="card perk-card">
            <span className="engine-icon" aria-hidden>
              <p.icon size={20} />
            </span>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
