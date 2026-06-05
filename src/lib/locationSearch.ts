const POPULAR_BARCELONA_LOCATIONS = [
  'Barcelona-El Prat International Airport (BCN)',
  'Barcelona Sants Railway Station',
  'Barcelona Nord Bus Station',
  'Port of Barcelona Cruise Terminal',
  'Plaça de Catalunya, Barcelona',
  'La Sagrada Família, Barcelona',
  'Camp Nou, Barcelona',
  'Gothic Quarter, Barcelona',
  'La Rambla, Barcelona',
  'Montjuïc, Barcelona',
  'W Hotel Barcelona',
  'Fira Barcelona Gran Via',
  'Fira Barcelona Montjuïc',
  'Barcelona Marriott Hotel',
  'Hotel Arts Barcelona',
  'Girona Airport (GRO)',
  'Reus Airport (REU)',
  'Sitges, Barcelona',
  'Tarragona, Catalonia',
  'Girona, Catalonia',
] as const

type NominatimResult = {
  display_name: string
  name?: string
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase()
}

function filterPopularLocations(query: string): string[] {
  const normalized = normalizeQuery(query)
  if (normalized.length < 2) {
    return []
  }

  return POPULAR_BARCELONA_LOCATIONS.filter((location) =>
    location.toLowerCase().includes(normalized),
  ).slice(0, 6)
}

function formatNominatimLabel(item: NominatimResult): string {
  const parts = item.display_name
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length <= 3) {
    return item.display_name
  }

  return parts.slice(0, 3).join(', ')
}

async function fetchNominatimLocations(query: string, signal: AbortSignal): Promise<string[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '0',
    limit: '8',
    countrycodes: 'es',
    viewbox: '1.95,41.15,2.45,41.65',
    bounded: '0',
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    return []
  }

  const data = (await response.json()) as NominatimResult[]
  return data.map(formatNominatimLabel).filter(Boolean)
}

function dedupeLocations(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  for (const value of values) {
    const key = value.trim().toLowerCase()
    if (!key || seen.has(key)) {
      continue
    }
    seen.add(key)
    out.push(value)
  }

  return out
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<string[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    return []
  }

  const popular = filterPopularLocations(trimmed)
  if (!signal) {
    const remote = await fetchNominatimLocations(trimmed, new AbortController().signal)
    return dedupeLocations([...popular, ...remote]).slice(0, 8)
  }

  const remote = await fetchNominatimLocations(trimmed, signal)
  return dedupeLocations([...popular, ...remote]).slice(0, 8)
}
