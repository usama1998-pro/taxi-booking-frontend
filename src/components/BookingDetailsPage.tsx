import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import type { QuoteFormValues } from '@/components/QuoteForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  createBookingFromForms,
  type BookingSuccessPayload,
} from '@/lib/bookingsApi'

type BookingDetailsPageProps = {
  quote: QuoteFormValues
  onBack: () => void
  onBookingSuccess: (payload: BookingSuccessPayload) => void
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

function formatPhoneCodeLabel(option: PhoneCodeOption): string {
  return `${option.flag} ${option.country} (${option.dialCode})`
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

function estimatePrice(quote: QuoteFormValues): number {
  const base = 44
  const passengerExtra = Math.max(0, quote.passengers - 1) * 6
  const luggageExtra = quote.luggage * 2
  return base + passengerExtra + luggageExtra
}

export function BookingDetailsPage({
  quote,
  onBack,
  onBookingSuccess,
}: BookingDetailsPageProps) {
  const [flightNumber, setFlightNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const initialCode = PHONE_CODES.find((x) => x.iso2 === 'ES') ?? PHONE_CODES[0]
  const [phoneCode, setPhoneCode] = useState<PhoneCodeOption>(initialCode)
  const [phoneCodeQuery, setPhoneCodeQuery] = useState(formatPhoneCodeLabel(initialCode))
  const [phoneCodeOpen, setPhoneCodeOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [agree, setAgree] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const phoneCodePickerRef = useRef<HTMLDivElement | null>(null)

  const estimatedPrice = useMemo(() => estimatePrice(quote), [quote])
  const routeDate = useMemo(() => formatRouteDate(quote.departureAt), [quote.departureAt])
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

  async function submitFinalBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your full name, email, and phone number.')
      return
    }
    if (!agree) {
      setError('Please agree to receive updates via email and sms.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createBookingFromForms(quote, {
        flightNumber,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: `${phoneCode.dialCode} ${phone.trim()}`.trim(),
        note: note.trim(),
      })
      onBookingSuccess({
        uuid: result.uuid,
        assignmentMessage: result.assignmentMessage,
        driver: result.driver,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit booking.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="booking-page">
      <section className="booking-container">
        <div className="booking-left">
          <Button type="button" variant="ghost" className="booking-back-btn" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="booking-heading">Booking Details</h1>
          <div className="booking-meta-chips" aria-label="Trip quick facts">
            <span className="booking-chip">
              {quote.passengers} passenger{quote.passengers > 1 ? 's' : ''}
            </span>
            <span className="booking-chip">{quote.luggage} luggage</span>
            <span className="booking-chip">{routeDate}</span>
          </div>

          <form onSubmit={submitFinalBooking} className="booking-form">
            <label className="booking-field booking-field-full">
              <span>Flight number (optional)</span>
              <Input
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g. VY1451"
              />
            </label>

            <label className="booking-field">
              <span>Your full name *</span>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </label>

            <label className="booking-field">
              <span>Your email *</span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </label>

            <label className="booking-field">
              <span>Your phone number * </span>
              <div className="booking-phone-row">
                <div className="booking-phone-code-picker" ref={phoneCodePickerRef}>
                  <Input
                    value={phoneCodeQuery}
                    className="booking-phone-code-input"
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

            <label className="booking-field booking-field-full">
              <span>Extra note</span>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions for the driver..."
                rows={3}
              />
            </label>

            <label className="booking-check booking-field-full">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>I agree to receive email updates & sms.</span>
            </label>

            {error ? (
              <p className="booking-error booking-field-full" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              className="booking-submit booking-field-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </Button>
          </form>
        </div>

        <aside className="booking-right">
          <article className="booking-summary-card">
            <h2>Ride summary</h2>
            <p>
              <strong>From:</strong> {quote.pickup}
            </p>
            <p>
              <strong>To:</strong> {quote.dropoff}
            </p>
            <p>
              <strong>When:</strong> {routeDate}
            </p>
            <p>
              <strong>Passengers:</strong> {quote.passengers}
            </p>
            <p>
              <strong>Luggage:</strong> {quote.luggage}
            </p>
            <p className="booking-price">€{estimatedPrice}</p>
          </article>
        </aside>
      </section>
    </main>
  )
}
