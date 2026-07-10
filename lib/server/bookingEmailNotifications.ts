import "server-only";

import { sendBookingEmail } from "@/lib/email";

type BookingNotificationResult = {
  bookingId: string;
  assigned?: boolean;
  worker?: {
    name?: string | null;
    phone?: string | null;
  } | null;
  workflow?: {
    serviceName?: string | null;
    requestedSlot?: string | null;
    quote?: {
      payable?: number | null;
      currentCheckoutAmount?: number | null;
    } | null;
  } | null;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(normalizeText(value));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function deriveSlot(bookingData: Record<string, unknown>, result: BookingNotificationResult) {
  return (
    normalizeText(bookingData.preferredSlot) ||
    normalizeText(bookingData.requestedSlot) ||
    normalizeText(bookingData.slot) ||
    normalizeText(result.workflow?.requestedSlot) ||
    undefined
  );
}

export async function notifyBookingEmails(input: {
  bookingData: Record<string, unknown>;
  result: BookingNotificationResult;
  paymentStatus?: string;
}) {
  const { bookingData, result } = input;
  const customerEmail =
    normalizeText(bookingData.customerEmail) || normalizeText(bookingData.email);
  const bookingCode = `SFX-${result.bookingId.slice(0, 8).toUpperCase()}`;
  const address = normalizeText(bookingData.address);
  const priceEstimate =
    normalizeNumber(result.workflow?.quote?.payable) ||
    normalizeNumber(result.workflow?.quote?.currentCheckoutAmount) ||
    normalizeNumber(bookingData.amount) ||
    normalizeNumber(bookingData.estimatedAmount);

  await sendBookingEmail({
    customerEmail: customerEmail || undefined,
    customerName: normalizeText(bookingData.customerName) || normalizeText(bookingData.name),
    customerPhone: normalizeText(bookingData.customerPhone) || normalizeText(bookingData.phone),
    bookingId: result.bookingId,
    bookingCode,
    service:
      normalizeText(result.workflow?.serviceName) ||
      normalizeText(bookingData.serviceName) ||
      normalizeText(bookingData.service),
    date:
      normalizeText(bookingData.preferredDate) ||
      normalizeText(bookingData.date) ||
      undefined,
    time: deriveSlot(bookingData, result),
    address,
    city: normalizeText(bookingData.city),
    pincode: normalizeText(bookingData.pincode),
    assignedTechnician: result.worker?.name || undefined,
    assignedTechnicianPhone: result.worker?.phone || undefined,
    priceEstimate,
    paymentStatus:
      input.paymentStatus ||
      normalizeText(bookingData.paymentStatus) ||
      normalizeText(bookingData.status) ||
      undefined,
  }).catch((error) => {
    console.error("BOOKING_EMAIL_NOTIFICATION_ERROR", error);
  });
}
