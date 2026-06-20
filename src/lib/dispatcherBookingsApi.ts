import { apiUrl, readApiErrorMessage } from '@/lib/apiBase'
import type {
  Booking,
  BookingListTimeScope,
  PaginatedBookings,
} from '@/types/booking'

async function readErrorMessage(res: Response): Promise<string> {
  return readApiErrorMessage(res)
}

async function authorizedJson<T>(path: string, token: string): Promise<T> {
  const url = apiUrl(path)
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  return (await res.json()) as T
}

async function authorizedJsonDelete(path: string, token: string): Promise<void> {
  const url = apiUrl(path)
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
}

export const dispatcherBookingsApi = {
  list(
    token: string,
    params: {
      page?: number
      pageSize?: number
      timeScope?: BookingListTimeScope
      /** Pickup calendar day in server TZ (`YYYY-MM-DD`). */
      scheduledOn?: string
      /** Partial match on booking reference (server-side). */
      bookingReference?: string
    } = {},
  ): Promise<PaginatedBookings> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 20
    const q = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    })
    if (params.timeScope) {
      q.set('timeScope', params.timeScope)
    }
    if (params.scheduledOn) {
      q.set('scheduledOn', params.scheduledOn)
    }
    if (params.bookingReference?.trim()) {
      q.set('bookingReference', params.bookingReference.trim())
    }
    return authorizedJson<PaginatedBookings>(`/bookings?${q.toString()}`, token)
  },

  getByUuid(token: string, uuid: string): Promise<Booking> {
    return authorizedJson<Booking>(`/bookings/${uuid}`, token)
  },

  removeReservation(token: string, uuid: string): Promise<void> {
    return authorizedJsonDelete(`/bookings/${uuid}/remove`, token)
  },
}
