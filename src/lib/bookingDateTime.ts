/** `YYYY-MM-DDTHH:mm` from datetime-local style inputs. */
export function parseDatetimeLocalToMs(value: string | undefined): number | null {
  const trimmed = (value ?? '').trim()
  if (!trimmed) {
    return null
  }
  const ms = new Date(trimmed).getTime()
  return Number.isNaN(ms) ? null : ms
}

/** True when a concrete pickup datetime is strictly in the past. */
export function isPickupDatetimeInPast(value: string | undefined, nowMs = Date.now()): boolean {
  const ms = parseDatetimeLocalToMs(value)
  if (ms === null) {
    return false
  }
  return ms < nowMs - 60_000
}

export const PICKUP_IN_PAST_MESSAGE = 'Pickup must be now or in the future.'
