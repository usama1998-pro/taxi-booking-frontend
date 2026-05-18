import { apiBaseUrl } from '@/lib/apiBase'

export type StripePaymentIntentResponse = {
  clientSecret: string
}

export async function createStripePaymentIntent(
  amountEur: number,
): Promise<StripePaymentIntentResponse> {
  const res = await fetch(`${apiBaseUrl()}/payments/stripe/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountEur }),
  })

  const json = (await res.json().catch(() => null)) as {
    message?: string | string[]
    clientSecret?: string
  } | null

  if (!res.ok) {
    const msg = json?.message
    const text = Array.isArray(msg) ? msg.join(' ') : msg
    throw new Error(text ?? 'Could not start card payment.')
  }

  if (!json?.clientSecret) {
    throw new Error('Card payment could not be initialized.')
  }

  return { clientSecret: json.clientSecret }
}

export type PayPalOrderResponse = {
  orderId: string
}

export async function createPayPalOrder(
  amountEur: number,
  description: string,
  options?: { returnUrl: string; cancelUrl: string },
): Promise<PayPalOrderResponse> {
  const res = await fetch(`${apiBaseUrl()}/payments/paypal/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amountEur,
      description,
      returnUrl: options?.returnUrl,
      cancelUrl: options?.cancelUrl,
    }),
  })

  const json = (await res.json().catch(() => null)) as {
    message?: string | string[]
    orderId?: string
  } | null

  if (!res.ok) {
    const msg = json?.message
    const text = Array.isArray(msg) ? msg.join(' ') : msg
    throw new Error(text ?? 'Could not start PayPal payment.')
  }

  if (!json?.orderId) {
    throw new Error('PayPal payment could not be initialized.')
  }

  return { orderId: json.orderId }
}

export async function capturePayPalOrder(orderId: string): Promise<void> {
  const res = await fetch(`${apiBaseUrl()}/payments/paypal/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  })

  const json = (await res.json().catch(() => null)) as {
    message?: string | string[]
  } | null

  if (!res.ok) {
    const msg = json?.message
    const text = Array.isArray(msg) ? msg.join(' ') : msg
    throw new Error(text ?? 'PayPal payment could not be completed.')
  }
}
