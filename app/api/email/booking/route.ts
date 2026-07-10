import { NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/email";
import { requireEmailApiKey } from "@/lib/email-security";
import { bookingEmailSchema } from "@/lib/email-validation";
import { readJsonBody, validationErrorResponse } from "@/lib/email-route-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = requireEmailApiKey(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const parsed = bookingEmailSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const result = await sendBookingEmail({
      ...parsed.data,
      service: parsed.data.serviceName || parsed.data.service,
      bookingId: parsed.data.bookingId,
      bookingCode: parsed.data.bookingCode,
      date: parsed.data.date,
      time: parsed.data.time || parsed.data.requestedSlot,
      assignedTechnician: parsed.data.assignedTechnician,
      priceEstimate: parsed.data.priceEstimate,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("EMAIL_BOOKING_ERROR", error);
    return NextResponse.json(
      { error: "Unable to send booking emails." },
      { status: 500 }
    );
  }
}
