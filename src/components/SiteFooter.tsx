import { BrandLogoIcon } from '@/components/BrandLogoIcon'
import { BRAND_NAME } from '@/lib/brandConfig'

const PAYMENT_METHODS = [
  { id: 'stripe', name: 'Stripe', src: '/assets/payments/stripe.svg' },
  { id: 'paypal', name: 'PayPal', src: '/assets/payments/paypal.svg' },
  { id: 'visa', name: 'Visa', src: '/assets/payments/visa.svg' },
  { id: 'mastercard', name: 'Mastercard', src: '/assets/payments/mastercard.svg' },
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
              {PAYMENT_METHODS.map(({ id, name, src }) => (
                <li key={id} className="footer-payment-item">
                  <span className="footer-payment-badge" title={name}>
                    <img
                      className={`footer-payment-logo footer-payment-logo--${id}`}
                      src={src}
                      alt={name}
                      width={120}
                      height={80}
                      loading="lazy"
                      decoding="async"
                    />
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
