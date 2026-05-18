import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import type { ReactNode } from 'react'

import { BOOKING_BASE_CURRENCY } from '@/lib/displayCurrency'

type PaymentProvidersProps = {
  children: ReactNode
}

export function PaymentProviders({ children }: PaymentProvidersProps) {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID?.trim()

  if (!clientId) {
    return children
  }

  // en_US uses a period decimal separator (46.00). Browser locale (e.g. es_ES) shows 46,00.
  const locale = import.meta.env.VITE_PAYPAL_LOCALE?.trim() || 'en_US'

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: BOOKING_BASE_CURRENCY,
        intent: 'capture',
        locale,
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}
