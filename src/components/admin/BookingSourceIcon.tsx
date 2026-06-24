import { Globe, Mail, Smartphone } from 'lucide-react'

import {
  bookingSourceAccessibilityLabel,
  bookingSourceIcon,
  bookingSourceIconColor,
  type BookingSourceIcon as BookingSourceIconName,
} from '@/lib/bookingFormatDisplay'
import type { Booking } from '@/types/booking'

const ICONS: Record<BookingSourceIconName, typeof Mail> = {
  mail: Mail,
  smartphone: Smartphone,
  globe: Globe,
}

type Props = {
  booking: Booking
  size?: number
  strokeWidth?: number
  /** When set, overrides the per-source list color (e.g. white on a colored header). */
  color?: string
  className?: string
}

export function BookingSourceIcon({
  booking,
  size = 24,
  strokeWidth = 2,
  color,
  className,
}: Props) {
  const kind = bookingSourceIcon(booking)
  const Icon = ICONS[kind]
  const iconColor = color ?? bookingSourceIconColor(booking)

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      color={iconColor}
      className={className}
      aria-label={bookingSourceAccessibilityLabel(booking)}
    />
  )
}
