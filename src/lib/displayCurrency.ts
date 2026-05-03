/**
 * Indicative FX from EUR for UI display only. Fares are stored and charged in EUR.
 * Refresh periodically if you need accuracy for non-EUR display.
 */
export const BOOKING_BASE_CURRENCY = 'EUR' as const

const DISPLAY_CODES = [
  'EUR',
  'USD',
  'GBP',
  'CAD',
  'AUD',
  'CHF',
  'JPY',
  'MXN',
  'BRL',
  'TRY',
  'IDR',
  'ZAR',
  'THB',
] as const
export type DisplayCurrencyCode = (typeof DISPLAY_CODES)[number]

/** Units of `target` currency per 1 EUR. */
const EUR_TO: Record<DisplayCurrencyCode, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.84,
  CAD: 1.5,
  AUD: 1.67,
  CHF: 0.95,
  JPY: 165,
  MXN: 18.6,
  BRL: 6.05,
  TRY: 36.5,
  IDR: 17250,
  ZAR: 19.8,
  THB: 38.5,
}

export const DISPLAY_CURRENCY_OPTIONS: {
  code: DisplayCurrencyCode
  /** Short label for the header trigger (e.g. C$). */
  compact: string
  label: string
}[] = [
  { code: 'EUR', compact: '€', label: 'Euro (EUR)' },
  { code: 'USD', compact: '$', label: 'US Dollar (USD)' },
  { code: 'GBP', compact: '£', label: 'British Pound (GBP)' },
  { code: 'CAD', compact: 'C$', label: 'Canadian Dollar (CAD)' },
  { code: 'AUD', compact: 'A$', label: 'Australian Dollar (AUD)' },
  { code: 'CHF', compact: 'CHF', label: 'Swiss Franc (CHF)' },
  { code: 'JPY', compact: '¥', label: 'Japanese Yen (JPY)' },
  { code: 'MXN', compact: 'MX$', label: 'Mexican Peso (MXN)' },
  { code: 'BRL', compact: 'R$', label: 'Brazilian Real (BRL)' },
  { code: 'TRY', compact: '₺', label: 'Turkish Lira (TRY)' },
  { code: 'IDR', compact: 'Rp', label: 'Indonesian Rupiah (IDR)' },
  { code: 'ZAR', compact: 'R', label: 'South African Rand (ZAR)' },
  { code: 'THB', compact: '฿', label: 'Thai Baht (THB)' },
]

export function isDisplayCurrencyCode(value: string): value is DisplayCurrencyCode {
  return (DISPLAY_CODES as readonly string[]).includes(value)
}

export function convertEurTo(amountEur: number, target: DisplayCurrencyCode): number {
  return amountEur * EUR_TO[target]
}

function displayCurrencyFractionDigits(target: DisplayCurrencyCode): number {
  if (target === 'JPY' || target === 'IDR') {
    return 0
  }
  return 2
}

export function formatEurInDisplayCurrency(amountEur: number, target: DisplayCurrencyCode): string {
  const n = convertEurTo(amountEur, target)
  const fd = displayCurrencyFractionDigits(target)
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: target,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: fd,
    maximumFractionDigits: fd,
  }).format(n)
}

export function formatEurBase(amountEur: number): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: BOOKING_BASE_CURRENCY,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amountEur)
}
