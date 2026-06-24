import type { ReactNode } from 'react'
import { Loader2, X } from 'lucide-react'

import { bookingDetailAccentColor, bookingPassengerLabel } from '@/lib/bookingFormatDisplay'
import { PUBLIC_SITE_DISPLAY } from '@/lib/brandConfig'
import {
  bookingArrivalAirline,
  bookingArrivalFlight,
  bookingDropoffAddress,
  bookingPickupAddress,
  formatFooterTimestamp,
  formatPickupDateLocal,
  formatPickupTimeLocal24,
  publicBookingPageUrl,
  qrCodeImageUrl,
  reservationDisplayNumber,
} from '@/lib/reservationDetailFormat'
import type { Booking } from '@/types/booking'

import { BookingSourceIcon } from './BookingSourceIcon'
import './AdminReservationDetailModal.css'

import './AdminReservationDetailModal.css'

type Props = {
  open: boolean
  loading: boolean
  error: string | null
  booking: Booking | null
  onClose: () => void
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="admin-res-detail__row">
      <span className="admin-res-detail__label">{label}</span>
      <span className="admin-res-detail__value">{children}</span>
    </div>
  )
}

export function AdminReservationDetailModal({
  open,
  loading,
  error,
  booking,
  onClose,
}: Props) {
  if (!open) {
    return null
  }

  const pageUrl = booking ? publicBookingPageUrl(booking.uuid) : ''
  const footerTs = booking ? formatFooterTimestamp(booking.createdAt) : ''
  const accentColor = booking ? bookingDetailAccentColor(booking) : '#29b6f6'

  return (
    <div className="admin-res-detail-overlay" role="presentation" onClick={onClose}>
      <div
        className="admin-res-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-res-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className={`admin-res-detail__header${booking && !loading && !error ? ' admin-res-detail__header--accent' : ''}`}
          style={booking && !loading && !error ? { backgroundColor: accentColor } : undefined}
        >
          <h2 id="admin-res-detail-title" className="admin-res-detail__title">
            {booking && !loading && !error ? (
              <span className="admin-res-detail__title-row">
                <span>RES # {reservationDisplayNumber(booking)}</span>
                <BookingSourceIcon booking={booking} size={22} strokeWidth={2} color="#fff" />
              </span>
            ) : (
              <>Reservation</>
            )}
          </h2>
          <button
            type="button"
            className={`admin-res-detail__close-x${booking && !loading && !error ? ' admin-res-detail__close-x--on-accent' : ''}`}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </header>

        <div className="admin-res-detail__body">
          {loading ? (
            <div className="admin-res-detail__loading">
              <Loader2 className="admin-res-detail__spinner" size={36} strokeWidth={2} />
            </div>
          ) : error ? (
            <p className="admin-res-detail__error">{error}</p>
          ) : booking ? (
            <>
              <section className="admin-res-detail__section">
                <div className="admin-res-detail__section-head" style={{ backgroundColor: accentColor }}>
                  Pickup Information
                </div>
                <div className="admin-res-detail__section-body">
                  <Row label="Pickup Address:">{bookingPickupAddress(booking)}</Row>
                  <Row label="Passengers:">{booking.passengerCount}</Row>
                  <Row label="Pickup Date:">{formatPickupDateLocal(booking.scheduledTime)}</Row>
                  <Row label="Pickup Time:">{formatPickupTimeLocal24(booking.scheduledTime)}</Row>
                  <Row label="Arrival Airline:">{bookingArrivalAirline(booking) ?? '—'}</Row>
                  <Row label="Arrival Flight:">{bookingArrivalFlight(booking) ?? '—'}</Row>
                </div>
              </section>

              <section className="admin-res-detail__section">
                <div className="admin-res-detail__section-head" style={{ backgroundColor: accentColor }}>
                  Dropoff Information
                </div>
                <div className="admin-res-detail__section-body">
                  <Row label="Dropoff Address:">{bookingDropoffAddress(booking)}</Row>
                </div>
              </section>

              <section className="admin-res-detail__section">
                <div className="admin-res-detail__section-head" style={{ backgroundColor: accentColor }}>
                  Customer Information
                </div>
                <div className="admin-res-detail__section-body">
                  <Row label="Customer Name:">{bookingPassengerLabel(booking)}</Row>
                  <Row label="Phone number:">
                    {booking.customerPhone?.trim() || booking.user?.phone?.trim() ? (
                      <a
                        className="admin-res-detail__tel"
                        href={`tel:${(booking.customerPhone || booking.user?.phone || '').replace(/\s/g, '')}`}
                      >
                        {booking.customerPhone?.trim() || booking.user?.phone}
                      </a>
                    ) : (
                      '—'
                    )}
                  </Row>
                  <Row label="Booking Ref:">{booking.bookingReference}</Row>
                </div>
              </section>

              <div className="admin-res-detail__footer-meta">
                <img
                  className="admin-res-detail__qr"
                  src={qrCodeImageUrl(pageUrl)}
                  alt=""
                  width={90}
                  height={90}
                  loading="lazy"
                />
                <span className="admin-res-detail__site">{PUBLIC_SITE_DISPLAY}</span>
                <span className="admin-res-detail__stamp">{footerTs}</span>
              </div>
            </>
          ) : null}
        </div>

        <footer className="admin-res-detail__footer">
          <button type="button" className="admin-res-detail__btn-close" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}
