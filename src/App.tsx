import { useCallback, useEffect, useState } from 'react'

import { BookingDetailsPage } from '@/components/BookingDetailsPage'
import { BookingPaymentPage } from '@/components/BookingPaymentPage'
import { BookingSuccessPage } from '@/components/BookingSuccessPage'
import { AdminPortal } from '@/components/AdminPortal'
import {
  createBookingFromForms,
  type BookingSuccessPayload,
  type PendingBookingPayload,
} from '@/lib/bookingsApi'
import {
  bookingDetailsPath,
  bookingPaymentPath,
  bookingSuccessPath,
  clearBookingCheckoutSession,
  clearDraftQuote,
  clearPendingBooking,
  loadBookingSuccess,
  loadDraftQuote,
  loadPendingBooking,
  saveBookingSuccess,
  saveDraftQuote,
  savePendingBooking,
} from '@/lib/bookingCheckoutStorage'
import { navigateTo, replaceLocation } from '@/lib/bookingNavigation'
import { capturePayPalOrder } from '@/lib/paymentsApi'
import { QuoteForm, type QuoteFormValues } from '@/components/QuoteForm'
import { SiteFooter } from '@/components/SiteFooter'
import './App.css'

const HERO_BG_IMAGES = [
  '/assets/barcelona.jpg',
  '/assets/barcelona2.jpg',
  '/assets/barcelona3.jpg',
] as const

