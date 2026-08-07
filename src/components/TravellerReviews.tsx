const VIATOR_REVIEWS_URL =
  'https://www.viator.com/en-GB/tours/Barcelona/Barcelona-Airport-Private-Arrival-Transfer/d562-406570P10'

const REVIEWS = [
  {
    quote:
      'Our driver was waiting at arrivals with a name sign. The car was clean, he was professional, and the price was exactly what we booked. Perfect after a long flight.',
    name: 'Patricia M.',
    location: 'New York, USA',
  },
  {
    quote:
      'WhatsApping the driver before pickup made everything so easy. He was already at the cruise terminal when we got off the ship. Really great service.',
    name: 'Robert & Linda K.',
    location: 'Florida, USA',
  },
  {
    quote:
      'We were a group of five with a ton of cruise luggage. The driver handled it all, knew exactly which terminal we needed, and got us to the airport with plenty of time.',
    name: 'The Johnson Family',
    location: 'Texas, USA',
  },
  {
    quote:
      'I booked the night before and still got a quick confirmation. Pickup at the hotel was right on time and the ride to the airport was totally stress free.',
    name: 'Emma L.',
    location: 'London, UK',
  },
  {
    quote:
      'Our flight was almost two hours late. The driver had been tracking it and was ready when we landed. No stress and no extra charge. Honestly fantastic.',
    name: 'Marco R.',
    location: 'Milan, Italy',
  },
  {
    quote:
      'Loved that the price stayed fixed even in traffic. Clean van, friendly English speaking driver, and he messaged us on WhatsApp before pickup. Would use again.',
    name: 'Sophie & Tom',
    location: 'Melbourne, Australia',
  },
  {
    quote:
      'Our cruise transfer went so smoothly. He met us with a name board, helped with the bags, and we still had time before our excursion. Definitely recommend.',
    name: 'Helen W.',
    location: 'Toronto, Canada',
  },
  {
    quote:
      'Family of six with kids and strollers. The driver was so patient and the van had loads of space. Best airport transfer we have had in Barcelona.',
    name: 'Carlos D.',
    location: 'Madrid, Spain',
  },
  {
    quote:
      'From booking to drop off everything was clear. He met us inside arrivals, walked us to the car, and we paid exactly what was quoted. Super easy.',
    name: 'Aisha N.',
    location: 'Dubai, UAE',
  },
] as const

function StarRow() {
  return (
    <div className="traveller-reviews-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className="traveller-reviews-star">
          <path
            fill="currentColor"
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z"
          />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({
  review,
  duplicate,
}: {
  review: (typeof REVIEWS)[number]
  duplicate?: boolean
}) {
  return (
    <li className="traveller-reviews-card" aria-hidden={duplicate || undefined}>
      <a
        className="traveller-reviews-card-link"
        href={VIATOR_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={duplicate ? -1 : undefined}
        aria-label={`Read ${review.name}'s review on Viator`}
      >
        <StarRow />
        <blockquote className="traveller-reviews-quote">
          <p>&ldquo;{review.quote}&rdquo;</p>
        </blockquote>
        <footer className="traveller-reviews-author">
          <cite className="traveller-reviews-name">{review.name}</cite>
          <span className="traveller-reviews-location">{review.location}</span>
        </footer>
      </a>
    </li>
  )
}

export function TravellerReviews() {
  return (
    <section className="traveller-reviews" aria-labelledby="traveller-reviews-heading">
      <div className="traveller-reviews-inner">
        <p className="traveller-reviews-eyebrow">Traveller Reviews</p>
        <h2 id="traveller-reviews-heading" className="traveller-reviews-title">
          What Viator travellers say.
        </h2>
        <p className="traveller-reviews-subtitle">
          4.7-star average across our verified Viator reviews.
        </p>
      </div>

      <div className="traveller-reviews-marquee" aria-label="Customer reviews carousel">
        <ul className="traveller-reviews-track">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
          {REVIEWS.map((review) => (
            <ReviewCard key={`dup-${review.name}`} review={review} duplicate />
          ))}
        </ul>
      </div>

      <div className="traveller-reviews-inner">
        <div className="traveller-reviews-cta-wrap">
          <a
            className="traveller-reviews-cta"
            href={VIATOR_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read all reviews on Viator
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>
    </section>
  )
}
