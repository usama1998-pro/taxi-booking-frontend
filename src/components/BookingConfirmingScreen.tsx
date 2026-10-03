import { useEffect, useState } from 'react'

import { BrandLogoIcon } from '@/components/BrandLogoIcon'
import { BRAND_NAME } from '@/lib/brandConfig'

type BookingConfirmingScreenProps = {
  /** Shown under the title (e.g. payment already captured). */
  subtitle?: string
  /** Optional route line for context. */
  routeLabel?: string
}

const STEPS = [
  { id: 'payment', label: 'Payment received' },
  { id: 'booking', label: 'Creating your booking' },
  { id: 'email', label: 'Sending confirmation' },
] as const

export function BookingConfirmingScreen({
  subtitle = 'Please wait while we confirm your transfer. Do not close this page.',
  routeLabel,
}: BookingConfirmingScreenProps) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setActiveStep(1), 900),
      window.setTimeout(() => setActiveStep(2), 2200),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [])

  return (
    <main className="booking-confirming" aria-busy="true" aria-live="polite">
      <div className="booking-confirming__glow" aria-hidden="true" />
      <div className="booking-confirming__card">
        <div className="booking-confirming__brand">
          <span className="booking-confirming__brand-badge">
            <BrandLogoIcon width={22} height={22} />
          </span>
          <span className="booking-confirming__brand-name">{BRAND_NAME}</span>
        </div>

        <div className="booking-confirming__spinner-wrap" aria-hidden="true">
          <div className="booking-confirming__spinner" />
          <div className="booking-confirming__spinner-core" />
        </div>

        <p className="booking-confirming__eyebrow">Almost there</p>
        <h1 className="booking-confirming__title">Confirming your booking</h1>
        <p className="booking-confirming__lead">{subtitle}</p>

        {routeLabel ? (
          <p className="booking-confirming__route">
            <span className="booking-confirming__route-label">Trip</span>
            <span className="booking-confirming__route-value">{routeLabel}</span>
          </p>
        ) : null}

        <ol className="booking-confirming__steps">
          {STEPS.map((step, index) => {
            const done = index < activeStep
            const current = index === activeStep
            return (
              <li
                key={step.id}
                className={[
                  'booking-confirming__step',
                  done ? 'is-done' : '',
                  current ? 'is-current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="booking-confirming__step-marker" aria-hidden="true">
                  {done ? (
                    <svg viewBox="0 0 20 20" className="booking-confirming__check">
                      <path
                        d="m5 10.5 3.2 3.2L15 6.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="booking-confirming__dot" />
                  )}
                </span>
                <span className="booking-confirming__step-label">{step.label}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </main>
  )
}
