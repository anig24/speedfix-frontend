import { NextResponse } from "next/server";
import { updateRideDispatch } from "@/lib/server/rideDispatch";

export async function POST(
  request: Request,
  context: { params: Promise<{ rideId: string }> }
) {
  try {
    const { rideId } = await context.params;
    const payload = await request.json().catch(() => ({}));
    const result = await updateRideDispatch(rideId, payload);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ride: result.ride,
    });
  } catch (error) {
    console.error("UPDATE_RIDE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to update ride status right now." },
      { status: 500 }
    );
  }
}