const HERO_BG_INTERVAL_MS = 5500

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [heroBgIndex, setHeroBgIndex] = useState(0)
  const [draftQuote, setDraftQuote] = useState<QuoteFormValues | null>(() => loadDraftQuote())
  const [pendingBooking, setPendingBooking] = useState<PendingBookingPayload | null>(() =>
    loadPendingBooking(),
  )
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccessPayload | null>(() =>
    loadBookingSuccess(),
  )
  const [paypalReturnMessage, setPaypalReturnMessage] = useState<string | null>(null)
  const [isPaypalReturnProcessing, setIsPaypalReturnProcessing] = useState(false)

  const handlePathChange = useCallback((path: string) => {
    setPathname(path)
  }, [])

  const completeBookingSuccess = useCallback(
    (payload: BookingSuccessPayload) => {
      clearPendingBooking()
      saveBookingSuccess(payload)
      setPendingBooking(null)
      setBookingSuccess(payload)
      setPaypalReturnMessage(null)
      replaceLocation(bookingSuccessPath(payload.uuid), handlePathChange)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [handlePathChange],
  )

  const resetBookingFlow = useCallback(() => {
    clearBookingCheckoutSession()
    setBookingSuccess(null)
    setPendingBooking(null)
    setDraftQuote(null)
    setPaypalReturnMessage(null)
    replaceLocation('/', handlePathChange)
  }, [handlePathChange])

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/booking/success') && !bookingSuccess) {
      const stored = loadBookingSuccess()
      if (stored) {
        setBookingSuccess(stored)
      }
    }
  }, [pathname, bookingSuccess])

  useEffect(() => {
    if (pathname === bookingPaymentPath() && !pendingBooking) {
      const stored = loadPendingBooking()
      if (stored) {
        setPendingBooking(stored)
      }
    }
  }, [pathname, pendingBooking])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paypalFlow = params.get('paypal')
    if (paypalFlow === 'cancel') {
      setPaypalReturnMessage('PayPal checkout was cancelled. You can try again or choose card payment.')
      replaceLocation(bookingPaymentPath(), handlePathChange)
      return
    }
    if (paypalFlow !== 'return') {
      return
    }

    const orderId = params.get('token')
    if (!orderId) {
      setPaypalReturnMessage('PayPal did not return a payment reference. Please try again.')
      replaceLocation(bookingPaymentPath(), handlePathChange)
      return
    }

    const pending = loadPendingBooking()
    if (!pending) {
      setPaypalReturnMessage(
        'Your checkout session expired after PayPal login. Please enter your trip details again.',
      )
      replaceLocation('/', handlePathChange)
      return
    }

    let cancelled = false
    setPendingBooking(pending)
    setIsPaypalReturnProcessing(true)
    setPaypalReturnMessage(null)

    void (async () => {
      try {
        await capturePayPalOrder(orderId)
        const result = await createBookingFromForms(pending.quote, pending.details)
        if (cancelled) return
        completeBookingSuccess({
          uuid: result.uuid,
          assignmentMessage: result.assignmentMessage,
          driver: result.driver,
          childSeatsSummary: result.childSeatsSummary,
        })
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error ? err.message : 'Could not confirm your booking after PayPal payment.'
        setPaypalReturnMessage(message)
        replaceLocation(bookingPaymentPath(), handlePathChange)
      } finally {
        if (!cancelled) {
          setIsPaypalReturnProcessing(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [completeBookingSuccess, handlePathChange])

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroBgIndex((i) => (i + 1) % HERO_BG_IMAGES.length)
    }, HERO_BG_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  if (pathname.startsWith('/admin')) {
    return <AdminPortal />
  }

  if (isPaypalReturnProcessing) {
    return (
      <main className="booking-page">
        <section className="booking-container">
          <p className="booking-payment-loading booking-field-full">
            Payment received — confirming your booking…
          </p>
        </section>
      </main>
    )
  }

  if (bookingSuccess || pathname.startsWith('/booking/success')) {
    const successData = bookingSuccess ?? loadBookingSuccess()
    if (!successData) {
      return (
        <main className="booking-page">
          <section className="booking-container">
            <p className="booking-payment-unavailable">
              Booking reference not found. Please check your confirmation email or book again.
            </p>
            <button type="button" className="booking-submit" onClick={resetBookingFlow}>
              Back to home
            </button>
          </section>
        </main>
      )
    }
    return <BookingSuccessPage data={successData} onBookAnother={resetBookingFlow} />
  }

  if (pendingBooking || pathname === bookingPaymentPath()) {
    const activePending = pendingBooking ?? loadPendingBooking()
    if (!activePending) {
      return (
        <main className="booking-page">
          <section className="booking-container">
            <p className="booking-payment-unavailable">
              Checkout session not found. Continue from the booking form.
            </p>
            <button type="button" className="booking-submit" onClick={resetBookingFlow}>
              Back to home
            </button>
          </section>
        </main>
      )
    }
    return (
      <BookingPaymentPage
        pending={activePending}
        paypalReturnMessage={paypalReturnMessage}
        onBack={() => {
          setPaypalReturnMessage(null)
          replaceLocation(bookingDetailsPath(), handlePathChange)
        }}
        onBookingSuccess={completeBookingSuccess}
      />
    )
  }

  if (pathname === bookingDetailsPath()) {
    const activeQuote = draftQuote ?? loadDraftQuote()
    if (!activeQuote) {
      return (
        <main className="booking-page">
          <section className="booking-container">
            <p className="booking-payment-unavailable">
              Trip details not found. Start from the booking form on the home page.
            </p>
            <button type="button" className="booking-submit" onClick={resetBookingFlow}>
              Back to home
            </button>
          </section>
        </main>
      )
    }
    return (
      <BookingDetailsPage
        quote={activeQuote}
        onBack={() => {
          clearDraftQuote()
          setDraftQuote(null)
          replaceLocation('/', handlePathChange)
        }}
        onContinueToPayment={(payload) => {
          savePendingBooking(payload)
          setPendingBooking(payload)
          navigateTo(bookingPaymentPath(), handlePathChange)
        }}
      />
    )
  }

  return (
    <main className="page">
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">
            <span className="brand-name">BarcelonaTaxi24</span>
          </div>
          <nav className="nav-menu" aria-label="Primary">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="layout">
        <div className="hero-backdrop" aria-hidden="true">
          <div className="hero-bg-crossfade">
            <div className="hero-bg-slides">
              {HERO_BG_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={i === heroBgIndex ? 'is-active' : ''}
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                />
              ))}
            </div>
            <div className="hero-bg-overlay" />
          </div>
        </div>

        <section className="hero-section">
          <div className="hero-left">
            <div className="hero-body">
              <h1>Barcelona Airport Taxi</h1>

              <ul className="benefits">
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="9" r="5" />
                      <path d="M9 14l3 6 3-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2>Trained Drivers</h2>
                  <p>
                    Hand picked, English-speaking drivers. Licensed, insured, and familiar with
                    Barcelona airport and city routes.
                  </p>
                </li>
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                      <path d="M7 10h10M7 14h6" />
                    </svg>
                  </span>
                  <h2>Low Prices</h2>
                  <p>
                    Same price as a regular taxi from the line. Fixed prepaid fares with no surge
                    pricing or hidden fees.
                  </p>
                </li>
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>
                  <h2>Flight Monitoring</h2>
                  <p>
                    We track your flight live and adjust pickup if you are delayed, so your driver
                    is ready when you land.
                  </p>
                </li>
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 14v2a3 3 0 003 3h1M20 14v2a3 3 0 01-3 3h-1M7 14a5 5 0 0110 0v5H7v-5z"
                      />
                    </svg>
                  </span>
                  <h2>Quality Support</h2>
                  <p>
                    24/7 email and phone support before, during, and after your trip. Help is always
                    one message away.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="content-column">
          <section className="info-section">
            <article className="article-card">
              <h2>We provide an easy, friendly and personalized travel experience</h2>
              <p>
                We are an affordable airport transfers company to and from Barcelona International
                El Prat Airport. We also provide inter-city transfers from Barcelona to any city in
                Spain and across the Europe by private taxi.
              </p>
              <p>
                If you are planning a trip to Barcelona either alone, with family or for business,
                don&apos;t worry, we&apos;ve got you covered. We want you to enjoy what really
                matters and gives you a stress-free travel experience.
              </p>
              <p>
                Our qualified and local English-speaking drivers will ensure that you arrive safely
                to your hotel or destination.
              </p>
              <p>
                With Taxi Barcelonas you can get everything at one place whether you need a taxi to
                pick you up quickly, a transfer to or from the airport, or a premium taxi and
                professional chauffeur to get you to your next meeting.
              </p>
              <ul className="service-highlights">
                <li>24/7 service and customer support in Barcelona.</li>
                <li>Pickup in the arrival&apos;s hall of the airport. (Meet &amp; Greet)</li>
                <li>Premium official Barcelona taxi sedans and minivans.</li>
                <li>Fixed and prepaid tariff on all rides.</li>
              </ul>
              <p>
                Your chauffeur will be waiting for you upon arrival at Barcelona International El
                Prat Airport with a name sign. Our driver will track the flight. If it&apos;s
                delayed, they&apos;ll wait.
              </p>
              <p>
                All of our rates are fixed and prepaid so you will be able to calculate how much it
                will exactly cost you for your trip.
              </p>
            </article>
          </section>
        </div>

        <QuoteForm
          initialValues={draftQuote}
          onContinue={(values) => {
            setDraftQuote(values)
            saveDraftQuote(values)
            navigateTo(bookingDetailsPath(), handlePathChange)
          }}
        />
      </section>

      <SiteFooter />
    </main>
  )
}

export default App
