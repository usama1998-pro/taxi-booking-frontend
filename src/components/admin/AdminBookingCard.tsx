import { Eye, Plane, Trash2, Users } from 'lucide-react'

import {
  bookingFromDisplay,
  bookingPassengerLabel,
  bookingToDisplay,
} from '@/lib/bookingFormatDisplay'
import type { Booking } from '@/types/booking'

import { BookingSourceIcon } from './BookingSourceIcon'
import './AdminBookingCard.css'

function formatListTime24(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

type Props = {
  booking: Booking
  /** `YYYY-MM-DD` for the grey card header strip. */
  dateDayKey: string
  onNotes: () => void
  onView: () => void
  onDelete: () => void
}

export function AdminBookingCard({ booking, dateDayKey, onNotes, onView, onDelete }: Props) {
  const passenger = bookingPassengerLabel(booking)

  return (
    <article className="admin-booking-card">
      <div className="admin-booking-card__date-strip">{dateDayKey}</div>
      <div className="admin-booking-card__main">
        <div className="admin-booking-card__body-row">
          <div className="admin-booking-card__time-col">
            <span className="admin-booking-card__time24">{formatListTime24(booking.scheduledTime)}</span>
          </div>
          <div className="admin-booking-card__detail-col">
            <div className="admin-booking-card__name-row">
              <div className="admin-booking-card__name">{passenger}</div>
              <BookingSourceIcon booking={booking} size={22} strokeWidth={2} />
            </div>
            <p className="admin-booking-card__route">
              <span className="admin-booking-card__route-prefix">From : </span>
              {bookingFromDisplay(booking)}
            </p>
            <p className="admin-booking-card__route">
              <span className="admin-booking-card__route-prefix">To : </span>
              {bookingToDisplay(booking)}
            </p>
            <div className="admin-booking-card__actions">
              <span className="admin-booking-card__pax" aria-label={`${booking.passengerCount} passengers`}>
                <Users size={18} strokeWidth={1.75} className="admin-booking-card__pax-icon" />
                <span className="admin-booking-card__pax-num">{booking.passengerCount}</span>
              </span>
              <button type="button" className="admin-booking-card__btn-notes" onClick={onNotes}>
                Notes
              </button>
              <button
                type="button"
                className="admin-booking-card__btn-view"
                onClick={onView}
                aria-label="View booking"
              >
                <Eye size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="admin-booking-card__btn-delete"
                onClick={onDelete}
                aria-label="Delete booking"
              >
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Red plane mark for the shell navbar (same visual language as the reference). */
export function AdminBookingsBrandPlane() {
  return (
    <span className="admin-bookings-shell__plane-wrap" aria-hidden>
      <Plane className="admin-bookings-shell__plane" size={26} strokeWidth={2} />
    </span>
  )
}
