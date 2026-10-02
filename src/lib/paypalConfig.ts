/** Set to true to show PayPal checkout again. */
export const PAYPAL_ENABLED = false

/** Public PayPal client id from Vite env (embedded at build time). */
export function getPayPalClientId(): string | undefined {
  const id = import.meta.env.VITE_PAYPAL_CLIENT_ID?.trim()
  return id || undefined
}

export function isPayPalConfigured(): boolean {
  return PAYPAL_ENABLED && Boolean(getPayPalClientId())
}

export function getPayPalLocale(): string {
  return import.meta.env.VITE_PAYPAL_LOCALE?.trim() || 'en_US'
}
