import { NextResponse } from "next/server";
import { createMarketplaceBooking } from "@/lib/server/serviceMarketplaceBackend";
import { notifyBookingEmails } from "@/lib/server/bookingEmailNotifications";

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

    const result = await createMarketplaceBooking({
      bookingData: {
        ...bookingData,
      },
      status: "PENDING",
      paymentStatus: "PENDING",
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await notifyBookingEmails({
      bookingData,
      result,
      paymentStatus: "PENDING",
    });

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      assigned: result.assigned,
      worker: result.worker,
      rideDispatch: result.rideDispatch,
      workflow: result.workflow,
    });
  } catch (error) {
    console.error("CREATE_BOOKING_ERROR", error);

    return NextResponse.json(
      { error: "Unable to place the booking right now." },
      { status: 500 }
    );
  }
}
