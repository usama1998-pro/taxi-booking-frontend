import { apiUrl, parseJsonErrorBody } from '@/lib/apiBase'

export type ContactInquiryPayload = {
  name: string
  message: string
  email?: string
  phone?: string
  bookingReference?: string
}

export async function submitContactInquiry(
  payload: ContactInquiryPayload,
): Promise<void> {
  const res = await fetch(apiUrl('/mail/inquiry'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      message: payload.message,
      email: payload.email || undefined,
      phone: payload.phone || undefined,
      bookingReference: payload.bookingReference || undefined,
    }),
  })

  const json = (await res.json().catch(() => null)) as
    | { success?: boolean; message?: string; detail?: unknown }
    | null

  if (!res.ok) {
    throw new Error(parseJsonErrorBody(json) ?? 'Could not send your message.')
  }
}
