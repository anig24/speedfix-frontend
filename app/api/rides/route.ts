import { NextResponse } from "next/server";
import { createCustomerRide } from "@/lib/server/rideDispatch";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const result = await createCustomerRide(payload);

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
    console.error("CREATE_RIDE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to request a bike ride right now." },
      { status: 500 }
    );
  }
}
