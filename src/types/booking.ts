export type BookingUserSummary = {
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: string
}

export type BookingDriverSummary = {
  id: string
  name: string
  email: string
  phone: string
  photoUrl: string | null
  isAvailable: boolean
  isActive: boolean
} | null

/** API payload: no internal `id`; use `uuid` for URLs only. */
export type Booking = {
  uuid: string
  bookingReference: string
  userId: string
  driverId: string | null
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  flightNumber: string | null
  returnTime: string | null
  pickupLocation: unknown
  dropoffLocation: unknown
  scheduledTime: string
  price: number
  status: string
  luggageCount: number
  passengerCount: number
  infantCarrierCount: number
  childSeatCount: number
  boosterCount: number
  note: string | null
  createdAt: string
  completedAt?: string | null
  user: BookingUserSummary
  driver: BookingDriverSummary
}

export type PaginatedBookings = {
  data: Booking[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/** Matches FastAPI `GET /api/v1/bookings?timeScope=` */
export type BookingListTimeScope = 'past' | 'current' | 'upcoming'
