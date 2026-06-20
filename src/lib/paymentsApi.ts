import { apiUrl, parseJsonErrorBody } from '@/lib/apiBase'

export type StripePaymentIntentResponse = {
  clientSecret: string
}

export async function createStripePaymentIntent(
  amountEur: number,
): Promise<StripePaymentIntentResponse> {
  const res = await fetch(apiUrl('/payments/stripe/intent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountEur }),
  })

  const json = (await res.json().catch(() => null)) as {
    message?: string | string[]
    clientSecret?: string
  } | null

  if (!res.ok) {
    const text = parseJsonErrorBody(json) ?? 'Could not start card payment.'
    throw new Error(text)
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
  const res = await fetch(apiUrl('/payments/paypal/order'), {
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
    const text = parseJsonErrorBody(json) ?? 'Could not start PayPal payment.'
    throw new Error(text)
  }

  if (!json?.orderId) {
    throw new Error('PayPal payment could not be initialized.')
  }

  return { orderId: json.orderId }
}

export async function capturePayPalOrder(orderId: string): Promise<void> {
  const res = await fetch(apiUrl('/payments/paypal/capture'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  })

  const json = (await res.json().catch(() => null)) as {
    message?: string | string[]
  } | null

  if (!res.ok) {
    const text = parseJsonErrorBody(json) ?? 'PayPal payment could not be completed.'
    throw new Error(text)
  }
}
