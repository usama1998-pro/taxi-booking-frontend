import type { Booking } from '@/types/booking'
import { PUBLIC_SITE_URL } from '@/lib/brandConfig'
import { bookingFlightLine, bookingFromDisplay, bookingToDisplay } from '@/lib/bookingFormatDisplay'

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** Display id for modal title (API has no internal numeric id). */
export function reservationDisplayNumber(b: Booking): string {
  const digits = b.bookingReference.replace(/\D/g, '')
  if (digits.length >= 4) {
    return digits.length <= 6 ? digits : digits.slice(-6)
  }
  const hex = b.uuid.replace(/-/g, '').slice(0, 10)
  const n = Number.parseInt(hex, 16)
  if (Number.isFinite(n)) {
    return String(n % 1_000_000)
  }
  return b.uuid.slice(0, 8).toUpperCase()
}

export function formatPickupDateLocal(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function formatPickupTimeLocal24(iso: string): string {
  const d = new Date(iso)
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function formatFooterTimestamp(iso: string): string {
  const d = new Date(iso)
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function bookingPickupAddress(b: Booking): string {
  return bookingFromDisplay(b)
}

export function bookingDropoffAddress(b: Booking): string {
  return bookingToDisplay(b)
}

export function bookingArrivalAirline(b: Booking): string | null {
  const line = bookingFlightLine(b)
  return line?.airline?.trim() ? line.airline : null
}

export function bookingArrivalFlight(b: Booking): string | null {
  const line = bookingFlightLine(b)
  if (!line) {
    return null
  }
  const f = line.flight.trim()
  if (!f || f === '—') {
    return null
  }
  return f
}

export function publicBookingPageUrl(uuid: string): string {
  const raw = import.meta.env.VITE_PUBLIC_BOOKING_SITE_URL as string | undefined
  const base = (raw ?? PUBLIC_SITE_URL).replace(/\/$/, '')
  return `${base}/booking/${uuid}`
}

export function qrCodeImageUrl(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(data)}`
}
