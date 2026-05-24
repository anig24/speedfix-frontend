import { NextResponse } from "next/server";
import { createMarketplaceBooking } from "@/lib/server/serviceMarketplaceBackend";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const bookingData = (
      typeof payload.bookingData === "object" && payload.bookingData !== null
        ? payload.bookingData
        : payload
    ) as Record<string, unknown>;

    const result = await createMarketplaceBooking({
      bookingData,
      status: "PENDING",
      paymentStatus: "PENDING",
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      assigned: result.assigned,
      worker: result.worker,
      workflow: result.workflow,
    });
  } catch (error) {
    console.error("MARKETPLACE_BOOKING_ERROR", error);

    return NextResponse.json(
      { error: "Unable to create marketplace booking right now." },
      { status: 500 }
    );
  }
}
