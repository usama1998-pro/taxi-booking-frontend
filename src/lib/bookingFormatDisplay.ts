import type { Booking } from '@/types/booking'

function formatLocationJson(value: unknown): string {
  if (value == null) {
    return '—'
  }
  if (typeof value === 'string') {
    return value || '—'
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    const label =
      (typeof o.label === 'string' && o.label) ||
      (typeof o.address === 'string' && o.address) ||
      (typeof o.formattedAddress === 'string' && o.formattedAddress) ||
      (typeof o.name === 'string' && o.name)
    if (label) {
      return label
    }
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function readLocationJson(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return null
}

/** Place name from pickup JSON (`label` / `name` only — matches backend storage). */
function pickupLocationNameOnly(value: unknown): string {
  if (value == null) {
    return '—'
  }
  if (typeof value === 'string') {
    const s = value.trim()
    return s || '—'
  }
  const o = readLocationJson(value)
  if (o) {
    const name =
      (typeof o.label === 'string' && o.label.trim()) ||
      (typeof o.name === 'string' && o.name.trim())
    if (name) {
      return name
    }
  }
  return '—'
}

export function bookingPickupLabel(b: Booking): string {
  return pickupLocationNameOnly(b.pickupLocation)
}

export function bookingDropoffLabel(b: Booking): string {
  return formatLocationJson(b.dropoffLocation)
}

/** Pickup line — place name only (no meeting point / street suffix). */
export function bookingFromDisplay(b: Booking): string {
  return pickupLocationNameOnly(b.pickupLocation)
}

/** "To :" line */
export function bookingToDisplay(b: Booking): string {
  return bookingDropoffLabel(b)
}

export type BookingFlightLine = { flight: string; airline?: string }

export function bookingFlightLine(b: Booking): BookingFlightLine | null {
  const loc = b.pickupLocation
  if (typeof loc === 'object' && loc !== null && !Array.isArray(loc)) {
    const o = loc as Record<string, unknown>
    const airline = typeof o.airline === 'string' ? o.airline.trim() : ''
    const flight = typeof o.flight === 'string' ? o.flight.trim() : ''
    if (airline || flight) {
      return { flight: flight || '—', airline: airline || undefined }
    }
  }
  const fn = b.flightNumber?.trim()
  if (fn) {
    return { flight: fn }
  }
  return null
}

/** App vs email booking heuristic for list icon. */
export function bookingSourceIsGuestApp(b: Booking): boolean {
  const email = (b.customerEmail || b.user?.email || '').toLowerCase()
  return email.includes('@taxibarcelona24.guest')
}

export function bookingPassengerLabel(b: Booking): string {
  return (
    b.customerName?.trim() ||
    b.user?.fullName?.trim() ||
    b.customerEmail ||
    b.user?.email ||
    'Passenger'
  )
}

/** Human-readable child seat request for drivers and summaries. */
export function bookingChildSeatsSummary(b: Booking): string | null {
  const infant = b.infantCarrierCount ?? 0
  const child = b.childSeatCount ?? 0
  const booster = b.boosterCount ?? 0
  if (infant === 0 && child === 0 && booster === 0) {
    return null
  }
  const parts: string[] = []
  if (infant > 0) {
    parts.push(`${infant} infant carrier${infant === 1 ? '' : 's'}`)
  }
  if (child > 0) {
    parts.push(`${child} child seat${child === 1 ? '' : 's'}`)
  }
  if (booster > 0) {
    parts.push(`${booster} booster${booster === 1 ? '' : 's'}`)
  }
  return parts.join(', ')
}
