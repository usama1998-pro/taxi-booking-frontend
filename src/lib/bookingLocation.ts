const AIRPORT_LABEL =
  /^barcelona[- ]?el\s+prat|barcelona.*\(bcn\)|\bbcn\b/i;

/** Matches app + website airport labels (Barcelona BCN, generic airport text). */
export function isAirportLabel(label: string): boolean {
  const trimmed = label.trim();
  if (!trimmed) {
    return false;
  }
  if (AIRPORT_LABEL.test(trimmed)) {
    return true;
  }
  return /airport|aeropuerto/i.test(trimmed);
}

export type BookingLocationJson = {
  kind: 'airport' | 'location';
  label: string;
  flight?: string;
  airline?: string;
  departureTime?: string;
};

/** Build pickup/dropoff JSON in the same shape as the driver app stores. */
export function buildBookingLocation(
  label: string,
  options?: {
    flight?: string;
    airline?: string;
    departureTime?: string;
  },
): BookingLocationJson {
  const trimmed = label.trim();
  const flight = options?.flight?.trim();
  const airline = options?.airline?.trim();
  const departureTime = options?.departureTime?.trim();

  if (isAirportLabel(trimmed)) {
    const loc: BookingLocationJson = {
      kind: 'airport',
      label: trimmed,
    };
    if (flight) {
      loc.flight = flight;
    }
    if (airline) {
      loc.airline = airline;
    }
    if (departureTime) {
      loc.departureTime = departureTime;
    }
    return loc;
  }

  return { kind: 'location', label: trimmed || 'Address TBC' };
}

/** Attach flight to the airport end of the route (pickup or dropoff). */
export function buildBookingLocations(
  quote: {
    pickup: string;
    dropoff: string;
    routeType: 'fromAirport' | 'toAirport' | 'pointToPoint';
  },
  flight?: string,
): { pickupLocation: BookingLocationJson; dropoffLocation: BookingLocationJson } {
  const trimmedFlight = flight?.trim();
  const pickupIsAirport =
    quote.routeType === 'fromAirport' || isAirportLabel(quote.pickup);
  const dropoffIsAirport =
    quote.routeType === 'toAirport' || isAirportLabel(quote.dropoff);

  if (trimmedFlight && pickupIsAirport && !dropoffIsAirport) {
    return {
      pickupLocation: buildBookingLocation(quote.pickup, { flight: trimmedFlight }),
      dropoffLocation: buildBookingLocation(quote.dropoff),
    };
  }
  if (trimmedFlight && dropoffIsAirport) {
    return {
      pickupLocation: buildBookingLocation(quote.pickup),
      dropoffLocation: buildBookingLocation(quote.dropoff, { flight: trimmedFlight }),
    };
  }

  return {
    pickupLocation: buildBookingLocation(quote.pickup),
    dropoffLocation: buildBookingLocation(quote.dropoff),
  };
}
