import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ScanLine, CircleCheck, CircleAlert, QrCode, ArrowRight } from 'lucide-react'
import { BATCHES, traceFor } from '../data/demo'
import { useSeo } from '../lib/seo'
import './Trace.css'

export default function Trace() {
  useSeo({
    title: 'QR Food Trace — Digital Twin for Every Batch',
    description:
      'Scan a batch QR or enter a batch ID to see its full digital-twin lineage: demand prediction, quality signals, NGO custody chain, route and recorded impact.',
    path: '/trace',
  })

  const [params, setParams] = useSearchParams()
  const initial = params.get('batch') ?? ''
  const [input, setInput] = useState(initial)
  const [submitted, setSubmitted] = useState(initial)

  const batch = useMemo(() => BATCHES.find((b) => b.id === submitted), [submitted])
  const events = traceFor(submitted)
  const others = BATCHES.filter((b) => b.id !== submitted).slice(0, 3)

  function lookup(e: FormEvent) {
    e.preventDefault()
    const id = input.trim().toUpperCase()
    setSubmitted(id)
    setParams(id ? { batch: id } : {})
  }

  return (
    <div className="page-pad container trace-page">
      <header className="page-head">
        <div>
          <span className="eyebrow">Food digital twin</span>
          <h1>QR food trace</h1>
          <p className="page-sub">
            Every batch carries a QR linking to its live lineage — prediction → quality → custody →
            impact.
          </p>
        </div>
      </header>

      <form className="trace-form" onSubmit={lookup} role="search">
        <label htmlFor="batch-id" className="sr-only">
          Batch ID
        </label>
        <input
          id="batch-id"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a batch ID, e.g. FL-2026-0042"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="btn btn-primary">
          <ScanLine size={17} aria-hidden /> Trace batch
        </button>
      </form>

      {submitted && !batch && (
        <div className="card trace-empty" role="status">
          <CircleAlert size={20} aria-hidden />
          <div>
            <p className="trace-empty-title">No batch found for “{submitted}”</p>
            <p className="trace-empty-sub">Try one of the demo batches below.</p>
          </div>
        </div>
      )}

      {batch && (
        <div className="trace-layout">
          <section className="card trace-summary">
            <p className="trace-id mono">{batch.id}</p>
            <h2 className="trace-item">{batch.item}</h2>
            <dl className="trace-facts">
              <div>
                <dt>Quantity</dt>
                <dd>{batch.qty_kg} kg · {batch.meals_est > 0 ? `≈${batch.meals_est} meals` : 'non-meal item'}</dd>
              </div>
              <div>
                <dt>Safe window</dt>
                <dd>{batch.window.from} → {batch.window.until}</dd>
              </div>
              <div>
                <dt>Origin</dt>
                <dd>{batch.site.name}</dd>
              </div>
              <div>
                <dt>Quality</dt>
                <dd>
                  Grade {batch.quality.grade} · score {Math.round(batch.quality.score * 100)}%
                </dd>
              </div>
              {batch.ngo && (
                <div>
                  <dt>Recipient</dt>
                  <dd>{batch.ngo}</dd>
                </div>
              )}
              {typeof batch.co2_saved_kg === 'number' && (
                <div>
                  <dt>Impact</dt>
                  <dd>{batch.co2_saved_kg} kg CO₂e avoided</dd>
                </div>
              )}
            </dl>

            <div className="trace-signals">
              {batch.quality.signals.map((s) => (
                <span key={s} className={s.includes('REJECT') ? 'signal bad' : 'signal'}>
                  {s.includes('REJECT') ? <CircleAlert size={13} aria-hidden /> : <CircleCheck size={13} aria-hidden />}
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="card trace-timeline-card" aria-label="Batch custody timeline">
            <h2 className="trace-timeline-title">Custody timeline</h2>
            {events.length > 0 ? (
              <ol className="timeline">
                {events.map((ev, i) => (
                  <li key={i} className={ev.ok ? '' : 'bad'}>
                    <span className="tl-dot" aria-hidden />
                    <div>
                      <p className="tl-stage">
                        {ev.stage} <time className="tl-ts">{ev.ts}</time>
                      </p>
                      <p className="tl-detail">{ev.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="trace-empty-sub">Timeline not yet recorded for this batch.</p>
            )}
          </section>
        </div>
      )}

      <section className="qr-panel card" aria-label="Demo QR code">
        <div className="qr-copy">
          <QrCode size={22} aria-hidden />
          <div>
            <h2>Try it with the demo QR</h2>
            <p>
              This code encodes <span className="mono">/trace?batch=FL-2026-0042</span> — printed on
              every cold-box label in the pilot.
            </p>
          </div>
        </div>
        <img
          src="/images/batch-qr.png"
          alt="QR code linking to demo batch FL-2026-0042 trace page"
          width={148}
          height={148}
          loading="lazy"
        />
      </section>

      {others.length > 0 && (
        <section aria-label="Other demo batches" className="trace-others">
          <h2>Other demo batches</h2>
          <div className="trace-others-row">
            {others.map((b) => (
              <Link key={b.id} to={`/trace?batch=${b.id}`} className="chip">
                {b.id} <ArrowRight size={13} aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
