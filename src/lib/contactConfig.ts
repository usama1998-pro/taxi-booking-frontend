const DEFAULT_CONTACT_EMAIL = 'info@barcelonataxi24.com'

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL

export const CONTACT_WHATSAPP =
  import.meta.env.VITE_CONTACT_WHATSAPP?.trim() || ''

function whatsappDigits(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

export const CONTACT_WHATSAPP_URL = CONTACT_WHATSAPP
  ? `https://wa.me/${whatsappDigits(CONTACT_WHATSAPP)}`
  : ''

export function openContactEmail(): void {
  window.open(`mailto:${CONTACT_EMAIL}`, '_blank', 'noopener,noreferrer')
}

export function openContactWhatsApp(): void {
  if (CONTACT_WHATSAPP_URL) {
    window.open(CONTACT_WHATSAPP_URL, '_blank', 'noopener,noreferrer')
  }
}
