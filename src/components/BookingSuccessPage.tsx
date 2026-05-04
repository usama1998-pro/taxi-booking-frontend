import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { BookingSuccessPayload } from '@/lib/bookingsApi'

type BookingSuccessPageProps = {
  data: BookingSuccessPayload
  onBookAnother: () => void
}

type CopyKey = 'uuid' | 'phone' | 'email' | 'all' | null

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

function buildSummaryText(data: BookingSuccessPayload): string {
  const bookingRef = `BK-${data.uuid}`
  const lines: string[] = [`Booking number: ${bookingRef}`]
  if (data.driver) {
    lines.push(
      `Driver: ${data.driver.name?.trim() || data.driver.email || 'Assigned driver'}`,
    )
    lines.push(`Phone: ${data.driver.phone}`)
    if (data.driver.email) {
      lines.push(`Email: ${data.driver.email}`)
    }
  }
  if (data.assignmentMessage) {
    lines.push(data.assignmentMessage)
  }
  if (data.childSeatsSummary) {
    lines.push(`Child seats: ${data.childSeatsSummary}`)
  }
  return lines.join('\n')
}

export function BookingSuccessPage({ data, onBookAnother }: BookingSuccessPageProps) {
  const [copied, setCopied] = useState<CopyKey>(null)
  const driver = data.driver
  const assigned = driver != null

  const summary = useMemo(() => buildSummaryText(data), [data])
  const bookingRef = `BK-${data.uuid}`

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(null), 2000)
    return () => window.clearTimeout(t)
  }, [copied])

  const handleCopy = useCallback(async (key: CopyKey, text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) setCopied(key)
  }, [])

  const driverLabel =
    driver?.name?.trim() || driver?.email?.trim() || 'Assigned driver'

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
          <h1 className="booking-heading booking-success-title">
            {assigned ? 'Your driver is assigned' : 'Booking received'}
          </h1>
          <p className="booking-success-lead">
            {assigned
              ? 'Save your booking number and driver contact details. You can copy each field or copy everything at once.'
              : 'Save your booking number. We will assign a driver as soon as one is available — you can copy your reference below.'}
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

          {driver ? (
            <div className="success-copy-block success-driver-panel">
              <div className="success-copy-label">Your driver</div>
              <p className="success-driver-name">{driverLabel}</p>
              <div className="success-copy-label success-copy-label-spaced">Phone</div>
              <div className="success-copy-row">
                <a
                  className="success-phone success-phone-link"
                  href={`tel:${driver.phone.replace(/[^\d+]/g, '')}`}
                >
                  {driver.phone}
                </a>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="success-copy-btn success-copy-btn-icon text-foreground"
                  aria-label={copied === 'phone' ? 'Copied phone number' : 'Copy phone number'}
                  onClick={() => void handleCopy('phone', driver.phone)}
                >
                  {copied === 'phone' ? (
                    <CheckIcon className="success-copy-icon size-5 is-success" />
                  ) : (
                    <CopyIcon className="success-copy-icon size-5" />
                  )}
                </Button>
              </div>
              {driver.email ? (
                <>
                  <div className="success-copy-label success-copy-label-spaced">Email</div>
                  <div className="success-copy-row">
                    <a className="success-email success-email-link" href={`mailto:${driver.email}`}>
                      {driver.email}
                    </a>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="success-copy-btn success-copy-btn-icon"
                      aria-label={copied === 'email' ? 'Copied email' : 'Copy email address'}
                      onClick={() => void handleCopy('email', driver.email!)}
                    >
                      {copied === 'email' ? (
                        <CheckIcon className="success-copy-icon size-5 is-success" />
                      ) : (
                        <CopyIcon className="success-copy-icon size-5" />
                      )}
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {data.assignmentMessage ? (
            <aside className="booking-success-callout" role="note">
              <span className="booking-success-callout-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M12 10.25V16M12 7.2v.05"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div className="booking-success-callout-body">
                <p className="booking-success-callout-kicker">From your booking</p>
                <p className="booking-success-callout-text">{data.assignmentMessage}</p>
              </div>
            </aside>
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
