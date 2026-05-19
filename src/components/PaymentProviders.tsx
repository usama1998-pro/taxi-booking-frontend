import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import type { ReactNode } from 'react'

import { BOOKING_BASE_CURRENCY } from '@/lib/displayCurrency'
import { getPayPalClientId, getPayPalLocale, isPayPalConfigured } from '@/lib/paypalConfig'

type PaymentProvidersProps = {
  children: ReactNode
}

export function PaymentProviders({ children }: PaymentProvidersProps) {
  const clientId = getPayPalClientId()

  if (!isPayPalConfigured() || !clientId) {
    return <>{children}</>
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: BOOKING_BASE_CURRENCY,
        intent: 'capture',
        locale: getPayPalLocale(),
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}
