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

function guestAppEmail(email: string): boolean {
  return email.startsWith('guest.') && email.endsWith('@taxibarcelona24.guest')
}

/** Reservation created in the mobile app (guest email from phone). */
export function isAppBooking(b: Booking): boolean {
  const email = (b.customerEmail || b.user?.email || '').toLowerCase()
  return guestAppEmail(email)
}

/** Reservation imported from a Viator booking email (BR- reference or tagged note). */
export function isViatorEmailBooking(b: Booking): boolean {
  const email = (b.customerEmail || b.user?.email || '').toLowerCase()
  if (guestAppEmail(email)) {
    return false
  }
  if (email.startsWith('viator.')) {
    return true
  }
  const note = (b.note ?? '').trim()
  if (note.startsWith('[Viator')) {
    return true
  }
  const ref = (b.bookingReference ?? '').trim().toUpperCase()
  return ref.startsWith('BR-')
}

/** Reservation submitted via the public website (real customer email). */
export function isWebsiteBooking(b: Booking): boolean {
  return !isViatorEmailBooking(b) && !isAppBooking(b)
}

export type BookingSourceIcon = 'mail' | 'smartphone' | 'globe'

/** Viator email vs app vs website icon on list cards. */
export function bookingSourceIcon(b: Booking): BookingSourceIcon {
  if (isViatorEmailBooking(b)) {
    return 'mail'
  }
  if (isAppBooking(b)) {
    return 'smartphone'
  }
  return 'globe'
}

export function bookingSourceAccessibilityLabel(b: Booking): string {
  if (isViatorEmailBooking(b)) {
    return 'Viator email booking'
  }
  if (isAppBooking(b)) {
    return 'App booking'
  }
  return 'Website booking'
}

/** List card tint per booking source. */
export function bookingSourceIconColor(b: Booking): string {
  if (isViatorEmailBooking(b)) {
    return '#1E88E5'
  }
  if (isAppBooking(b)) {
    return '#43A047'
  }
  return '#F57C00'
}

/** Header + section bar color on the booking detail screen. */
export function bookingDetailAccentColor(b: Booking): string {
  if (isAppBooking(b)) {
    return '#43A047'
  }
  if (isViatorEmailBooking(b)) {
    return '#1E88E5'
  }
  if (isWebsiteBooking(b)) {
    return '#F57C00'
  }
  return '#2196F3'
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
