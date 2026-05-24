import { NextResponse } from "next/server";
import { getRideDispatch } from "@/lib/server/rideDispatch";

export async function GET(
  _request: Request,
  context: { params: Promise<{ rideId: string }> }
) {
  try {
    const { rideId } = await context.params;
    const ride = await getRideDispatch(rideId, true);

    if (!ride) {
      return NextResponse.json(
        { error: "Ride was not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ride,
    });
  } catch (error) {
    console.error("GET_RIDE_ERROR", error);

    return NextResponse.json(
      { error: "Ride tracking is unavailable right now." },
      { status: 503 }
    );
  }
}
