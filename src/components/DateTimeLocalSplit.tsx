import { Input } from '@/components/ui/input'
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
}: DateTimeLocalSplitProps) {
  const { date, time } = splitDateTimeLocal(value)
  const timeSelectOptions = timeOptionsForSelect(time)

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
            onChange={(e) => {
              const nextDate = e.target.value
              if (!nextDate) {
                onChange('')
                return
              }
              const t = time || '09:00'
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
            const d = date || todayYmdLocal()
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
