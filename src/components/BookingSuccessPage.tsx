import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { BookingSuccessPayload } from '@/lib/bookingsApi'

type BookingSuccessPageProps = {
  data: BookingSuccessPayload
  onBookAnother: () => void
}

type CopyKey = 'uuid' | 'phone' | 'all' | null

type IconProps = {
  className?: string
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
    lines.push(`Driver: ${data.driver.name ?? 'Your driver'}`)
    lines.push(`Phone: ${data.driver.phone}`)
    if (data.driver.email) {
      lines.push(`Email: ${data.driver.email}`)
    }
  }
  if (data.assignmentMessage) {
    lines.push(data.assignmentMessage)
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

  const driverLabel = driver?.name?.trim() || 'Your driver'

  return (
    <main className="booking-page booking-success-page">
      <section className="booking-success-inner">
        <div className="booking-success-hero">
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
          <div className="success-copy-block">
            <div className="success-copy-label">Booking number</div>
            <div className="success-copy-row">
              <code className="success-mono">{bookingRef}</code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="success-copy-btn success-copy-btn-icon"
                aria-label={copied === 'uuid' ? 'Copied booking number' : 'Copy booking number'}
                onClick={() => void handleCopy('uuid', bookingRef)}
              >
                {copied === 'uuid' ? (
                  <CheckIcon className="success-copy-icon is-success" />
                ) : (
                  <CopyIcon className="success-copy-icon" />
                )}
              </Button>
            </div>
          </div>

          {driver ? (
            <div className="success-copy-block">
              <div className="success-copy-label">Driver</div>
              <p className="success-driver-name">{driverLabel}</p>
              <div className="success-copy-label success-copy-label-spaced">Phone</div>
              <div className="success-copy-row">
                <span className="success-phone">{driver.phone}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="success-copy-btn success-copy-btn-icon"
                  aria-label={copied === 'phone' ? 'Copied phone number' : 'Copy phone number'}
                  onClick={() => void handleCopy('phone', driver.phone)}
                >
                  {copied === 'phone' ? (
                    <CheckIcon className="success-copy-icon is-success" />
                  ) : (
                    <CopyIcon className="success-copy-icon" />
                  )}
                </Button>
              </div>
              {driver.email ? (
                <>
                  <div className="success-copy-label success-copy-label-spaced">Email</div>
                  <p className="success-email">{driver.email}</p>
                </>
              ) : null}
            </div>
          ) : null}

          {data.assignmentMessage ? (
            <p className="booking-success-note">{data.assignmentMessage}</p>
          ) : null}

          <div className="success-actions">
            <Button
              type="button"
              variant="secondary"
              className="success-copy-all"
              onClick={() => void handleCopy('all', summary)}
            >
              {copied === 'all' ? (
                <>
                  <CheckIcon className="success-copy-icon is-success" /> Copied summary
                </>
              ) : (
                <>
                  <CopyIcon className="success-copy-icon" /> Copy all details
                </>
              )}
            </Button>
            <Button type="button" className="success-book-again" onClick={onBookAnother}>
              Book another ride
            </Button>
          </div>
        </article>
      </section>
    </main>
  )
}
