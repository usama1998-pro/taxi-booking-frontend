import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

import { BrandLogoIcon } from '@/components/BrandLogoIcon'
import { Button } from '@/components/ui/button'
import {
  createBookingFromForms,
  type BookingSuccessPayload,
  type PendingBookingPayload,
} from '@/lib/bookingsApi'
import { formatEurBase } from '@/lib/displayCurrency'
import { isPickupDatetimeInPast, PICKUP_IN_PAST_MESSAGE } from '@/lib/bookingDateTime'
import { bookingPaymentPath, savePendingBooking } from '@/lib/bookingCheckoutStorage'
import { isPayPalConfigured } from '@/lib/paypalConfig'
import {
  capturePayPalOrder,
  createPayPalOrder,
  createStripePaymentIntent,
} from '@/lib/paymentsApi'

type BookingPaymentPageProps = {
  pending: PendingBookingPayload
  paypalReturnMessage?: string | null
  onBack: () => void
  onBookingSuccess: (payload: BookingSuccessPayload) => void
}

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim()
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

function formatRouteDate(datetimeLocalValue: string | undefined): string {
  if (!datetimeLocalValue) {
    return 'As soon as possible'
  }
  const date = new Date(datetimeLocalValue)
  if (Number.isNaN(date.getTime())) {
    return datetimeLocalValue
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function StripeCardCheckout({
  disabled,
  onPaid,
  onError,
}: {
  disabled: boolean
  onPaid: () => Promise<void>
  onError: (message: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isPaying, setIsPaying] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!stripe || !elements || disabled || isPaying) {
      return
    }

    setIsPaying(true)
    onError('')

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      onError(error.message ?? 'Card payment failed.')
      setIsPaying(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      try {
        await onPaid()
      } catch {
        setIsPaying(false)
      }
      return
    }

    onError('Card payment was not completed. Please try again.')
    setIsPaying(false)
  }

  return (
    <form className="booking-payment-stripe-form" onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        className="booking-submit booking-payment-stripe-submit"
        disabled={disabled || isPaying || !stripe || !elements}
      >
        {isPaying ? 'Processing card…' : 'Pay with card'}
      </Button>
    </form>
  )
}

function paypalCheckoutUrls(): { returnUrl: string; cancelUrl: string } {
  const origin = window.location.origin
  const paymentPath = bookingPaymentPath()
  return {
    returnUrl: `${origin}${paymentPath}?paypal=return`,
    cancelUrl: `${origin}${paymentPath}?paypal=cancel`,
  }
}

function PayPalCheckout({
  amountEur,
  description,
  disabled,
  onPaid,
  onError,
}: {
  amountEur: number
  description: string
  disabled: boolean
  onPaid: () => Promise<void>
  onError: (message: string) => void
}) {
  if (!isPayPalConfigured()) {
    return (
      <p className="booking-payment-unavailable">
        PayPal is not configured. Add <code>VITE_PAYPAL_CLIENT_ID</code> to your frontend environment.
      </p>
    )
  }

  return (
    <PayPalCheckoutWithScript
      amountEur={amountEur}
      description={description}
      disabled={disabled}
      onPaid={onPaid}
      onError={onError}
    />
  )
}

/** Must render only when PayPalScriptProvider is mounted (see PaymentProviders). */
function PayPalCheckoutWithScript({
  amountEur,
  description,
  disabled,
  onPaid,
  onError,
}: {
  amountEur: number
  description: string
  disabled: boolean
  onPaid: () => Promise<void>
  onError: (message: string) => void
}) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer()
  const checkoutUrls = useMemo(() => paypalCheckoutUrls(), [])

  if (isRejected) {
    return (
      <p className="booking-payment-unavailable">
        PayPal could not be loaded. Check your client ID and try again.
      </p>
    )
  }

  return (
    <div className="booking-payment-paypal-wrap">
      {isPending ? (
        <p className="booking-payment-loading">Loading PayPal…</p>
      ) : null}
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'rect', label: 'paypal' }}
        disabled={disabled || isPending}
        createOrder={async () => {
          onError('')
          try {
            const { orderId } = await createPayPalOrder(amountEur, description, checkoutUrls)
            return orderId
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'Could not start PayPal payment.'
            onError(message)
            throw err
          }
        }}
        onApprove={async (data) => {
          onError('')
          const orderId = data.orderID
          if (!orderId) {
            onError('PayPal payment could not be completed.')
            return
          }
          try {
            await capturePayPalOrder(orderId)
            await onPaid()
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'PayPal payment could not be completed.'
            onError(message)
          }
        }}
        onError={() => onError('PayPal payment failed. Please try again.')}
      />
    </div>
  )
}

