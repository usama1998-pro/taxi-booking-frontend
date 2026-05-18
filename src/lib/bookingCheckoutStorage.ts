import type { BookingSuccessPayload, PendingBookingPayload } from '@/lib/bookingsApi'

const PENDING_KEY = 'taxi_booking_pending_checkout'
const SUCCESS_KEY = 'taxi_booking_success'

export function savePendingBooking(payload: PendingBookingPayload): void {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}

export function loadPendingBooking(): PendingBookingPayload | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PendingBookingPayload
  } catch {
    return null
  }
}

export function clearPendingBooking(): void {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // ignore
  }
}

export function saveBookingSuccess(payload: BookingSuccessPayload): void {
  try {
    sessionStorage.setItem(SUCCESS_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

export function loadBookingSuccess(): BookingSuccessPayload | null {
  try {
    const raw = sessionStorage.getItem(SUCCESS_KEY)
    if (!raw) return null
    return JSON.parse(raw) as BookingSuccessPayload
  } catch {
    return null
  }
}

export function clearBookingSuccess(): void {
  try {
    sessionStorage.removeItem(SUCCESS_KEY)
  } catch {
    // ignore
  }
}

export function bookingRefFromUuid(uuid: string): string {
  return `BK-${uuid}`
}

export function bookingSuccessPath(uuid: string): string {
  const ref = encodeURIComponent(bookingRefFromUuid(uuid))
  return `/booking/success?ref=${ref}`
}

export function bookingPaymentPath(): string {
  return '/booking/payment'
}
