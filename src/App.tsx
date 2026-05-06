import { useEffect, useState } from 'react'

import { BookingDetailsPage } from '@/components/BookingDetailsPage'
import { BookingSuccessPage } from '@/components/BookingSuccessPage'
import { CurrencyMenu } from '@/components/CurrencyMenu'
import type { BookingSuccessPayload } from '@/lib/bookingsApi'
import { QuoteForm, type QuoteFormValues } from '@/components/QuoteForm'
import './App.css'

const HERO_BG_IMAGES = [
  '/assets/barcelona.jpg',
  '/assets/barcelona2.jpg',
  '/assets/barcelona3.jpg',
] as const

const HERO_BG_INTERVAL_MS = 5500

function App() {
  const [heroBgIndex, setHeroBgIndex] = useState(0)
  const [draftQuote, setDraftQuote] = useState<QuoteFormValues | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccessPayload | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroBgIndex((i) => (i + 1) % HERO_BG_IMAGES.length)
    }, HERO_BG_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  if (bookingSuccess) {
    return (
      <BookingSuccessPage
        data={bookingSuccess}
        onBookAnother={() => {
          setBookingSuccess(null)
          setDraftQuote(null)
          setShowBookingDetails(false)
        }}
      />
    )
  }

  if (showBookingDetails && draftQuote) {
    return (
      <BookingDetailsPage
        quote={draftQuote}
        onBack={() => setShowBookingDetails(false)}
        onBookingSuccess={(payload) => setBookingSuccess(payload)}
      />
    )
  }

  return (
    <main className="page">
      <div className="hero-bg-crossfade" aria-hidden="true">
        <div className="hero-bg-slides">
          {HERO_BG_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={i === heroBgIndex ? 'is-active' : ''}
              decoding="async"
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          ))}
        </div>
        <div className="hero-bg-overlay" />
      </div>

      <header className="top-nav">
        <div className="brand">
          <span className="brand-name">BarcelonTaxi24</span>
        </div>
        <div className="menu-right">
          <a href="/">EN</a>
          <CurrencyMenu variant="hero" />
          <a href="/">Help</a>
        </div>
      </header>

      <section className="layout">
        <section className="hero-section">
          <div className="hero-left">
            <div className="hero-body">
              <h1>Barcelona Airport Taxi</h1>

              <ul className="benefits">
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="9" r="5" />
                      <path d="M9 14l3 6 3-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2>Trained Drivers</h2>
                  <p>Hand picked &amp; english speaking drivers.</p>
                </li>
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                      <path d="M7 10h10M7 14h6" />
                    </svg>
                  </span>
                  <h2>Low Prices</h2>
                  <p>Same price as a regular Taxi from the line.</p>
                </li>
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>
                  <h2>Flight Monitoring</h2>
                  <p>Drivers are always on time.</p>
                </li>
                <li>
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 14v2a3 3 0 003 3h1M20 14v2a3 3 0 01-3 3h-1M7 14a5 5 0 0110 0v5H7v-5z"
                      />
                    </svg>
                  </span>
                  <h2>Quality Support</h2>
                  <p>24/7 Email &amp; Phone support.</p>
                </li>
              </ul>
            </div>

            <p className="breadcrumbs">Airport taxi &gt; Barcelona &gt; Barcelona Airport Taxi</p>
          </div>
        </section>

        <div className="content-column">
          <section className="info-section">
            <div className="share-rail" aria-label="Social share">
              <span>Share</span>
              <a href="/">f</a>
              <a href="/">x</a>
              <a href="/">@</a>
            </div>

            <article className="article-card">
              <h2>Barcelona Airport Taxi Service</h2>
              <p>
                You have stepped off the plane in the beautiful city of Barcelona, Spain, and
                the last thing you want to do is navigate public transport with heavy luggage.
                A direct airport taxi is the easiest way to reach your destination.
              </p>
              <p>
                Official taxis line up right outside Barcelona-El Prat Airport 24/7. Rides are
                door-to-door and usually get you to the city center in under 20 minutes, depending
                on traffic.
              </p>
              <p>
                It is a smart option if you are traveling with children, older family members, or
                extra bags, and often more practical than juggling multiple public transport
                connections.
              </p>

              <h4 className="section-title">Barcelona Airport taxi price</h4>
              <p>
                Barcelona Airport taxi prices are calculated using a taximeter, so your final fare
                depends on distance, time of day, and any supplements. The following rates apply for
                trips within the Barcelona metropolitan area:
              </p>

              <ul className="fare-list">
                <li>
                  <strong>Base fare:</strong> EUR 2.75
                </li>
                <li>
                  <strong>Rate per km (08:00 - 22:00):</strong> EUR 1.32
                </li>
                <li>
                  <strong>Rate per km (22:00 - 08:00):</strong> EUR 1.62
                </li>
                <li>
                  <strong>Airport supplement (from BCN):</strong> EUR 4.50
                </li>
                <li>
                  <strong>Large vehicle supplement (5-8 passengers):</strong> EUR 4.50
                </li>
                <li>
                  <strong>Road tolls:</strong> Charged in addition to the metered fare
                </li>
                <li>
                  <strong>Minimum fare for airport trips:</strong> EUR 21
                </li>
              </ul>

              <p>
                For example, the 20-minute taxi from Barcelona Airport to the city center costs
                approximately EUR 35-40. Trips to Sitges can cost anywhere between EUR 55 and EUR
                68, depending on the time of day and traffic conditions.
              </p>
              <p>
                To avoid any uncertainty, pre-booked transfers offer fixed fares for a number of
                routes and vehicle types. That way you can skip hidden extras such as surcharges or
                toll surprises after you land.
              </p>

              <section className="guide-section" aria-labelledby="taxi-locations-heading">
                <h4 id="taxi-locations-heading" className="guide-heading">
                  Where to get a taxi at Barcelona Airport?
                </h4>
                <p>
                  At Terminal 1 (T1), follow signs to the taxi rank outside the arrivals hall. The
                  queue is organized and only official black-and-yellow Barcelona taxis use this
                  area.
                </p>
                <p>
                  Terminals T2A, T2B, and T2C each have dedicated taxi stands near the baggage
                  reclaim and exit doors. Look for the illuminated &quot;Taxi&quot; signs and staff
                  if you are unsure which lane to join.
                </p>
                <p>
                  Official taxi booths are marked with the city crest and standard fares are posted
                  nearby. Most sedans take up to four passengers; larger groups should request a
                  minivan or book a vehicle with more seats in advance.
                </p>
                <p>
                  If you prefer a fixed price and a driver waiting with a name sign, pre-booked
                  transfers pick up in the same general arrivals zones, with meeting points
                  confirmed in your booking email.
                </p>

                <h4 className="guide-heading guide-heading-spaced" id="taxi-tips-heading">
                  Useful tips for getting a taxi from Barcelona Airport
                </h4>
                <ol className="tips-list">
                  <li>
                    Expect a minimum fare on airport trips; the meter starts from the regulated
                    base rate plus any supplements.
                  </li>
                  <li>
                    Journeys inside the metropolitan area use standard tariffs; longer trips outside
                    the city may switch to different per-kilometre rules.
                  </li>
                  <li>
                    An airport supplement applies for pickups at BCN; it should appear on the
                    meter or receipt.
                  </li>
                  <li>
                    Avoid drivers who approach you inside the terminal without an official queue;
                    use only the marked taxi rank or a licensed pre-booked service.
                  </li>
                  <li>
                    Ask for a receipt (recibo) if you need one for expenses; it shows the taxi
                    licence number and fare breakdown.
                  </li>
                  <li>
                    At peak times (weekends, holidays, late nights) queues can grow; allow extra
                    time or consider booking ahead.
                  </li>
                  <li>
                    Tipping is optional; rounding up a small amount is appreciated but not
                    required.
                  </li>
                  <li>
                    Card payment is increasingly accepted, but not every vehicle has a terminal;
                    carrying some cash is still sensible.
                  </li>
                  <li>
                    For toll motorways (where applicable), tolls are added to the metered total.
                  </li>
                  <li>
                    If your destination is unusual, show the full address on your phone to reduce
                    confusion and help the driver choose the best route.
                  </li>
                </ol>
              </section>

              <section className="hotel-section" aria-labelledby="hotel-taxi-heading">
                <h4 id="hotel-taxi-heading" className="hotel-heading">
                  A Barcelona Airport taxi to your hotel
                </h4>
                <p>
                  After a long flight, a taxi straight to your hotel is often the simplest option.
                  You skip deciphering metro maps, changing lines with suitcases, and navigating
                  crowded platforms when you are already tired.
                </p>
                <p>
                  A door-to-door ride means your driver drops you at the hotel entrance, which is
                  especially welcome in summer heat or if you are arriving late at night when
                  public transport runs less frequently.
                </p>
                <p>
                  Many travellers also prefer the predictability of a private transfer or a
                  licensed taxi for peace of mind, particularly if you are new to the city or
                  travelling with valuables or work equipment.
                </p>

                <h4 className="hotel-heading hotel-heading-spaced" id="traveling-kids-heading">
                  Traveling with kids?
                </h4>
                <p>
                  Child restraint rules differ between short urban trips and longer interurban
                  journeys. For typical airport-to-city rides within the metropolitan area, the
                  rules applied by taxis can differ from what you expect at home, so check current
                  local guidance if a car seat is essential for you.
                </p>
                <p>
                  For longer trips outside the urban zone, appropriate child seats are usually
                  required by law. If you need a specific seat type, booking a private transfer in
                  advance is the easiest way to guarantee the right equipment.
                </p>
                <p>
                  Public transport in Barcelona can accommodate folded strollers and offers space
                  for families, but stairs, gaps, and busy carriages can still be challenging right
                  after landing with tired children and full luggage.
                </p>
              </section>

              <section className="article-faq" aria-labelledby="faq-heading">
                <div className="article-faq-panel">
                  <div className="article-faq-inner">
                    <h2 id="faq-heading" className="faq-title">
                      Frequently asked questions
                    </h2>

                    <div className="faq-item">
                      <h3 className="faq-question">How far is Barcelona Airport from the city center?</h3>
                      <p className="faq-answer">
                        Barcelona-El Prat International Airport (BCN) is about 15 km from the city
                        center. By car or taxi the journey usually takes around 20 minutes, depending on
                        traffic. A taxi from the airport to the city center typically costs between EUR 25
                        and EUR 35, though the exact fare can vary with time of day and route.
                      </p>
                    </div>

                    <div className="faq-item">
                      <h3 className="faq-question">Do you tip Barcelona Airport taxi drivers?</h3>
                      <p className="faq-answer">
                        Tipping is not obligatory for airport taxis in Barcelona, but it is appreciated.
                        If your driver was especially helpful or you had a great ride, rounding up the fare
                        is a simple way to say thanks.
                      </p>
                    </div>

                    <div className="faq-item">
                      <h3 className="faq-question">Can I flag down a taxi at Barcelona Airport?</h3>
                      <p className="faq-answer">
                        You cannot hail a taxi from the kerb inside the airport complex. Head to the
                        official taxi rank and join the queue. If you need a wheelchair-accessible vehicle
                        or a larger taxi, ask the rank attendant and they can help assign a suitable
                        vehicle.
                      </p>
                    </div>

                    <div className="faq-item">
                      <h3 className="faq-question">Do taxis at Barcelona Airport take credit card?</h3>
                      <p className="faq-answer">
                        Many taxis accept card payments, but not all vehicles are equipped with terminals.
                        It is best to ask your driver before you start the trip whether they can take card
                        or prefer cash.
                      </p>
                    </div>

                    <div className="faq-item">
                      <h3 className="faq-question">Is it easy to get a taxi from Barcelona Airport?</h3>
                      <p className="faq-answer">
                        Yes. Official taxis are available at the designated ranks for most of the day and
                        night. At peak times you may wait a little longer in the queue, but the system is
                        straightforward and clearly signposted from arrivals.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </article>
          </section>
        </div>

        <QuoteForm
          initialValues={draftQuote}
          onContinue={(values) => {
            setDraftQuote(values)
            setShowBookingDetails(true)
          }}
        />
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <div className="footer-logo">
                <span className="footer-logo-icon" aria-hidden="true">
                  W
                </span>
                <span className="footer-logo-text">Welcome</span>
              </div>
              <a href="/" className="footer-help-btn">
                <span className="footer-help-icon" aria-hidden="true">
                  ?
                </span>
                Help
              </a>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Mobile app</h3>
              <div className="footer-app-badges">
                <a href="/" className="app-badge app-badge-apple">
                  Download on the App Store
                </a>
                <a href="/" className="app-badge app-badge-google">
                  GET IT ON Google Play
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">About</h3>
              <ul className="footer-links">
                <li>
                  <a href="/">Company</a>
                </li>
                <li>
                  <a href="/">Blog</a>
                </li>
                <li>
                  <a href="/">Newsroom</a>
                </li>
                <li>
                  <a href="/">Terms of Use</a>
                </li>
                <li>
                  <a href="/">Privacy Policy</a>
                </li>
                <li>
                  <a href="/">Welcome Rewards</a>
                </li>
                <li>
                  <a href="/">Refer a friend</a>
                </li>
                <li>
                  <a href="/">Careers</a>
                </li>
                <li>
                  <a href="/">Cookie Settings</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Network</h3>
              <ul className="footer-links">
                <li>
                  <a href="/">Hotels</a>
                </li>
                <li>
                  <a href="/">Vacation Rentals</a>
                </li>
                <li>
                  <a href="/">Affiliates</a>
                </li>
                <li>
                  <a href="/">Individual Drivers</a>
                </li>
                <li>
                  <a href="/">Driver Companies</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Payment methods</h3>
              <p className="footer-payment-text">All Credit Cards Accepted</p>
              <p className="footer-payment-text">PayPal</p>
              <p className="footer-checkout">Checkout.com</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-contact">
              Barcelona Airport Taxi - Welcome Pickups - Phone: +34 932 200 239, Barcelona, Spain
            </p>
            <div className="footer-social" aria-label="Social media">
              <a href="/" className="footer-social-link" aria-label="X">
                X
              </a>
              <a href="/" className="footer-social-link" aria-label="Facebook">
                f
              </a>
              <a href="/" className="footer-social-link" aria-label="Instagram">
                in
              </a>
              <a href="/" className="footer-social-link" aria-label="Dribbble">
                D
              </a>
              <a href="/" className="footer-social-link" aria-label="LinkedIn">
                Li
              </a>
            </div>
            <p className="footer-copy">&copy; 2011 - 2026 All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
