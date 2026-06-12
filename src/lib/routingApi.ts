import { apiBaseUrl } from '@/lib/apiBase'

export type PlaceSuggestion = {
  description: string
  placeId: string
}

export type RouteQuotePayload = {
  from: string
  to: string
  passengerCount: number
  luggageCount: number
  infantCarrierCount?: number
  childSeatCount?: number
  boosterCount?: number
  isReturnTrip?: boolean
}

export type RouteQuoteResponse = {
  distanceKm: number
  distanceSurchargeEur: number
  baseFareEur: number
  estimatedPriceEur: number
  durationMinutes: number
}

export async function fetchPlaces(input: string): Promise<PlaceSuggestion[]> {
  const res = await fetch(`${apiBaseUrl()}/routing/places`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  })

  const json = (await res.json().catch(() => null)) as
    | PlaceSuggestion[]
    | { message?: string | string[] }
    | null

  if (!res.ok) {
    const msg = json && !Array.isArray(json) ? json.message : undefined
    const text = Array.isArray(msg) ? msg.join(' ') : msg
    throw new Error(text ?? 'Could not load address suggestions.')
  }

  return Array.isArray(json) ? json : []
}

export async function fetchRouteQuote(
  payload: RouteQuotePayload,
): Promise<RouteQuoteResponse> {
  const res = await fetch(`${apiBaseUrl()}/routing/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const json = (await res.json().catch(() => null)) as
    | RouteQuoteResponse
    | { message?: string | string[] }
    | null

  if (!res.ok) {
    const msg = json && !('estimatedPriceEur' in json) ? json.message : undefined
    const text = Array.isArray(msg) ? msg.join(' ') : msg
    throw new Error(text ?? 'Could not calculate route price.')
  }

  if (!json || typeof json !== 'object' || !('estimatedPriceEur' in json)) {
    throw new Error('Route quote could not be loaded.')
  }

  return json
}
