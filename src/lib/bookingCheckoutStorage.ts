import type { QuoteFormValues } from '@/components/QuoteForm'
import type { BookingSuccessPayload, PendingBookingPayload } from '@/lib/bookingsApi'

const PENDING_KEY = 'taxi_booking_pending_checkout'
const SUCCESS_KEY = 'taxi_booking_success'
const DRAFT_QUOTE_KEY = 'taxi_booking_draft_quote'

/** Client routes — ensure SPA fallback (see public/.htaccess, vercel.json). */
export const BOOKING_ROUTES = {
  home: '/',
  details: '/booking/details',
  payment: '/booking/payment',
  successPrefix: '/booking/success',
  adminPrefix: '/admin',
} as const

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

export function clearBookingCheckoutSession(): void {
  clearPendingBooking()
  clearBookingSuccess()
  clearDraftQuote()
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

export function bookingDetailsPath(): string {
  return BOOKING_ROUTES.details
}

export function bookingPaymentPath(): string {
  return BOOKING_ROUTES.payment
}

export function saveDraftQuote(values: QuoteFormValues): void {
  try {
    sessionStorage.setItem(DRAFT_QUOTE_KEY, JSON.stringify(values))
  } catch {
    // ignore quota / private mode
  }
}

export function loadDraftQuote(): QuoteFormValues | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_QUOTE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as QuoteFormValues
  } catch {
    return null
  }
}

export function clearDraftQuote(): void {
  try {
    sessionStorage.removeItem(DRAFT_QUOTE_KEY)
  } catch {
    // ignore
  }
}
