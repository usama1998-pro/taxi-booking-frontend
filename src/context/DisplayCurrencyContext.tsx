import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import {
  BOOKING_BASE_CURRENCY,
  type DisplayCurrencyCode,
  isDisplayCurrencyCode,
} from '@/lib/displayCurrency'

const STORAGE_KEY = 'taxi-booking-display-currency'

type DisplayCurrencyContextValue = {
  currency: DisplayCurrencyCode
  setCurrency: (code: DisplayCurrencyCode) => void
}

const DisplayCurrencyContext = createContext<DisplayCurrencyContextValue | null>(null)

function readStoredCurrency(): DisplayCurrencyCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && isDisplayCurrencyCode(raw)) {
      return raw
    }
  } catch {
    /* ignore */
  }
  return BOOKING_BASE_CURRENCY
}

export function DisplayCurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<DisplayCurrencyCode>(() => readStoredCurrency())

  const setCurrency = useCallback((code: DisplayCurrencyCode) => {
    setCurrencyState(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
    }),
    [currency, setCurrency],
  )

  return <DisplayCurrencyContext.Provider value={value}>{children}</DisplayCurrencyContext.Provider>
}

export function useDisplayCurrency(): DisplayCurrencyContextValue {
  const ctx = useContext(DisplayCurrencyContext)
  if (!ctx) {
    throw new Error('useDisplayCurrency must be used within DisplayCurrencyProvider')
  }
  return ctx
}
