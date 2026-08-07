import { useState, type ChangeEvent, type FormEvent } from 'react'

import { submitContactInquiry } from '@/lib/contactInquiryApi'

type InquiryFormState = {
  name: string
  email: string
  phone: string
  bookingReference: string
  message: string
}

const EMPTY_FORM: InquiryFormState = {
  name: '',
  email: '',
  phone: '',
  bookingReference: '',
  message: '',
}

export function ContactInquiryForm() {
  const [values, setValues] = useState<InquiryFormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onChange =
    (field: keyof InquiryFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      if (error) setError('')
      if (success) setSuccess(false)
    }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = values.name.trim()
    const message = values.message.trim()
    const email = values.email.trim()
    const phone = values.phone.trim()
    const bookingReference = values.bookingReference.trim()

    if (!name) {
      setError('Please enter your name.')
      return
    }
    if (!message) {
      setError('Please enter a message.')
      return
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess(false)
    try {
      await submitContactInquiry({
        name,
        message,
        email: email || undefined,
        phone: phone || undefined,
        bookingReference: bookingReference || undefined,
      })
      setValues(EMPTY_FORM)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your message.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact-inquiry" aria-labelledby="contact-inquiry-heading">
      <div className="contact-inquiry-inner">
        <p className="contact-inquiry-eyebrow">Get in touch</p>
        <h2 id="contact-inquiry-heading" className="contact-inquiry-title">
          Send us a message.
        </h2>
        <p className="contact-inquiry-subtitle">
          Questions about your booking, special requests, or anything else? Write to us and
          we&apos;ll get back to you as soon as possible.
        </p>

        <form className="contact-inquiry-form" onSubmit={(e) => void onSubmit(e)} noValidate>
          <div className="contact-inquiry-grid">
            <label className="contact-inquiry-field">
              <span className="contact-inquiry-label">
                Your name <span aria-hidden="true">*</span>
              </span>
              <input
                className="contact-inquiry-input"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Full name"
                value={values.name}
                onChange={onChange('name')}
                required
                disabled={submitting}
              />
            </label>

            <label className="contact-inquiry-field">
              <span className="contact-inquiry-label">Email</span>
              <input
                className="contact-inquiry-input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={values.email}
                onChange={onChange('email')}
                disabled={submitting}
              />
            </label>

            <label className="contact-inquiry-field">
              <span className="contact-inquiry-label">Phone / WhatsApp</span>
              <input
                className="contact-inquiry-input"
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+1 555 123 4567"
                value={values.phone}
                onChange={onChange('phone')}
                disabled={submitting}
              />
            </label>

            <label className="contact-inquiry-field">
              <span className="contact-inquiry-label">Booking reference</span>
              <input
                className="contact-inquiry-input"
                type="text"
                name="bookingReference"
                autoComplete="off"
                placeholder="SCD-2026-… (optional)"
                value={values.bookingReference}
                onChange={onChange('bookingReference')}
                disabled={submitting}
              />
            </label>

            <label className="contact-inquiry-field contact-inquiry-field--full">
              <span className="contact-inquiry-label">
                Message <span aria-hidden="true">*</span>
              </span>
              <textarea
                className="contact-inquiry-textarea"
                name="message"
                rows={5}
                placeholder="How can we help?"
                value={values.message}
                onChange={onChange('message')}
                required
                disabled={submitting}
              />
            </label>
          </div>

          {error ? (
            <p className="contact-inquiry-error" role="alert">
              {error}
            </p>
          ) : null}

          {success && !error ? (
            <p className="contact-inquiry-hint" role="status">
              Thanks — your message was sent. We&apos;ll get back to you soon.
            </p>
          ) : null}

          <button type="submit" className="contact-inquiry-submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}
