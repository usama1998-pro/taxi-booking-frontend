import { useEffect, useState } from 'react'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  fetchRouteQuote,
  type RouteQuotePayload,
  type RouteQuoteResponse,
} from '@/lib/routingApi'

export const ROUTE_QUOTE_DEBOUNCE_MS = 400

export function useRouteQuote(payload: RouteQuotePayload | null) {
  const debouncedPayload = useDebouncedValue(payload, ROUTE_QUOTE_DEBOUNCE_MS)
  const [quote, setQuote] = useState<RouteQuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (
      !debouncedPayload ||
      !debouncedPayload.from.trim() ||
      !debouncedPayload.to.trim()
    ) {
      setQuote(null)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchRouteQuote(debouncedPayload)
      .then((result) => {
        if (!cancelled) {
          setQuote(result)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setQuote(null)
          setError(
            err instanceof Error
              ? err.message
              : 'Could not calculate route price.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [debouncedPayload])

  return { quote, loading, error }
}
