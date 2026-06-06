import { BRAND_NAME } from '@/lib/brandConfig'

function StripeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-payment-icon footer-payment-icon--stripe">
      <path
        fill="currentColor"
        d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252 1.495 15.697.5 12.165.5 9.342.5 7.018 1.335 5.678 2.841 4.5 4.153 3.955 5.906 3.955 8.037c0 4.521 2.764 6.504 7.277 8.077 2.568.931 3.369 1.553 3.369 2.639 0 .914-.796 1.431-2.127 1.431-1.72 0-4.516-.921-6.378-2.168l-.9 5.555C8.28 23.328 11.365 24 14.651 24c2.928 0 5.375-.812 6.735-2.276 1.262-1.363 1.912-3.299 1.912-5.741 0-4.758-3.134-6.677-7.322-8.033z"
      />
    </svg>
  )
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-payment-icon footer-payment-icon--paypal">
      <path
        fill="#003087"
        d="M8.94 19.02a.46.46 0 0 1-.45-.39l-1.34-8.5a.55.55 0 0 1 .54-.64h5.02c2.94 0 5.2.89 5.93 3.35.39 1.44-.28 2.48-1.45 3.22-1.12.72-2.45 1.18-4.12 1.24l.99 5.6a.4.4 0 0 0 .39.47h2.68l1.1-6.98a.55.55 0 0 0-.54-.64h-1.17a.46.46 0 0 1-.45-.39l-.78-4.96z"
      />
      <path
        fill="#009CDE"
        d="M16.72 7.58h-5.02c-2.94 0-5.2.89-5.93 3.35-.39 1.44.28 2.48 1.45 3.22 1.12.72 2.45 1.18 4.12 1.24l1.18 7.48a.4.4 0 0 0 .39.47h2.68l1.38-8.76a.55.55 0 0 0-.54-.64h-1.15a.46.46 0 0 1-.45-.39l-1.01-6.41z"
      />
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="footer-payment-icon footer-payment-icon--mastercard">
      <circle cx="18" cy="15" r="12" fill="#EB001B" />
      <circle cx="30" cy="15" r="12" fill="#F79E1B" />
      <path fill="#FF5F00" d="M24 7.05a12 12 0 0 1 0 15.9 12 12 0 0 1 0-15.9z" />
    </svg>
  )
}

function VisaIcon() {
  return (
    <svg viewBox="0 0 48 16" aria-hidden="true" className="footer-payment-icon footer-payment-icon--visa">
      <path
        fill="#1434CB"
        d="M19.5 15.5h-3.2l2-12.4h3.2l-2 12.4zm13.1-12.1c-.6-.2-1.6-.4-2.8-.4-3.1 0-5.3 1.6-5.3 4 0 1.7 1.5 2.7 2.7 3.3 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-3-.6l-.4-.2-.4 2.7c.7.3 2.1.6 3.6.6 3.3 0 5.4-1.6 5.5-4.1 0-1.4-.9-2.4-2.8-3.3-1.2-.6-1.9-.9-1.9-1.5 0-.5.6-.9 1.6-.9 1 0 1.7.2 2.3.5l.3.1.4-2.6zm8.5 8.4h2.8l-2.3-12.4h-2.6c-.8 0-1.4.4-1.7 1.1l-4.7 11.3h3.2l.7-1.8h3.9l.4 1.8zm-3.4-4.2 1.6-4.4.9 4.4h-2.5zM9.2 3.1 6.1 12.8 5.7 11c-1-1-2.6-2-4.5-2.5l2.9 9.5h3.4l5.1-15.7H9.2z"
      />
    </svg>
  )
}

import { BrandLogoIcon } from '@/components/BrandLogoIcon'

const PAYMENT_METHODS = [
  { id: 'stripe', name: 'Stripe', Icon: StripeIcon },
  { id: 'paypal', name: 'PayPal', Icon: PayPalIcon },
  { id: 'visa', name: 'Visa', Icon: VisaIcon },
  { id: 'mastercard', name: 'Mastercard', Icon: MastercardIcon },
] as const

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-gradient" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-logo-icon">
                <BrandLogoIcon width={24} height={24} />
              </span>
              <span className="footer-logo-text">{BRAND_NAME}</span>
            </div>
            <p className="footer-tagline">
              Fixed-price airport transfers across Barcelona and Catalonia.
            </p>
          </div>

          <div className="footer-payments">
            <h2 className="footer-heading">Payment methods accepted</h2>
            <ul className="footer-payment-list">
              {PAYMENT_METHODS.map(({ id, name, Icon }) => (
                <li key={id} className="footer-payment-item">
                  <span className="footer-payment-badge" title={name}>
                    <Icon />
                    <span className="sr-only">{name}</span>
                  </span>
                  <span className="footer-payment-label">{name}</span>
                </li>
              ))}
            </ul>
            <p className="footer-payment-note">
              Secure checkout powered by Stripe and PayPal. Major cards including Visa and Mastercard
              are accepted.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-contact">
            24/7 customer support · Barcelona El Prat airport transfers · Meet &amp; greet in
            arrivals
          </p>
          <p className="footer-copy">&copy; {year} {BRAND_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
