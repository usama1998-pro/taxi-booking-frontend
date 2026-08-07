import { BRAND_NAME } from '@/lib/brandConfig'

const HIGHLIGHTS = [
  '24/7 service and customer support in Barcelona.',
  "Pickup in the arrival's hall of the airport. (Meet & Greet)",
  'Premium official Barcelona taxi sedans and minivans.',
  'Fixed and prepaid tariff on all rides.',
]

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.2l3 3.1 6-6.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ServiceIntro() {
  return (
    <section className="service-intro" aria-labelledby="service-intro-heading">
      <div className="service-intro-inner">
        <div className="service-intro-head">
          <p className="service-intro-eyebrow">About our service</p>
          <h2 id="service-intro-heading" className="service-intro-title">
            We provide an easy, friendly and personalized travel experience
          </h2>

          <ul className="service-intro-highlights">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight}>
                <CheckIcon className="service-intro-highlight-icon" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="service-intro-body">
          <p>
            We are an affordable airport transfers company to and from Barcelona International El
            Prat Airport. We also provide inter-city transfers from Barcelona to any city in Spain
            and across the Europe by private taxi.
          </p>
          <p>
            If you are planning a trip to Barcelona either alone, with family or for business,
            don&apos;t worry, we&apos;ve got you covered. We want you to enjoy what really matters
            and gives you a stress-free travel experience.
          </p>
          <p>
            Our qualified and local English-speaking drivers will ensure that you arrive safely to
            your hotel or destination.
          </p>
          <p>
            With {BRAND_NAME} you can get everything at one place whether you need a taxi to pick
            you up quickly, a transfer to or from the airport, or a premium taxi and professional
            chauffeur to get you to your next meeting.
          </p>
          <p>
            Your chauffeur will be waiting for you upon arrival at Barcelona International El Prat
            Airport with a name sign. Our driver will track the flight. If it&apos;s delayed,
            they&apos;ll wait.
          </p>
          <p>
            All of our rates are fixed and prepaid so you will be able to calculate how much it
            will exactly cost you for your trip.
          </p>
        </div>
      </div>
    </section>
  )
}