export function BookingPaymentPage({
  pending,
  paypalReturnMessage = null,
  onBack,
  onBookingSuccess,
}: BookingPaymentPageProps) {
  const [error, setError] = useState<string | null>(null)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [stripeLoading, setStripeLoading] = useState(Boolean(stripePromise))

  const { quote, details, estimatedPriceEur } = pending

  useEffect(() => {
    savePendingBooking(pending)
  }, [pending])

  const routeDate = useMemo(
    () => formatRouteDate(quote.departureAt || undefined),
    [quote.departureAt],
  )
  const paymentDescription = useMemo(
    () => `Taxi: ${quote.pickup} → ${quote.dropoff}`,
    [quote.dropoff, quote.pickup],
  )

  useEffect(() => {
    if (!stripePromise) {
      setStripeLoading(false)
      return
    }

    let cancelled = false
    setStripeLoading(true)
    setStripeClientSecret(null)

    createStripePaymentIntent(estimatedPriceEur)
      .then(({ clientSecret }) => {
        if (!cancelled) {
          setStripeClientSecret(clientSecret)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Could not initialize card payment.'
          setError(message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setStripeLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [estimatedPriceEur])

  const stripeOptions = useMemo<StripeElementsOptions | undefined>(() => {
    if (!stripeClientSecret) {
      return undefined
    }
    return {
      clientSecret: stripeClientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0fb896',
          borderRadius: '12px',
        },
      },
    }
  }, [stripeClientSecret])

  const finalizeBooking = useCallback(async () => {
    if (isFinalizing) {
      return
    }

    if (quote.departureAt?.trim() && isPickupDatetimeInPast(quote.departureAt)) {
      setError(PICKUP_IN_PAST_MESSAGE)
      throw new Error(PICKUP_IN_PAST_MESSAGE)
    }

    setIsFinalizing(true)
    setError(null)

    try {
      const result = await createBookingFromForms(quote, details)
      onBookingSuccess({
        uuid: result.uuid,
        assignmentMessage: result.assignmentMessage,
        driver: result.driver,
        childSeatsSummary: result.childSeatsSummary,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit booking.'
      setError(message)
      setIsFinalizing(false)
      throw err
    }
  }, [details, isFinalizing, onBookingSuccess, quote])

  return (
    <main className="booking-page">
      <header className="booking-page-nav">
        <div className="booking-page-nav-inner">
          <div className="booking-page-brand">
            <span className="booking-page-brand-badge">
              <BrandLogoIcon width={20} height={20} />
            </span>
            <span className="booking-page-brand-name">BarcelonaTaxi24</span>
          </div>
        </div>
      </header>

      <section className="booking-container">
        <div className="booking-left">
          <Button type="button" variant="ghost" className="booking-back-btn" onClick={onBack}>
            ← Back to details
          </Button>
          <p className="booking-eyebrow">Secure checkout</p>
          <h1 className="booking-heading">Choose payment method</h1>
          <p className="booking-lead">
            Pay the estimated fare below. Your booking is confirmed after payment succeeds.
          </p>

          <div className="booking-payment-methods" aria-busy={isFinalizing}>
            <section className="booking-payment-method" aria-labelledby="booking-payment-paypal">
              <h2 id="booking-payment-paypal" className="booking-payment-method-title">
                PayPal
              </h2>
              <PayPalCheckout
                amountEur={estimatedPriceEur}
                description={paymentDescription}
                disabled={isFinalizing}
                onPaid={finalizeBooking}
                onError={setError}
              />
            </section>

            <section className="booking-payment-method" aria-labelledby="booking-payment-stripe">
              <h2 id="booking-payment-stripe" className="booking-payment-method-title">
                Card (Stripe)
              </h2>
              {!stripePromise ? (
                <p className="booking-payment-unavailable">
                  Card payments are not configured. Add{' '}
                  <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to your frontend environment.
                </p>
              ) : stripeLoading ? (
                <p className="booking-payment-loading">Preparing card payment…</p>
              ) : stripeOptions && stripePromise ? (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <StripeCardCheckout
                    disabled={isFinalizing}
                    onPaid={finalizeBooking}
                    onError={setError}
                  />
                </Elements>
              ) : (
                <p className="booking-payment-unavailable">
                  Card payment is temporarily unavailable. Try PayPal or go back and try again.
                </p>
              )}
            </section>
          </div>

          {paypalReturnMessage ? (
            <p className="booking-error booking-field-full" role="alert">
              {paypalReturnMessage}
            </p>
          ) : null}
          {error ? (
            <p className="booking-error booking-field-full" role="alert">
              {error}
            </p>
          ) : null}
          {isFinalizing ? (
            <p className="booking-payment-loading booking-field-full">Confirming your booking…</p>
          ) : null}
        </div>

        <aside className="booking-right">
          <article className="booking-summary-card">
            <header className="booking-summary-header">
              <h2>Payment summary</h2>
              <span className="booking-summary-pill" aria-hidden="true">
                Due now
              </span>
            </header>
            <div className="booking-summary-body">
              <div className="booking-summary-row">
                <span className="booking-summary-label">From</span>
                <span className="booking-summary-value">{quote.pickup}</span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">To</span>
                <span className="booking-summary-value">{quote.dropoff}</span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">When</span>
                <span className="booking-summary-value">{routeDate}</span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">Passenger</span>
                <span className="booking-summary-value">{details.fullName}</span>
              </div>
            </div>
            <footer className="booking-summary-footer">
              <p className="booking-price-label">Amount to pay</p>
              <p className="booking-price">{formatEurBase(estimatedPriceEur)}</p>
            </footer>
          </article>
        </aside>
      </section>
    </main>
  )
}
