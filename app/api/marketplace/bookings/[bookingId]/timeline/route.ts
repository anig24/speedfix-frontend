import { NextResponse } from "next/server";
import { getMarketplaceBookingTimeline } from "@/lib/server/serviceMarketplaceBackend";

export async function GET(
  _request: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params;
    const timeline = await getMarketplaceBookingTimeline(bookingId);

    if (!timeline) {
      return NextResponse.json(
        { error: "Booking timeline was not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      timeline,
    });
  } catch (error) {
    console.error("MARKETPLACE_TIMELINE_ERROR", error);

    return NextResponse.json(
      { error: "Booking tracking is unavailable right now." },
      { status: 503 }
    );
  }
}
