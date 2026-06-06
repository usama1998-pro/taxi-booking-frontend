/** Fixed EUR tiers: smallest vehicle band that fits passengers and luggage. */
const PASSENGER_LUGGAGE_RATE_TIERS = [
  { passengers: 1, luggage: 1, price: 52 },
  { passengers: 2, luggage: 2, price: 52 },
  { passengers: 3, luggage: 3, price: 57 },
  { passengers: 4, luggage: 4, price: 62 },
  { passengers: 5, luggage: 5, price: 72 },
  { passengers: 6, luggage: 6, price: 77 },
  { passengers: 7, luggage: 7, price: 84 },
  { passengers: 8, luggage: 8, price: 110 },
  { passengers: 8, luggage: 12, price: 127 },
  { passengers: 8, luggage: 16, price: 153 },
] as const;

const MAX_TIER_PRICE =
  PASSENGER_LUGGAGE_RATE_TIERS[PASSENGER_LUGGAGE_RATE_TIERS.length - 1].price;

const INFANT_CARRIER_FARE = 5;
const CHILD_SEAT_FARE = 5;
const BOOSTER_FARE = 5;

export function calculatePassengerLuggageFare(
  passengerCount: number,
  luggageCount: number,
): number {
  const passengers = Math.max(1, Math.floor(passengerCount));
  const luggage = Math.max(0, Math.floor(luggageCount));
  const effectiveLuggage = luggage === 0 ? 1 : luggage;

  const fitting = PASSENGER_LUGGAGE_RATE_TIERS.filter(
    (tier) =>
      tier.passengers >= passengers && tier.luggage >= effectiveLuggage,
  );

  if (fitting.length === 0) {
    return MAX_TIER_PRICE;
  }

  return Math.min(...fitting.map((tier) => tier.price));
}

export function calculateBookingPrice(
  passengerCount: number,
  luggageCount: number,
  infantCarrierCount = 0,
  childSeatCount = 0,
  boosterCount = 0,
): number {
  const baseFare = calculatePassengerLuggageFare(passengerCount, luggageCount);
  const infantExtra = Math.max(0, infantCarrierCount) * INFANT_CARRIER_FARE;
  const childExtra = Math.max(0, childSeatCount) * CHILD_SEAT_FARE;
  const boosterExtra = Math.max(0, boosterCount) * BOOSTER_FARE;
  return baseFare + infantExtra + childExtra + boosterExtra;
}
