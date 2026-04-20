import { useState } from 'react'
import './App.css'

function App() {
  const [isReturnTrip, setIsReturnTrip] = useState(false)

  return (
    <main className="page">
      <header className="top-nav">
        <div className="brand">
          <span className="brand-badge" aria-hidden="true">
            WP
          </span>
          <span className="brand-name">Welcome Pickups</span>
        </div>
        <nav className="menu" aria-label="Primary">
          <a href="/">Transfers</a>
          <a href="/">Sightseeing Rides</a>
          <a href="/">Guides</a>
          <a href="/">For Partners</a>
          <a href="/">For Drivers</a>
          <a href="/">Company</a>
        </nav>
        <div className="menu-right">
          <a href="/">EN</a>
          <a href="/">Help</a>
        </div>
      </header>

      <section className="layout">
        <div className="content-column">
          <section className="hero-section">
            <div className="hero-left">
              <h1>Barcelona Airport Taxi</h1>

              <ul className="benefits">
                <li>
                  <span className="benefit-icon">V</span>
                  <h2>Trained Drivers</h2>
                  <p>Hand picked and English-speaking professionals.</p>
                </li>
                <li>
                  <span className="benefit-icon">$</span>
                  <h2>Low Prices</h2>
                  <p>Same price as a regular city taxi line.</p>
                </li>
                <li>
                  <span className="benefit-icon">O</span>
                  <h2>Flight Monitoring</h2>
                  <p>Drivers are always on time for your arrival.</p>
                </li>
                <li>
                  <span className="benefit-icon">?</span>
                  <h2>24/7 Support</h2>
                  <p>Email and phone support, any time you need help.</p>
                </li>
              </ul>

              <p className="breadcrumbs">Airport taxi &gt; Barcelona &gt; Barcelona Airport Taxi</p>
            </div>
          </section>

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

              <h3>How much are Barcelona Airport taxis?</h3>
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Taxi prices</th>
                    <th>Day time</th>
                    <th>Night time</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Barcelona Airport to city center</td>
                    <td>35 EUR</td>
                    <td>40 EUR</td>
                    <td>20 min</td>
                  </tr>
                  <tr>
                    <td>Barcelona Airport to Las Ramblas</td>
                    <td>45 EUR</td>
                    <td>50 EUR</td>
                    <td>30 min</td>
                  </tr>
                  <tr>
                    <td>Barcelona Airport to Sants Train Station</td>
                    <td>35 EUR</td>
                    <td>40 EUR</td>
                    <td>20 min</td>
                  </tr>
                  <tr>
                    <td>Barcelona Airport to Cruise Port</td>
                    <td>45 EUR</td>
                    <td>52 EUR</td>
                    <td>30 min</td>
                  </tr>
                  <tr>
                    <td>Barcelona Airport to Sitges</td>
                    <td>55 EUR</td>
                    <td>68 EUR</td>
                    <td>30 min</td>
                  </tr>
                  <tr>
                    <td>Barcelona Airport to Tarragona</td>
                    <td>130 EUR</td>
                    <td>180 EUR</td>
                    <td>60 min</td>
                  </tr>
                  <tr>
                    <td>Barcelona Airport to Lloret de Mar</td>
                    <td>160 EUR</td>
                    <td>182 EUR</td>
                    <td>1h 15 min</td>
                  </tr>
                </tbody>
              </table>

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

              <section className="fleet-section" aria-label="Taxi fleet and reviews">
                <h4 className="fleet-title">Welcome Pickups taxi fleet</h4>

                <div className="fleet-list">
                  <article className="fleet-card">
                    <div className="fleet-image image-sedan" />
                    <div className="fleet-meta">
                      <div>
                        <p className="fleet-label">Car type</p>
                        <p className="fleet-value">Sedan</p>
                      </div>
                      <div>
                        <p className="fleet-label">Passengers</p>
                        <p className="fleet-value">Up to 4</p>
                      </div>
                      <div>
                        <p className="fleet-label">Price</p>
                        <p className="fleet-value">From EUR 40</p>
                      </div>
                    </div>
                  </article>

                  <article className="fleet-card">
                    <div className="fleet-image image-minivan" />
                    <div className="fleet-meta">
                      <div>
                        <p className="fleet-label">Car type</p>
                        <p className="fleet-value">Minivan</p>
                      </div>
                      <div>
                        <p className="fleet-label">Passengers</p>
                        <p className="fleet-value">Up to 8</p>
                      </div>
                      <div>
                        <p className="fleet-label">Price</p>
                        <p className="fleet-value">From EUR 65</p>
                      </div>
                    </div>
                  </article>

                  <article className="fleet-card">
                    <div className="fleet-image image-minibus" />
                    <div className="fleet-meta">
                      <div>
                        <p className="fleet-label">Car type</p>
                        <p className="fleet-value">Minibus</p>
                      </div>
                      <div>
                        <p className="fleet-label">Passengers</p>
                        <p className="fleet-value">Up to 12</p>
                      </div>
                      <div>
                        <p className="fleet-label">Price</p>
                        <p className="fleet-value">From EUR 95</p>
                      </div>
                    </div>
                  </article>
                </div>

                <p className="reviews-title">What our customers say about Welcome Pickups</p>
                <div className="reviews-score-row">
                  <div className="reviews-score-box">
                    <p className="reviews-score">5.0</p>
                    <p className="reviews-subtext">367 reviews</p>
                  </div>
                  <button type="button" className="review-btn">
                    Write a review
                  </button>
                </div>

                <article className="review-item">
                  <div className="review-avatar">m</div>
                  <div>
                    <p className="review-name">mojad</p>
                    <p className="review-stars">*****</p>
                    <p className="review-text">
                      Excellent service and clear communication. Driver was waiting at arrivals and
                      the ride to the hotel was smooth and comfortable.
                    </p>
                  </div>
                </article>
              </section>

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
            </article>
          </section>
        </div>

        <aside className="quote-card" aria-label="Get a price quote form">
          <h2>Get a price quote</h2>
          <div className="trip-toggle">
            <button
              type="button"
              className={!isReturnTrip ? 'active' : ''}
              onClick={() => setIsReturnTrip(false)}
            >
              One Way
            </button>
            <button
              type="button"
              className={isReturnTrip ? 'active' : ''}
              onClick={() => setIsReturnTrip(true)}
            >
              Return
            </button>
          </div>

          <div className="field">Barcelona-El Prat International Airport (BCN)</div>
          <div className="field">To (airport, port, address)</div>
          <div className="field">Add departure date and time</div>
          {isReturnTrip ? <div className="field">Add return date and time</div> : null}

          <div className="counter-row">
            <div className="counter-field">
              <span className="counter-label">Passengers</span>
              <div className="counter-box">
                <button type="button">-</button>
                <span>1</span>
                <button type="button">+</button>
              </div>
            </div>
            <div className="counter-field">
              <span className="counter-label">Luggage pieces</span>
              <div className="counter-box">
                <button type="button">-</button>
                <span>1</span>
                <button type="button">+</button>
              </div>
            </div>
          </div>

          <button type="button" className="continue-btn">
            Continue
          </button>
        </aside>
      </section>

      <section className="faq-section" aria-labelledby="faq-heading">
        <div className="faq-inner">
          <h2 id="faq-heading" className="faq-title">
            Frequently asked questions
          </h2>

          <div className="faq-item">
            <h3 className="faq-question">How far is Barcelona Airport from the city center?</h3>
            <p className="faq-answer">
              Barcelona-El Prat International Airport (BCN) is about 15 km from the city center. By
              car or taxi the journey usually takes around 20 minutes, depending on traffic. A taxi
              from the airport to the city center typically costs between EUR 25 and EUR 35, though
              the exact fare can vary with time of day and route.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Do you tip Barcelona Airport taxi drivers?</h3>
            <p className="faq-answer">
              Tipping is not obligatory for airport taxis in Barcelona, but it is appreciated. If
              your driver was especially helpful or you had a great ride, rounding up the fare is a
              simple way to say thanks.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Can I flag down a taxi at Barcelona Airport?</h3>
            <p className="faq-answer">
              You cannot hail a taxi from the kerb inside the airport complex. Head to the official
              taxi rank and join the queue. If you need a wheelchair-accessible vehicle or a larger
              taxi, ask the rank attendant and they can help assign a suitable vehicle.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Do taxis at Barcelona Airport take credit card?</h3>
            <p className="faq-answer">
              Many taxis accept card payments, but not all vehicles are equipped with terminals. It
              is best to ask your driver before you start the trip whether they can take card or
              prefer cash.
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
      </section>
    </main>
  )
}

export default App
