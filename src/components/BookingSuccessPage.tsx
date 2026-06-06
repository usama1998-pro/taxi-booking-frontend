import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { BookingSuccessPayload } from '@/lib/bookingsApi'

type BookingSuccessPageProps = {
  data: BookingSuccessPayload
  onBookAnother: () => void
}

type CopyKey = 'uuid' | 'all' | null

type IconProps = {
  className?: string
}

function SuccessMarkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <circle cx="32" cy="32" r="26" fill="currentColor" opacity="0.12" />
      <path
        d="M20 33.5 27.5 41 44 24.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="m5 13 4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function resolveBookingReference(data: BookingSuccessPayload): string {
  if (data.bookingReference?.trim()) {
    return data.bookingReference.trim()
  }
  return `BK-${data.uuid}`
}

function buildSummaryText(data: BookingSuccessPayload): string {
  const bookingRef = resolveBookingReference(data)
  const lines: string[] = [`Booking number: ${bookingRef}`]
  if (data.childSeatsSummary) {
    lines.push(`Child seats: ${data.childSeatsSummary}`)
  }
  return lines.join('\n')
}

export function BookingSuccessPage({ data, onBookAnother }: BookingSuccessPageProps) {
  const [copied, setCopied] = useState<CopyKey>(null)

  const summary = useMemo(() => buildSummaryText(data), [data])
  const bookingRef = resolveBookingReference(data)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(null), 2000)
    return () => window.clearTimeout(t)
  }, [copied])

  const handleCopy = useCallback(async (key: CopyKey, text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) setCopied(key)
  }, [])

  return (
    <main className="booking-page booking-success-page">
      <section className="booking-success-inner">
        <div className="booking-success-hero">
          <div className="booking-success-icon-wrap" aria-hidden="true">
            <SuccessMarkIcon className="booking-success-mark" />
          </div>
          <p className="booking-success-badge" role="status">
            Confirmed
          </p>
          <h1 className="booking-heading booking-success-title">Booking received</h1>
          <p className="booking-success-lead">
            Save your booking number. You can copy your reference below.
          </p>
        </div>

        <article className="booking-success-card" aria-label="Booking details">
          <div className="booking-success-card-accent" aria-hidden="true" />

          <div className="success-copy-block success-copy-block--reference">
            <div className="success-copy-label">Your booking reference</div>
            <div className="success-reference-panel">
              <code className="success-mono success-mono--large">{bookingRef}</code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="success-copy-btn success-copy-btn-icon text-foreground"
                aria-label={copied === 'uuid' ? 'Copied booking number' : 'Copy booking number'}
                onClick={() => void handleCopy('uuid', bookingRef)}
              >
                {copied === 'uuid' ? (
                  <CheckIcon className="success-copy-icon size-5 is-success" />
                ) : (
                  <CopyIcon className="success-copy-icon size-5" />
                )}
              </Button>
            </div>
          </div>

          {data.childSeatsSummary ? (
            <div className="success-copy-block">
              <div className="success-copy-label">Child seats</div>
              <p className="success-child-seats">{data.childSeatsSummary}</p>
            </div>
          ) : null}

          <div className="success-actions">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="success-copy-all min-h-11 px-5"
              onClick={() => void handleCopy('all', summary)}
            >
              {copied === 'all' ? (
                <>
                  <CheckIcon className="success-copy-icon size-5 is-success shrink-0" /> Copied summary
                </>
              ) : (
                <>
                  <CopyIcon className="success-copy-icon size-5 shrink-0" /> Copy all details
                </>
              )}
            </Button>
            <Button
              type="button"
              size="lg"
              className="success-book-again min-h-11 px-5"
              onClick={onBookAnother}
            >
              Book another ride
            </Button>
          </div>
        </article>
      </section>
    </main>
  )
}
