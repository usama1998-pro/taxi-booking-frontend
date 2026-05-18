import type { QuoteFormValues } from "@/components/QuoteForm";
import { isPickupDatetimeInPast, PICKUP_IN_PAST_MESSAGE } from "@/lib/bookingDateTime";

/** Driver contact returned when a booking is created with an assigned driver (from DB). */
export type AssignedDriverSummary = {
  name: string | null;
  phone: string;
  email: string | null;
};

export type CreateBookingResult = {
  uuid: string;
  assignmentMessage?: string;
  /** Present when the backend assigned a driver to this booking. */
  driver: AssignedDriverSummary | null;
  /** Echo from server; null if none requested. */
  childSeatsSummary: string | null;
};

/** Shown after a successful booking: driver set when the API assigned one. */
export type BookingSuccessPayload = {
  uuid: string;
  assignmentMessage?: string;
  driver: AssignedDriverSummary | null;
  childSeatsSummary?: string | null;
};

export type BookingDetailsValues = {
  flightNumber?: string;
  fullName: string;
  email: string;
  phone: string;
  note?: string;
  infantCarrierCount?: number;
  childSeatCount?: number;
  boosterCount?: number;
};

export type PendingBookingPayload = {
  quote: QuoteFormValues;
  details: BookingDetailsValues;
  estimatedPriceEur: number;
};

const BASE_FARE = 44;
const EXTRA_PASSENGER_FARE = 6;
const LUGGAGE_FARE = 2;
const INFANT_CARRIER_FARE = 5;
const CHILD_SEAT_FARE = 5;
const BOOSTER_FARE = 5;

function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error(
      "VITE_API_BASE_URL is not set. Define it in frontend/.env (see .env.example).",
    );
  }
  return raw.trim().replace(/\/$/, "");
}

function toIsoOrNow(datetimeLocalValue: string | undefined): string {
  if (!datetimeLocalValue?.trim()) {
    return new Date().toISOString();
  }
  if (isPickupDatetimeInPast(datetimeLocalValue)) {
    throw new Error(PICKUP_IN_PAST_MESSAGE);
  }
  const parsed = new Date(datetimeLocalValue);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid pickup date and time.");
  }
  return parsed.toISOString();
}

export function estimatePriceFromPassengersAndLuggage(
  passengers: number,
  luggage: number,
  infantCarrierCount = 0,
  childSeatCount = 0,
  boosterCount = 0,
): number {
  const passengerExtra = Math.max(0, passengers - 1) * EXTRA_PASSENGER_FARE;
  const luggageExtra = Math.max(0, luggage) * LUGGAGE_FARE;
  const infantExtra = Math.max(0, infantCarrierCount) * INFANT_CARRIER_FARE;
  const childExtra = Math.max(0, childSeatCount) * CHILD_SEAT_FARE;
  const boosterExtra = Math.max(0, boosterCount) * BOOSTER_FARE;
  return BASE_FARE + passengerExtra + luggageExtra + infantExtra + childExtra + boosterExtra;
}

export function estimatePrice(
  values: QuoteFormValues,
  options?: {
    infantCarrierCount?: number;
    childSeatCount?: number;
    boosterCount?: number;
  },
): number {
  return estimatePriceFromPassengersAndLuggage(
    values.passengers,
    values.luggage,
    options?.infantCarrierCount ?? 0,
    options?.childSeatCount ?? 0,
    options?.boosterCount ?? 0,
  );
}

function coerceNonEmptyString(value: unknown): string | null {
  if (typeof value === "string") {
    const t = value.trim();
    return t.length > 0 ? t : null;
  }
  if (value != null && typeof value !== "object") {
    const t = String(value).trim();
    return t.length > 0 ? t : null;
  }
  return null;
}

export function formatChildSeatsSummaryLine(
  infant: number,
  child: number,
  booster: number,
): string | null {
  if (!infant && !child && !booster) {
    return null;
  }
  const parts: string[] = [];
  if (infant > 0) {
    parts.push(`${infant} infant carrier${infant === 1 ? "" : "s"}`);
  }
  if (child > 0) {
    parts.push(`${child} child seat${child === 1 ? "" : "s"}`);
  }
  if (booster > 0) {
    parts.push(`${booster} booster${booster === 1 ? "" : "s"}`);
  }
  return parts.join(", ");
}

function parseAssignedDriver(raw: unknown): AssignedDriverSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const phone = coerceNonEmptyString(d.phone);
  if (!phone) return null;
  const name = typeof d.name === "string" ? d.name : null;
  const email = typeof d.email === "string" ? d.email : null;
  return { name, phone, email };
}

export async function createBookingFromForms(
  quote: QuoteFormValues,
  details: BookingDetailsValues,
): Promise<CreateBookingResult> {
  const res = await fetch(`${getApiBaseUrl()}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName: details.fullName,
      customerEmail: details.email,
      customerPhone: details.phone,
      flightNumber: details.flightNumber?.trim() || undefined,
      returnTime: quote.returnAt ? toIsoOrNow(quote.returnAt) : undefined,
      pickupLocation: { label: quote.pickup },
      dropoffLocation: { label: quote.dropoff },
      scheduledTime: toIsoOrNow(quote.departureAt),
      price: estimatePrice(quote, {
        infantCarrierCount: details.infantCarrierCount ?? 0,
        childSeatCount: details.childSeatCount ?? 0,
        boosterCount: details.boosterCount ?? 0,
      }),
      status: "PENDING",
      luggageCount: quote.luggage,
      passengerCount: quote.passengers,
      infantCarrierCount: details.infantCarrierCount ?? 0,
      childSeatCount: details.childSeatCount ?? 0,
      boosterCount: details.boosterCount ?? 0,
      note: details.note?.trim() || undefined,
    }),
  });

  const json = (await res.json().catch(() => null)) as {
    message?: string | string[];
    uuid?: string;
    assignmentMessage?: string;
    driver?: unknown;
    infantCarrierCount?: unknown;
    childSeatCount?: unknown;
    boosterCount?: unknown;
  } | null;

  if (!res.ok) {
    const msg = json?.message;
    const text = Array.isArray(msg) ? msg.join(" ") : msg;
    throw new Error(text ?? "Booking submission failed.");
  }
  if (!json?.uuid) {
    throw new Error("Booking created but no booking uuid was returned.");
  }
  const infant =
    typeof json.infantCarrierCount === "number" ? json.infantCarrierCount : 0;
  const childN =
    typeof json.childSeatCount === "number" ? json.childSeatCount : 0;
  const booster =
    typeof json.boosterCount === "number" ? json.boosterCount : 0;
  return {
    uuid: json.uuid,
    assignmentMessage:
      typeof json.assignmentMessage === "string"
        ? json.assignmentMessage
        : undefined,
    driver: parseAssignedDriver(json.driver),
    childSeatsSummary: formatChildSeatsSummaryLine(infant, childN, booster),
  };
}
