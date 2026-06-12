import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import { BrandLogoIcon } from '@/components/BrandLogoIcon'
import { DateTimeLocalSplit } from '@/components/DateTimeLocalSplit'
import type { QuoteFormValues } from '@/components/QuoteForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  formatChildSeatsSummaryLine,
  type BookingDetailsValues,
  type PendingBookingPayload,
} from '@/lib/bookingsApi'
import { useRouteQuote } from '@/hooks/useRouteQuote'
import { BRAND_NAME } from '@/lib/brandConfig'
import { formatEurBase } from '@/lib/displayCurrency'
import { isPickupDatetimeInPast, PICKUP_IN_PAST_MESSAGE } from '@/lib/bookingDateTime'
import { cn } from '@/lib/utils'

type BookingDetailsPageProps = {
  quote: QuoteFormValues
  initialDetails?: BookingDetailsValues
  onBack: () => void
  onContinueToPayment: (payload: PendingBookingPayload) => void
}

const PHONE_CODES = [
  { country: 'Afghanistan', iso2: 'AF', dialCode: '+93', flag: '🇦🇫' },
  { country: 'Albania', iso2: 'AL', dialCode: '+355', flag: '🇦🇱' },
  { country: 'Algeria', iso2: 'DZ', dialCode: '+213', flag: '🇩🇿' },
  { country: 'Andorra', iso2: 'AD', dialCode: '+376', flag: '🇦🇩' },
  { country: 'Angola', iso2: 'AO', dialCode: '+244', flag: '🇦🇴' },
  { country: 'Argentina', iso2: 'AR', dialCode: '+54', flag: '🇦🇷' },
  { country: 'Armenia', iso2: 'AM', dialCode: '+374', flag: '🇦🇲' },
  { country: 'Australia', iso2: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { country: 'Austria', iso2: 'AT', dialCode: '+43', flag: '🇦🇹' },
  { country: 'Azerbaijan', iso2: 'AZ', dialCode: '+994', flag: '🇦🇿' },
  { country: 'Bahrain', iso2: 'BH', dialCode: '+973', flag: '🇧🇭' },
  { country: 'Bangladesh', iso2: 'BD', dialCode: '+880', flag: '🇧🇩' },
  { country: 'Belarus', iso2: 'BY', dialCode: '+375', flag: '🇧🇾' },
  { country: 'Belgium', iso2: 'BE', dialCode: '+32', flag: '🇧🇪' },
  { country: 'Belize', iso2: 'BZ', dialCode: '+501', flag: '🇧🇿' },
  { country: 'Benin', iso2: 'BJ', dialCode: '+229', flag: '🇧🇯' },
  { country: 'Bhutan', iso2: 'BT', dialCode: '+975', flag: '🇧🇹' },
  { country: 'Bolivia', iso2: 'BO', dialCode: '+591', flag: '🇧🇴' },
  { country: 'Bosnia and Herzegovina', iso2: 'BA', dialCode: '+387', flag: '🇧🇦' },
  { country: 'Botswana', iso2: 'BW', dialCode: '+267', flag: '🇧🇼' },
  { country: 'Brazil', iso2: 'BR', dialCode: '+55', flag: '🇧🇷' },
  { country: 'Brunei', iso2: 'BN', dialCode: '+673', flag: '🇧🇳' },
  { country: 'Bulgaria', iso2: 'BG', dialCode: '+359', flag: '🇧🇬' },
  { country: 'Burkina Faso', iso2: 'BF', dialCode: '+226', flag: '🇧🇫' },
  { country: 'Burundi', iso2: 'BI', dialCode: '+257', flag: '🇧🇮' },
  { country: 'Cambodia', iso2: 'KH', dialCode: '+855', flag: '🇰🇭' },
  { country: 'Cameroon', iso2: 'CM', dialCode: '+237', flag: '🇨🇲' },
  { country: 'Canada', iso2: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { country: 'Cape Verde', iso2: 'CV', dialCode: '+238', flag: '🇨🇻' },
  { country: 'Chile', iso2: 'CL', dialCode: '+56', flag: '🇨🇱' },
  { country: 'China', iso2: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { country: 'Colombia', iso2: 'CO', dialCode: '+57', flag: '🇨🇴' },
  { country: 'Comoros', iso2: 'KM', dialCode: '+269', flag: '🇰🇲' },
  { country: 'Costa Rica', iso2: 'CR', dialCode: '+506', flag: '🇨🇷' },
  { country: 'Croatia', iso2: 'HR', dialCode: '+385', flag: '🇭🇷' },
  { country: 'Cuba', iso2: 'CU', dialCode: '+53', flag: '🇨🇺' },
  { country: 'Cyprus', iso2: 'CY', dialCode: '+357', flag: '🇨🇾' },
  { country: 'Czech Republic', iso2: 'CZ', dialCode: '+420', flag: '🇨🇿' },
  { country: 'Denmark', iso2: 'DK', dialCode: '+45', flag: '🇩🇰' },
  { country: 'Djibouti', iso2: 'DJ', dialCode: '+253', flag: '🇩🇯' },
  { country: 'Dominican Republic', iso2: 'DO', dialCode: '+1-809', flag: '🇩🇴' },
  { country: 'Ecuador', iso2: 'EC', dialCode: '+593', flag: '🇪🇨' },
  { country: 'Egypt', iso2: 'EG', dialCode: '+20', flag: '🇪🇬' },
  { country: 'El Salvador', iso2: 'SV', dialCode: '+503', flag: '🇸🇻' },
  { country: 'Estonia', iso2: 'EE', dialCode: '+372', flag: '🇪🇪' },
  { country: 'Ethiopia', iso2: 'ET', dialCode: '+251', flag: '🇪🇹' },
  { country: 'Finland', iso2: 'FI', dialCode: '+358', flag: '🇫🇮' },
  { country: 'France', iso2: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { country: 'Gabon', iso2: 'GA', dialCode: '+241', flag: '🇬🇦' },
  { country: 'Gambia', iso2: 'GM', dialCode: '+220', flag: '🇬🇲' },
  { country: 'Georgia', iso2: 'GE', dialCode: '+995', flag: '🇬🇪' },
  { country: 'Germany', iso2: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { country: 'Ghana', iso2: 'GH', dialCode: '+233', flag: '🇬🇭' },
  { country: 'Greece', iso2: 'GR', dialCode: '+30', flag: '🇬🇷' },
  { country: 'Guatemala', iso2: 'GT', dialCode: '+502', flag: '🇬🇹' },
  { country: 'Guinea', iso2: 'GN', dialCode: '+224', flag: '🇬🇳' },
  { country: 'Guyana', iso2: 'GY', dialCode: '+592', flag: '🇬🇾' },
  { country: 'Haiti', iso2: 'HT', dialCode: '+509', flag: '🇭🇹' },
  { country: 'Honduras', iso2: 'HN', dialCode: '+504', flag: '🇭🇳' },
  { country: 'Hong Kong', iso2: 'HK', dialCode: '+852', flag: '🇭🇰' },
  { country: 'Hungary', iso2: 'HU', dialCode: '+36', flag: '🇭🇺' },
  { country: 'Iceland', iso2: 'IS', dialCode: '+354', flag: '🇮🇸' },
  { country: 'India', iso2: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { country: 'Indonesia', iso2: 'ID', dialCode: '+62', flag: '🇮🇩' },
  { country: 'Iran', iso2: 'IR', dialCode: '+98', flag: '🇮🇷' },
  { country: 'Iraq', iso2: 'IQ', dialCode: '+964', flag: '🇮🇶' },
  { country: 'Ireland', iso2: 'IE', dialCode: '+353', flag: '🇮🇪' },
  { country: 'Israel', iso2: 'IL', dialCode: '+972', flag: '🇮🇱' },
  { country: 'Italy', iso2: 'IT', dialCode: '+39', flag: '🇮🇹' },
  { country: 'Ivory Coast', iso2: 'CI', dialCode: '+225', flag: '🇨🇮' },
  { country: 'Jamaica', iso2: 'JM', dialCode: '+1-876', flag: '🇯🇲' },
  { country: 'Japan', iso2: 'JP', dialCode: '+81', flag: '🇯🇵' },
  { country: 'Jordan', iso2: 'JO', dialCode: '+962', flag: '🇯🇴' },
  { country: 'Kazakhstan', iso2: 'KZ', dialCode: '+7', flag: '🇰🇿' },
  { country: 'Kenya', iso2: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { country: 'Kuwait', iso2: 'KW', dialCode: '+965', flag: '🇰🇼' },
  { country: 'Kyrgyzstan', iso2: 'KG', dialCode: '+996', flag: '🇰🇬' },
  { country: 'Laos', iso2: 'LA', dialCode: '+856', flag: '🇱🇦' },
  { country: 'Latvia', iso2: 'LV', dialCode: '+371', flag: '🇱🇻' },
  { country: 'Lebanon', iso2: 'LB', dialCode: '+961', flag: '🇱🇧' },
  { country: 'Lesotho', iso2: 'LS', dialCode: '+266', flag: '🇱🇸' },
  { country: 'Liberia', iso2: 'LR', dialCode: '+231', flag: '🇱🇷' },
  { country: 'Libya', iso2: 'LY', dialCode: '+218', flag: '🇱🇾' },
  { country: 'Liechtenstein', iso2: 'LI', dialCode: '+423', flag: '🇱🇮' },
  { country: 'Lithuania', iso2: 'LT', dialCode: '+370', flag: '🇱🇹' },
  { country: 'Luxembourg', iso2: 'LU', dialCode: '+352', flag: '🇱🇺' },
  { country: 'Macau', iso2: 'MO', dialCode: '+853', flag: '🇲🇴' },
  { country: 'Madagascar', iso2: 'MG', dialCode: '+261', flag: '🇲🇬' },
  { country: 'Malawi', iso2: 'MW', dialCode: '+265', flag: '🇲🇼' },
  { country: 'Malaysia', iso2: 'MY', dialCode: '+60', flag: '🇲🇾' },
  { country: 'Maldives', iso2: 'MV', dialCode: '+960', flag: '🇲🇻' },
  { country: 'Mali', iso2: 'ML', dialCode: '+223', flag: '🇲🇱' },
  { country: 'Malta', iso2: 'MT', dialCode: '+356', flag: '🇲🇹' },
  { country: 'Mauritania', iso2: 'MR', dialCode: '+222', flag: '🇲🇷' },
  { country: 'Mauritius', iso2: 'MU', dialCode: '+230', flag: '🇲🇺' },
  { country: 'Mexico', iso2: 'MX', dialCode: '+52', flag: '🇲🇽' },
  { country: 'Moldova', iso2: 'MD', dialCode: '+373', flag: '🇲🇩' },
  { country: 'Monaco', iso2: 'MC', dialCode: '+377', flag: '🇲🇨' },
  { country: 'Mongolia', iso2: 'MN', dialCode: '+976', flag: '🇲🇳' },
  { country: 'Montenegro', iso2: 'ME', dialCode: '+382', flag: '🇲🇪' },
  { country: 'Morocco', iso2: 'MA', dialCode: '+212', flag: '🇲🇦' },
  { country: 'Mozambique', iso2: 'MZ', dialCode: '+258', flag: '🇲🇿' },
  { country: 'Myanmar', iso2: 'MM', dialCode: '+95', flag: '🇲🇲' },
  { country: 'Namibia', iso2: 'NA', dialCode: '+264', flag: '🇳🇦' },
  { country: 'Nepal', iso2: 'NP', dialCode: '+977', flag: '🇳🇵' },
  { country: 'Netherlands', iso2: 'NL', dialCode: '+31', flag: '🇳🇱' },
  { country: 'New Zealand', iso2: 'NZ', dialCode: '+64', flag: '🇳🇿' },
  { country: 'Nicaragua', iso2: 'NI', dialCode: '+505', flag: '🇳🇮' },
  { country: 'Niger', iso2: 'NE', dialCode: '+227', flag: '🇳🇪' },
  { country: 'Nigeria', iso2: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { country: 'North Macedonia', iso2: 'MK', dialCode: '+389', flag: '🇲🇰' },
  { country: 'Norway', iso2: 'NO', dialCode: '+47', flag: '🇳🇴' },
  { country: 'Oman', iso2: 'OM', dialCode: '+968', flag: '🇴🇲' },
  { country: 'Pakistan', iso2: 'PK', dialCode: '+92', flag: '🇵🇰' },
  { country: 'Panama', iso2: 'PA', dialCode: '+507', flag: '🇵🇦' },
  { country: 'Paraguay', iso2: 'PY', dialCode: '+595', flag: '🇵🇾' },
  { country: 'Peru', iso2: 'PE', dialCode: '+51', flag: '🇵🇪' },
  { country: 'Philippines', iso2: 'PH', dialCode: '+63', flag: '🇵🇭' },
  { country: 'Poland', iso2: 'PL', dialCode: '+48', flag: '🇵🇱' },
  { country: 'Portugal', iso2: 'PT', dialCode: '+351', flag: '🇵🇹' },
  { country: 'Qatar', iso2: 'QA', dialCode: '+974', flag: '🇶🇦' },
  { country: 'Romania', iso2: 'RO', dialCode: '+40', flag: '🇷🇴' },
  { country: 'Russia', iso2: 'RU', dialCode: '+7', flag: '🇷🇺' },
  { country: 'Rwanda', iso2: 'RW', dialCode: '+250', flag: '🇷🇼' },
  { country: 'Saudi Arabia', iso2: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { country: 'Senegal', iso2: 'SN', dialCode: '+221', flag: '🇸🇳' },
  { country: 'Serbia', iso2: 'RS', dialCode: '+381', flag: '🇷🇸' },
  { country: 'Seychelles', iso2: 'SC', dialCode: '+248', flag: '🇸🇨' },
  { country: 'Sierra Leone', iso2: 'SL', dialCode: '+232', flag: '🇸🇱' },
  { country: 'Singapore', iso2: 'SG', dialCode: '+65', flag: '🇸🇬' },
  { country: 'Slovakia', iso2: 'SK', dialCode: '+421', flag: '🇸🇰' },
  { country: 'Slovenia', iso2: 'SI', dialCode: '+386', flag: '🇸🇮' },
  { country: 'Somalia', iso2: 'SO', dialCode: '+252', flag: '🇸🇴' },
  { country: 'South Africa', iso2: 'ZA', dialCode: '+27', flag: '🇿🇦' },
  { country: 'South Korea', iso2: 'KR', dialCode: '+82', flag: '🇰🇷' },
  { country: 'Spain', iso2: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { country: 'Sri Lanka', iso2: 'LK', dialCode: '+94', flag: '🇱🇰' },
  { country: 'Sudan', iso2: 'SD', dialCode: '+249', flag: '🇸🇩' },
  { country: 'Suriname', iso2: 'SR', dialCode: '+597', flag: '🇸🇷' },
  { country: 'Sweden', iso2: 'SE', dialCode: '+46', flag: '🇸🇪' },
  { country: 'Switzerland', iso2: 'CH', dialCode: '+41', flag: '🇨🇭' },
  { country: 'Syria', iso2: 'SY', dialCode: '+963', flag: '🇸🇾' },
  { country: 'Taiwan', iso2: 'TW', dialCode: '+886', flag: '🇹🇼' },
  { country: 'Tajikistan', iso2: 'TJ', dialCode: '+992', flag: '🇹🇯' },
  { country: 'Tanzania', iso2: 'TZ', dialCode: '+255', flag: '🇹🇿' },
  { country: 'Thailand', iso2: 'TH', dialCode: '+66', flag: '🇹🇭' },
  { country: 'Togo', iso2: 'TG', dialCode: '+228', flag: '🇹🇬' },
  { country: 'Trinidad and Tobago', iso2: 'TT', dialCode: '+1-868', flag: '🇹🇹' },
  { country: 'Tunisia', iso2: 'TN', dialCode: '+216', flag: '🇹🇳' },
  { country: 'Turkey', iso2: 'TR', dialCode: '+90', flag: '🇹🇷' },
  { country: 'Turkmenistan', iso2: 'TM', dialCode: '+993', flag: '🇹🇲' },
  { country: 'Uganda', iso2: 'UG', dialCode: '+256', flag: '🇺🇬' },
  { country: 'Ukraine', iso2: 'UA', dialCode: '+380', flag: '🇺🇦' },
  { country: 'United Arab Emirates', iso2: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { country: 'United Kingdom', iso2: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { country: 'United States', iso2: 'US', dialCode: '+1', flag: '🇺🇸' },
  { country: 'Uruguay', iso2: 'UY', dialCode: '+598', flag: '🇺🇾' },
  { country: 'Uzbekistan', iso2: 'UZ', dialCode: '+998', flag: '🇺🇿' },
  { country: 'Venezuela', iso2: 'VE', dialCode: '+58', flag: '🇻🇪' },
  { country: 'Vietnam', iso2: 'VN', dialCode: '+84', flag: '🇻🇳' },
  { country: 'Yemen', iso2: 'YE', dialCode: '+967', flag: '🇾🇪' },
  { country: 'Zambia', iso2: 'ZM', dialCode: '+260', flag: '🇿🇲' },
  { country: 'Zimbabwe', iso2: 'ZW', dialCode: '+263', flag: '🇿🇼' },
] as const

type PhoneCodeOption = (typeof PHONE_CODES)[number]

const CHILD_SEAT_MAX = 4

function ChildSeatCounter({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string
  subtitle: string
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div className="booking-child-seat-row">
      <div className="booking-child-seat-labels">
        <span className="booking-child-seat-title">{title}</span>
        <span className="booking-child-seat-sub">{subtitle}</span>
      </div>
      <div className="booking-child-seat-counter">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Decrease ${title}`}>
          -
        </button>
        <span aria-live="polite">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(CHILD_SEAT_MAX, value + 1))}
          aria-label={`Increase ${title}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

function formatPhoneCodeLabel(option: PhoneCodeOption): string {
  return `${option.flag} ${option.country} (${option.dialCode})`
}

function parseStoredPhone(
  storedPhone: string,
  fallbackCode: PhoneCodeOption,
): { code: PhoneCodeOption; local: string } {
  const trimmed = storedPhone.trim()
  if (!trimmed) {
    return { code: fallbackCode, local: '' }
  }

  const matchedCode = [...PHONE_CODES]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find((option) => trimmed.startsWith(option.dialCode))

  if (!matchedCode) {
    return { code: fallbackCode, local: trimmed }
  }

  return {
    code: matchedCode,
    local: trimmed.slice(matchedCode.dialCode.length).trim(),
  }
}

function createDetailsFormState(quote: QuoteFormValues, initialDetails?: BookingDetailsValues) {
  const defaultCode = PHONE_CODES.find((x) => x.iso2 === 'ES') ?? PHONE_CODES[0]

  if (!initialDetails) {
    return {
      pickupDateTime: quote.departureAt?.trim() ?? '',
      flightNumber: '',
      fullName: '',
      email: '',
      phoneCode: defaultCode,
      phone: '',
      addChildSeats: false,
      infantCarrierCount: 0,
      childSeatCount: 0,
      boosterCount: 0,
      addDriverNotes: false,
      bulkyLuggage: false,
      wheelchairAccessible: false,
      driverNoteManuscript: '',
    }
  }

  const parsedPhone = parseStoredPhone(initialDetails.phone, defaultCode)
  const infantCarrierCount = initialDetails.infantCarrierCount ?? 0
  const childSeatCount = initialDetails.childSeatCount ?? 0
  const boosterCount = initialDetails.boosterCount ?? 0
  const note = initialDetails.note?.trim() ?? ''
  const wheelchairAccessible = note.includes('Wheelchair accessible vehicle:')
  const bulkyLuggage = note.includes('Bulky luggage:')
  let driverNoteManuscript = note
  if (wheelchairAccessible) {
    driverNoteManuscript = driverNoteManuscript.replace('Wheelchair accessible vehicle:', '').trim()
  }
  if (bulkyLuggage) {
    driverNoteManuscript = driverNoteManuscript.replace('Bulky luggage:', '').trim()
  }

  return {
    pickupDateTime: quote.departureAt?.trim() ?? '',
    flightNumber: initialDetails.flightNumber ?? '',
    fullName: initialDetails.fullName,
    email: initialDetails.email,
    phoneCode: parsedPhone.code,
    phone: parsedPhone.local,
    addChildSeats: infantCarrierCount + childSeatCount + boosterCount > 0,
    infantCarrierCount,
    childSeatCount,
    boosterCount,
    addDriverNotes: note.length > 0,
    bulkyLuggage,
    wheelchairAccessible,
    driverNoteManuscript,
  }
}

function formatRouteDate(datetimeLocalValue: string | undefined): string {
  if (!datetimeLocalValue) {
    return 'As soon as possible'
  }
  const date = new Date(datetimeLocalValue)
  if (Number.isNaN(date.getTime())) {
    return datetimeLocalValue
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function BookingDetailsPage({
  quote,
  initialDetails,
  onBack,
  onContinueToPayment,
}: BookingDetailsPageProps) {
  const [formState] = useState(() => createDetailsFormState(quote, initialDetails))
  const [pickupDateTime, setPickupDateTime] = useState(formState.pickupDateTime)
  const [flightNumber, setFlightNumber] = useState(formState.flightNumber)
  const [fullName, setFullName] = useState(formState.fullName)
  const [email, setEmail] = useState(formState.email)
  const [phoneCode, setPhoneCode] = useState<PhoneCodeOption>(formState.phoneCode)
  const [phoneCodeQuery, setPhoneCodeQuery] = useState(formatPhoneCodeLabel(formState.phoneCode))
  const [phoneCodeOpen, setPhoneCodeOpen] = useState(false)
  const [phone, setPhone] = useState(formState.phone)
  const [addChildSeats, setAddChildSeats] = useState(formState.addChildSeats)
  const [infantCarrierCount, setInfantCarrierCount] = useState(formState.infantCarrierCount)
  const [childSeatCount, setChildSeatCount] = useState(formState.childSeatCount)
  const [boosterCount, setBoosterCount] = useState(formState.boosterCount)
  const [addDriverNotes, setAddDriverNotes] = useState(formState.addDriverNotes)
  const [bulkyLuggage, setBulkyLuggage] = useState(formState.bulkyLuggage)
  const [wheelchairAccessible, setWheelchairAccessible] = useState(formState.wheelchairAccessible)
  const [driverNoteManuscript, setDriverNoteManuscript] = useState(formState.driverNoteManuscript)
  const [isContinuing, setIsContinuing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const phoneCodePickerRef = useRef<HTMLDivElement | null>(null)

  const quoteForSubmit = useMemo(
    () => ({ ...quote, departureAt: pickupDateTime }),
    [quote, pickupDateTime],
  )
  const routeQuotePayload = useMemo(
    () => ({
      from: quoteForSubmit.pickup,
      to: quoteForSubmit.dropoff,
      passengerCount: quoteForSubmit.passengers,
      luggageCount: quoteForSubmit.luggage,
      infantCarrierCount: addChildSeats ? infantCarrierCount : 0,
      childSeatCount: addChildSeats ? childSeatCount : 0,
      boosterCount: addChildSeats ? boosterCount : 0,
      isReturnTrip: quoteForSubmit.tripType === 'return',
    }),
    [
      addChildSeats,
      boosterCount,
      childSeatCount,
      infantCarrierCount,
      quoteForSubmit,
    ],
  )
  const { quote: routeQuote, loading: routeQuoteLoading, error: routeQuoteError } =
    useRouteQuote(routeQuotePayload)
  const estimatedPrice = routeQuote?.estimatedPriceEur ?? null
  const routeDate = useMemo(() => formatRouteDate(pickupDateTime || undefined), [pickupDateTime])
  const tripChildSeatsChip = useMemo(
    () => formatChildSeatsSummaryLine(infantCarrierCount, childSeatCount, boosterCount),
    [infantCarrierCount, childSeatCount, boosterCount],
  )

  const driverNoteAutoPart = useMemo(
    () =>
      [wheelchairAccessible && 'Wheelchair accessible vehicle:', bulkyLuggage && 'Bulky luggage:']
        .filter(Boolean)
        .join(' '),
    [wheelchairAccessible, bulkyLuggage],
  )

  const driverNoteCombined = useMemo(() => {
    const head = driverNoteAutoPart
    const tail = driverNoteManuscript
    if (!head) {
      return tail
    }
    if (!tail.trim()) {
      return head.endsWith(' ') ? head : `${head} `
    }
    return `${head.trimEnd()} ${tail.replace(/^\s+/, '')}`
  }, [driverNoteAutoPart, driverNoteManuscript])

  function onDriverNoteTextareaChange(raw: string) {
    const ap = driverNoteAutoPart
    if (ap) {
      if (raw.startsWith(ap)) {
        setDriverNoteManuscript(raw.slice(ap.length).replace(/^\s*/, ''))
        return
      }
      if (raw.startsWith(ap.trimEnd())) {
        setDriverNoteManuscript(raw.slice(ap.trimEnd().length).replace(/^\s*/, ''))
        return
      }
    }
    setDriverNoteManuscript(raw)
  }
  const filteredPhoneCodes = useMemo(() => {
    const query = phoneCodeQuery.trim().toLowerCase()
    if (!query) return PHONE_CODES
    const normalizedCode = query.replace(/[^0-9+]/g, '')
    return PHONE_CODES.filter((option) => {
      const byCountry = option.country.toLowerCase().includes(query)
      const byDial = normalizedCode ? option.dialCode.includes(normalizedCode) : false
      const byIso = option.iso2.toLowerCase().includes(query)
      return byCountry || byDial || byIso
    })
  }, [phoneCodeQuery])

  useEffect(() => {
    setPickupDateTime(quote.departureAt?.trim() ?? '')
  }, [quote.departureAt])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const root = phoneCodePickerRef.current
      if (!root) return
      if (!root.contains(event.target as Node)) {
        setPhoneCodeOpen(false)
        setPhoneCodeQuery(formatPhoneCodeLabel(phoneCode))
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [phoneCode])

  function continueToPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your full name, email, and phone number.')
      return
    }

    if (pickupDateTime.trim() && isPickupDatetimeInPast(pickupDateTime)) {
      setError(PICKUP_IN_PAST_MESSAGE)
      return
    }

    if (routeQuoteLoading) {
      setError('Price is still being calculated. Please wait a moment.')
      return
    }

    if (routeQuoteError || estimatedPrice == null) {
      setError(routeQuoteError ?? 'Could not calculate the route price. Check pickup and drop-off.')
      return
    }

    setIsContinuing(true)
    try {
      onContinueToPayment({
        quote: quoteForSubmit,
        estimatedPriceEur: estimatedPrice,
        details: {
          flightNumber,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: `${phoneCode.dialCode} ${phone.trim()}`.trim(),
          note: addDriverNotes ? driverNoteCombined.trim() : '',
          infantCarrierCount: addChildSeats ? infantCarrierCount : 0,
          childSeatCount: addChildSeats ? childSeatCount : 0,
          boosterCount: addChildSeats ? boosterCount : 0,
        },
      })
    } finally {
      setIsContinuing(false)
    }
  }

  return (
    <main className="booking-page">
      <header className="booking-page-nav">
        <div className="booking-page-nav-inner">
          <div className="booking-page-brand">
            <span className="booking-page-brand-badge">
              <BrandLogoIcon width={20} height={20} />
            </span>
            <span className="booking-page-brand-name">{BRAND_NAME}</span>
          </div>
        </div>
      </header>
      <section className="booking-container">
        <div className="booking-left">
          <Button type="button" variant="ghost" className="booking-back-btn" onClick={onBack}>
            ← Back to quote
          </Button>
          <p className="booking-eyebrow">Review &amp; confirm</p>
          <h1 className="booking-heading">Booking details</h1>
          <p className="booking-lead">
            Add your flight if you have one, your contact details, and anything the driver should
            know.
          </p>
          <div className="booking-meta-chips" aria-label="Trip quick facts">
            <span className="booking-chip">
              {quote.passengers} passenger{quote.passengers > 1 ? 's' : ''}
            </span>
            <span className="booking-chip">{quote.luggage} luggage</span>
            {tripChildSeatsChip ? (
              <span className="booking-chip">{tripChildSeatsChip}</span>
            ) : null}
            <span className="booking-chip booking-chip--accent">{routeDate}</span>
          </div>

          <form onSubmit={continueToPayment} className="booking-form">
            <section
              className="booking-form-section"
              aria-labelledby="booking-section-trip"
            >
              <h2 id="booking-section-trip" className="booking-form-section-title">
                Flight &amp; seating
              </h2>
              <div className="booking-field booking-field-full">
                <span>Pickup time</span>
                <DateTimeLocalSplit
                  value={pickupDateTime}
                  onChange={setPickupDateTime}
                  inputClassName="booking-input-enhanced booking-datetime-local"
                  variant="booking"
                  hideDate
                  timeLabel="Time"
                />
              </div>
              <label className="booking-field booking-field-full">
                <span>Flight number (optional)</span>
                <Input
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g. VY1451"
                  className="booking-input-enhanced"
                />
              </label>

              <div className="booking-child-seats-section">
                <p className="booking-subsection-title">Child seats</p>
                <p className="booking-subsection-hint">
                  Request infant carriers, child seats, or boosters for this trip. You can skip this
                  if not needed.
                </p>
                <label className="booking-check booking-field-full booking-child-seats-toggle">
                  <input
                    type="checkbox"
                    checked={addChildSeats}
                    onChange={(e) => {
                      const on = e.target.checked
                      setAddChildSeats(on)
                      if (!on) {
                        setInfantCarrierCount(0)
                        setChildSeatCount(0)
                        setBoosterCount(0)
                      }
                    }}
                  />
                  <span>Add child seats</span>
                </label>
                {addChildSeats ? (
                  <div className="booking-child-seats booking-field-full" role="group" aria-label="Child seats">
                    <ChildSeatCounter
                      title="Infant carrier"
                      subtitle="0–6 months"
                      value={infantCarrierCount}
                      onChange={setInfantCarrierCount}
                    />
                    <ChildSeatCounter
                      title="Child seat"
                      subtitle="6 months – 3 years"
                      value={childSeatCount}
                      onChange={setChildSeatCount}
                    />
                    <ChildSeatCounter
                      title="Booster"
                      subtitle="3–12 years"
                      value={boosterCount}
                      onChange={setBoosterCount}
                    />
                  </div>
                ) : null}
              </div>
            </section>

            <section
              className="booking-form-section booking-form-section--grid"
              aria-labelledby="booking-section-contact"
            >
              <h2 id="booking-section-contact" className="booking-form-section-title">
                Your contact
              </h2>
              <label className="booking-field">
                <span>Full name *</span>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="As shown on your ID or booking"
                  required
                  className="booking-input-enhanced"
                />
              </label>

              <label className="booking-field">
                <span>Email *</span>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="booking-input-enhanced"
                />
              </label>

              <label className="booking-field booking-field-full">
                <span>Phone number *</span>
                <div className="booking-phone-row">
                  <div className="booking-phone-code-picker" ref={phoneCodePickerRef}>
                    <Input
                      value={phoneCodeQuery}
                      className={cn('booking-phone-code-input', 'booking-input-enhanced')}
                      aria-label="Search country code"
                      placeholder="Search country code"
                      onFocus={() => setPhoneCodeOpen(true)}
                      onChange={(e) => {
                        setPhoneCodeQuery(e.target.value)
                        setPhoneCodeOpen(true)
                      }}
                      onBlur={() => {
                        window.setTimeout(() => {
                          if (!phoneCodeOpen) {
                            setPhoneCodeQuery(formatPhoneCodeLabel(phoneCode))
                          }
                        }, 80)
                      }}
                    />
                    {phoneCodeOpen ? (
                      <div className="booking-phone-code-list" role="listbox" aria-label="Country codes">
                        {filteredPhoneCodes.length > 0 ? (
                          filteredPhoneCodes.map((option) => (
                            <button
                              key={`${option.iso2}-${option.dialCode}`}
                              type="button"
                              className="booking-phone-code-option"
                              onClick={() => {
                                setPhoneCode(option)
                                setPhoneCodeQuery(formatPhoneCodeLabel(option))
                                setPhoneCodeOpen(false)
                              }}
                            >
                              {formatPhoneCodeLabel(option)}
                            </button>
                          ))
                        ) : (
                          <div className="booking-phone-code-empty">No country found</div>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="6XX XXX XXX"
                    required
                  />
                </div>
              </label>

              <div className="booking-field-full booking-driver-notes-section">
                <label className="booking-check booking-field-full booking-driver-notes-toggle">
                  <input
                    type="checkbox"
                    checked={addDriverNotes}
                    onChange={(e) => {
                      const on = e.target.checked
                      setAddDriverNotes(on)
                      if (!on) {
                        setBulkyLuggage(false)
                        setWheelchairAccessible(false)
                        setDriverNoteManuscript('')
                      }
                    }}
                  />
                  <span>Add notes for the driver</span>
                </label>
                {addDriverNotes ? (
                  <>
                    <label className="booking-field booking-field-full">
                      <span className="sr-only">Notes for the driver</span>
                      <Textarea
                        value={driverNoteCombined}
                        onChange={(e) => onDriverNoteTextareaChange(e.target.value)}
                        placeholder="Type any extra instructions for your driver…"
                        rows={4}
                        className="booking-driver-notes-textarea"
                      />
                    </label>
                    <div className="booking-driver-note-options" role="group" aria-label="Quick driver notes">
                      <label className="booking-driver-option">
                        <input
                          type="checkbox"
                          checked={bulkyLuggage}
                          onChange={(e) => setBulkyLuggage(e.target.checked)}
                        />
                        <span className="booking-driver-option-text">
                          <span className="booking-driver-option-title">Bulky luggage</span>
                          <span className="booking-driver-option-sub">
                            Bikes, snowboards, big boxes, etc.
                          </span>
                        </span>
                      </label>
                      <label className="booking-driver-option">
                        <input
                          type="checkbox"
                          checked={wheelchairAccessible}
                          onChange={(e) => setWheelchairAccessible(e.target.checked)}
                        />
                        <span className="booking-driver-option-text">
                          <span className="booking-driver-option-title">Wheelchair accessible vehicle</span>
                        </span>
                      </label>
                    </div>
                  </>
                ) : null}
              </div>
            </section>

            {error ? (
              <p className="booking-error booking-field-full" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              className="booking-submit booking-field-full"
              disabled={isContinuing}
            >
              {isContinuing ? 'Continuing…' : 'Continue to payment'}
            </Button>
          </form>
        </div>

        <aside className="booking-right">
          <article className="booking-summary-card">
            <header className="booking-summary-header">
              <h2>Ride summary</h2>
              <span className="booking-summary-pill" aria-hidden="true">
                Est.
              </span>
            </header>
            <div className="booking-summary-body">
              <div className="booking-summary-row">
                <span className="booking-summary-label">From</span>
                <span className="booking-summary-value">{quote.pickup}</span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">To</span>
                <span className="booking-summary-value">{quote.dropoff}</span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">When</span>
                <span className="booking-summary-value">{routeDate}</span>
              </div>
              <div className="booking-summary-row booking-summary-row--split">
                <div className="booking-summary-stat" title="Passengers">
                  <span className="booking-summary-label booking-summary-label--stat">Passengers</span>
                  <span className="booking-summary-value booking-summary-value--num">
                    {quote.passengers}
                  </span>
                </div>
                <div className="booking-summary-stat" title="Luggage pieces">
                  <span className="booking-summary-label booking-summary-label--stat">Luggage</span>
                  <span className="booking-summary-value booking-summary-value--num">
                    {quote.luggage}
                  </span>
                </div>
              </div>
              {tripChildSeatsChip ? (
                <div className="booking-summary-row">
                  <span className="booking-summary-label">Child seats</span>
                  <span className="booking-summary-value">{tripChildSeatsChip}</span>
                </div>
              ) : null}
              {routeQuote ? (
                <div className="booking-summary-row">
                  <span className="booking-summary-label">Distance</span>
                  <span className="booking-summary-value">{routeQuote.distanceKm} km</span>
                </div>
              ) : null}
            </div>
            <footer className="booking-summary-footer">
              <p className="booking-price-label">Estimated total</p>
              <p className="booking-price">
                {routeQuoteLoading
                  ? 'Calculating…'
                  : estimatedPrice != null
                    ? formatEurBase(estimatedPrice)
                    : '—'}
              </p>
              {routeQuoteError ? (
                <p className="booking-price-error">{routeQuoteError}</p>
              ) : null}
            </footer>
          </article>
        </aside>
      </section>
    </main>
  )
}
