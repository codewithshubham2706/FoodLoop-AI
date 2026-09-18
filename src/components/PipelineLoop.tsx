import { ChefHat, ScanLine, Bell, Handshake, Route, Truck, Leaf } from 'lucide-react'
import { PIPELINE_STEPS } from '../data/demo'
import Reveal from './Reveal'
import './PipelineLoop.css'

const ICONS = [ChefHat, ScanLine, Bell, Handshake, Route, Truck, Leaf] as const

/**
 * The closed loop:
 * Food Prepared → AI Predicts Demand → Surplus Detected → Quality Check →
 * Alert → NGO Matched → Route → Delivered → Impact Recorded.
 *
 * The whole loop fades in as one unit, then each step staggers in
 * (70ms apart) for a "pipeline coming online" effect.
 */
export default function PipelineLoop() {
  return (
    <Reveal role="list" aria-label="Closed-loop food redistribution pipeline" className="pipeline">
      {PIPELINE_STEPS.map((step, i) => {
        const Icon = ICONS[i] ?? Leaf
        return (
          <Reveal
            key={step.id}
            role="listitem"
            delay={i * 70}
            className={`pipe-step${step.accent ? ' is-accent' : ''}`}
          >
            <span className="pipe-icon" aria-hidden>
              <Icon size={19} />
            </span>
            <span>
              <strong>
                {i + 1}. {step.label}
              </strong>
              <small>{step.hint}</small>
            </span>
          </Reveal>
        )
      })}
    </Reveal>
  )
}
