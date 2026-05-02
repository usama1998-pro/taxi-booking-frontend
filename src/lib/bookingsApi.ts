import type { QuoteFormValues } from "@/components/QuoteForm";

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
};

/** Shown after a successful booking: driver set when the API assigned one. */
export type BookingSuccessPayload = {
  uuid: string;
  assignmentMessage?: string;
  driver: AssignedDriverSummary | null;
};

export type BookingDetailsValues = {
  flightNumber?: string;
  fullName: string;
  email: string;
  phone: string;
  note?: string;
};

const DEFAULT_API_BASE = "http://localhost:3000";

function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE;
  return raw.replace(/\/$/, "");
}

function toIsoOrNow(datetimeLocalValue: string | undefined): string {
  if (!datetimeLocalValue) {
    return new Date().toISOString();
  }
  const parsed = new Date(datetimeLocalValue);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

function estimatePrice(values: QuoteFormValues): number {
  const base = 44;
  const passengerExtra = Math.max(0, values.passengers - 1) * 6;
  const luggageExtra = values.luggage * 2;
  return base + passengerExtra + luggageExtra;
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
      price: estimatePrice(quote),
      status: "PENDING",
      luggageCount: quote.luggage,
      passengerCount: quote.passengers,
      note: details.note?.trim() || undefined,
    }),
  });

  const json = (await res.json().catch(() => null)) as {
    message?: string | string[];
    uuid?: string;
    assignmentMessage?: string;
    driver?: unknown;
  } | null;

  if (!res.ok) {
    const msg = json?.message;
    const text = Array.isArray(msg) ? msg.join(" ") : msg;
    throw new Error(text ?? "Booking submission failed.");
  }
  if (!json?.uuid) {
    throw new Error("Booking created but no booking uuid was returned.");
  }
  return {
    uuid: json.uuid,
    assignmentMessage:
      typeof json.assignmentMessage === "string"
        ? json.assignmentMessage
        : undefined,
    driver: parseAssignedDriver(json.driver),
  };
}
