import { useEffect } from 'react'

import { Input } from '@/components/ui/input'
import { isPickupDatetimeInPast } from '@/lib/bookingDateTime'
import { cn } from '@/lib/utils'

/** Every 15 minutes, 00:00–23:45 */
const PICKUP_TIME_OPTIONS: string[] = (() => {
  const out: string[] = []
  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += 15) {
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return out
})()

function formatTimeOptionLabel(t: string): string {
  if (!/^\d{2}:\d{2}$/.test(t)) {
    return t
  }
  const [hh, mm] = t.split(':').map(Number)
  const d = new Date()
  d.setHours(hh, mm, 0, 0)
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(d)
  } catch {
    return t
  }
}

function timeOptionsForSelect(currentTime: string): string[] {
  if (currentTime && /^\d{2}:\d{2}$/.test(currentTime) && !PICKUP_TIME_OPTIONS.includes(currentTime)) {
    return [currentTime, ...PICKUP_TIME_OPTIONS].sort()
  }
  return PICKUP_TIME_OPTIONS
}

/** `YYYY-MM-DDTHH:mm` from `<input type="datetime-local" />` */
export function splitDateTimeLocal(value: string | undefined): { date: string; time: string } {
  const v = (value ?? '').trim()
  if (!v) {
    return { date: '', time: '' }
  }
  const [d, rest] = v.split('T')
  if (!d) {
    return { date: '', time: '' }
  }
  const timePart = (rest ?? '').slice(0, 5)
  return { date: d, time: /^\d{2}:\d{2}$/.test(timePart) ? timePart : '' }
}

export function joinDateTimeLocal(date: string, time: string): string {
  const d = date.trim()
  if (!d) {
    return ''
  }
  const raw = time.trim()
  const t = /^\d{2}:\d{2}$/.test(raw) ? raw : '09:00'
  return `${d}T${t}`
}

export function todayYmdLocal(): string {
  const n = new Date()
  const y = n.getFullYear()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const day = String(n.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function timeToMinutes(t: string): number {
  const [hh, mm] = t.split(':').map(Number)
  return hh * 60 + mm
}

/** Next 15-minute slot at or after now (local). */
export function earliestSelectableTimeToday(): string {
  const n = new Date()
  const total = n.getHours() * 60 + n.getMinutes()
  const next = Math.ceil(total / 15) * 15
  if (next >= 24 * 60) {
    return '23:45'
  }
  const h = Math.floor(next / 60)
  const m = next % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function filterFutureTimeOptions(date: string, options: string[]): string[] {
  if (date !== todayYmdLocal()) {
    return options
  }
  const min = earliestSelectableTimeToday()
  const minMins = timeToMinutes(min)
  return options.filter((t) => timeToMinutes(t) >= minMins)
}

type DateTimeLocalSplitProps = {
  value: string
  onChange: (next: string) => void
  inputClassName?: string
  /** `quote` — compact labels; `booking` — matches booking form labels */
  variant?: 'quote' | 'booking'
  dateLabel?: string
  timeLabel?: string
  /** When true, only the time dropdown is shown; date is kept from `value` (or today if missing). */
  hideDate?: boolean
  /** Block calendar dates before today and past time slots on today. */
  disallowPast?: boolean
}

/**
 * Date (optional) + time dropdown, merged as one `datetime-local` string for APIs/forms.
 */
export function DateTimeLocalSplit({
  value,
  onChange,
  inputClassName,
  variant = 'quote',
  dateLabel = 'Pickup date',
  timeLabel = 'Pickup time',
  hideDate = false,
  disallowPast = true,
}: DateTimeLocalSplitProps) {
  const { date, time } = splitDateTimeLocal(value)
  const minDate = disallowPast ? todayYmdLocal() : undefined
  let timeSelectOptions = timeOptionsForSelect(time)
  if (disallowPast && date) {
    timeSelectOptions = filterFutureTimeOptions(date, timeSelectOptions)
  }

  useEffect(() => {
    if (!disallowPast) {
      return
    }
    const today = todayYmdLocal()
    const effectiveDate = date || (hideDate ? today : '')
    if (!effectiveDate) {
      return
    }

    let nextValue: string | null = null
    if (effectiveDate < today) {
      const allowed = filterFutureTimeOptions(today, PICKUP_TIME_OPTIONS)
      nextValue = joinDateTimeLocal(today, allowed[0] ?? earliestSelectableTimeToday())
    } else if (value.trim() && isPickupDatetimeInPast(value)) {
      const allowed = filterFutureTimeOptions(effectiveDate, PICKUP_TIME_OPTIONS)
      nextValue = joinDateTimeLocal(
        effectiveDate,
        allowed[0] ?? earliestSelectableTimeToday(),
      )
    }

    if (nextValue && nextValue !== value) {
      onChange(nextValue)
    }
  }, [date, disallowPast, hideDate, onChange, time, value])

  return (
    <div
      className={cn(
        'datetime-split',
        variant === 'booking' && 'datetime-split--booking',
        hideDate && 'datetime-split--time-only',
      )}
      role="group"
    >
      {hideDate ? null : (
        <label className="datetime-split-cell">
          <span className={cn('datetime-split-label', variant === 'booking' && 'datetime-split-label--booking')}>
            {dateLabel}
          </span>
          <Input
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => {
              const nextDate = e.target.value
              if (!nextDate) {
                onChange('')
                return
              }
              let t = time || earliestSelectableTimeToday()
              if (disallowPast && nextDate === todayYmdLocal()) {
                const allowed = filterFutureTimeOptions(nextDate, PICKUP_TIME_OPTIONS)
                if (allowed.length > 0 && !allowed.includes(t)) {
                  t = allowed[0]!
                }
              }
              onChange(joinDateTimeLocal(nextDate, t))
            }}
            className={inputClassName}
          />
        </label>
      )}
      <label className="datetime-split-cell">
        <span className={cn('datetime-split-label', variant === 'booking' && 'datetime-split-label--booking')}>
          {timeLabel}
        </span>
        <select
          className={cn(inputClassName, 'datetime-split-select')}
          value={timeSelectOptions.includes(time) ? time : ''}
          onChange={(e) => {
            const nextTime = e.target.value
            if (!nextTime) {
              if (date) {
                onChange(joinDateTimeLocal(date, '09:00'))
              } else {
                onChange('')
              }
              return
            }
            let d = date || todayYmdLocal()
            if (disallowPast && d < todayYmdLocal()) {
              d = todayYmdLocal()
            }
            onChange(joinDateTimeLocal(d, nextTime))
          }}
          aria-label={timeLabel}
        >
          <option value="">Select time</option>
          {timeSelectOptions.map((slot) => (
            <option key={slot} value={slot}>
              {formatTimeOptionLabel(slot)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
