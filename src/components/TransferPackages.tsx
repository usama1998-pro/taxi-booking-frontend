const PACKAGES = [
  {
    title: 'City to Airport',
    description:
      'Private transfer from Barcelona city to El Prat (BCN). Fixed fare, flight-aware timing, and a clean official taxi.',
    features: ['Hotel or any city pickup', 'Fixed prepaid fare', 'Luggage included'],
    cta: 'Book city–airport',
    href: 'https://www.viator.com/en-GB/search/406570P11?mcid=70066',
    image: '/assets/airport.jpg',
    imagePosition: 'center 35%',
  },
  {
    title: 'City to Cruise Port',
    description:
      'Direct private transfer from Barcelona to all cruise terminals — Moll Adossat A–D and World Trade Center.',
    features: ['Covers all 5 terminals', 'Punctual ship-time pickup', 'Heavy cruise luggage OK'],
    cta: 'Book cruise port',
    href: 'https://www.viator.com/en-GB/search/406570P62?mcid=70066',
    image: '/assets/cruise-port.jpg',
    imagePosition: 'center 45%',
  },
  {
    title: 'Cruise Port to City',
    description:
      'Meet at your Barcelona cruise terminal and ride private to your hotel or any city address — no shared shuttle.',
    features: ['Name board at terminal', 'No shared shuttle waits', 'English-speaking drivers'],
    cta: 'Book cruise–city',
    href: 'https://www.viator.com/en-GB/search/406570P60?mcid=70066',
    image: '/assets/barcelona3.jpg',
    imagePosition: 'center 40%',
  },
  {
    title: 'Cruise Port to Airport',
    description:
      'Seamless private transfer from Barcelona cruise terminals straight to El Prat Airport with time to spare.',
    features: ['Terminal-to-terminal', 'Ship and flight timing', 'Fixed fare in advance'],
    cta: 'Book cruise–airport',
    href: 'https://www.viator.com/en-GB/search/406570P17?mcid=70066',
    image: '/assets/barcelona.jpg',
    imagePosition: 'center 60%',
  },
] as const

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

export function TransferPackages() {
  return (
    <section className="transfer-packages" aria-labelledby="transfer-packages-heading">
      <div className="transfer-packages-inner">
        <h2 id="transfer-packages-heading" className="transfer-packages-title">
          Private transfers, never shared shuttles.
        </h2>
        <p className="transfer-packages-subtitle">
          Every booking is reserved only for your group. No waiting for other passengers, no
          detours, no meter running in traffic.
        </p>

        <ul className="transfer-packages-grid">
          {PACKAGES.map((pkg) => (
            <li key={pkg.href} className="transfer-package-card">
              <div className="transfer-package-image-wrap">
                <img
                  className="transfer-package-image"
                  src={pkg.image}
                  alt=""
                  style={{ objectPosition: pkg.imagePosition }}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="transfer-package-body">
                <span className="transfer-package-badge" aria-hidden="true">
                  <CheckIcon className="transfer-package-badge-icon" />
                </span>

                <h3 className="transfer-package-name">{pkg.title}</h3>
                <p className="transfer-package-desc">{pkg.description}</p>

                <ul className="transfer-package-features">
                  {pkg.features.map((feature) => (
                    <li key={feature}>
                      <CheckIcon className="transfer-package-feature-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  className="transfer-package-cta"
                  href={pkg.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pkg.cta}
                  <span aria-hidden="true"> →</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
