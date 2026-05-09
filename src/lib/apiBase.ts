/** Public + authenticated API base (no trailing slash). */
export function apiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  const base = (raw ?? 'http://localhost:3000').replace(/\/$/, '')
  return base
}
