import { NextResponse } from "next/server";
import { createTrackedBooking } from "@/lib/server/bookingLifecycle";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const bookingData = payload.bookingData;

    if (!bookingData) {
      return NextResponse.json(
        { error: "Missing booking details." },
        { status: 400 }
      );
    }

    const service = normalizeText(bookingData.service);
    const customerName = normalizeText(bookingData.customerName);
    const customerPhone = normalizeText(bookingData.customerPhone);
    const address = normalizeText(bookingData.address);

    if (!service || !customerName || !customerPhone || !address) {
      return NextResponse.json(
        { error: "Please complete the booking information first." },
        { status: 400 }
      );
    }

    const result = await createTrackedBooking({
      ...bookingData,
      status: "PENDING",
      paymentStatus: "PENDING",
    });

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      assigned: result.assigned,
      worker: result.worker,
    });
  } catch (error) {
    console.error("CREATE_BOOKING_ERROR", error);

    return NextResponse.json(
      { error: "Unable to place the booking right now." },
      { status: 500 }
    );
  }
}
