import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Delay in ms before the entrance animation starts once visible. */
  delay?: number
  className?: string
  role?: string
  'aria-label'?: string
}

/**
 * Scroll-entrance animation without any animation library.
 *
 * - Adds `.is-visible` when the element first enters the viewport; the
 *   fade/slide itself is the `fl-rise` CSS animation (index.css → Motion).
 * - An `animationend` listener then adds `.is-done`, which removes the
 *   animation so hover transitions on the same element work normally.
 * - Falls back to instantly visible when IntersectionObserver is missing;
 *   never hides content when JS is off (styles are gated behind `html.js`)
 *   or under `prefers-reduced-motion`.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  role,
  'aria-label': ariaLabel,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible', 'is-done')
      return
    }
    const onDone = (e: AnimationEvent) => {
      if (e.target === el) el.classList.add('is-done')
    }
    el.addEventListener('animationend', onDone)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      el.removeEventListener('animationend', onDone)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${className ? ` ${className}` : ''}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}
