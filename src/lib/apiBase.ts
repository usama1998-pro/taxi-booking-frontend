/** Public + authenticated API base (no trailing slash). */
export const API_V1_PREFIX = '/api/v1'

export function apiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  const base = (raw ?? 'http://localhost:8000').replace(/\/$/, '')
  return base
}

/** Build a full URL for a versioned API path such as `/auth/signin`. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl()}${API_V1_PREFIX}${normalized}`
}

export function parseJsonErrorBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return null
  }
  const json = body as { message?: unknown; detail?: unknown }

  if (typeof json.detail === 'string' && json.detail.trim()) {
    return json.detail
  }
  if (Array.isArray(json.detail)) {
    const lines = json.detail
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg: unknown }).msg)
        }
        return String(item)
      })
      .filter(Boolean)
    if (lines.length > 0) {
      return lines.join('\n')
    }
  }

  if (Array.isArray(json.message)) {
    return json.message.map(String).join('\n')
  }
  if (typeof json.message === 'string' && json.message.trim()) {
    return json.message
  }

  return null
}

export async function readApiErrorMessage(res: Response): Promise<string> {
  const text = await res.text()
  try {
    const parsed = parseJsonErrorBody(JSON.parse(text))
    if (parsed) {
      return parsed
    }
  } catch {
    /* ignore */
  }
  return text.trim() || `Request failed (${res.status})`
}
