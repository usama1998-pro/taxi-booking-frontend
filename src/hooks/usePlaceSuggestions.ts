import { useEffect, useState } from 'react'

import { fetchPlaces } from '@/lib/routingApi'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export const PLACES_DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 1

export function usePlaceSuggestions(query: string, enabled = true) {
  const trimmed = query.trim()
  const debouncedQuery = useDebouncedValue(trimmed, PLACES_DEBOUNCE_MS)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled || debouncedQuery.length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    fetchPlaces(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results.map((place) => place.description))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([])
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
  }, [debouncedQuery, enabled])

  return { suggestions, loading }
}
