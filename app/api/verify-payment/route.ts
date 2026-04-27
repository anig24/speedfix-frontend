import crypto from "crypto";
import { NextResponse } from "next/server";
import { createTrackedBooking } from "@/lib/server/bookingLifecycle";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingData
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const result = await createTrackedBooking({
      ...bookingData,
      paymentId: razorpay_payment_id,
      paymentStatus: "PAID",
      status: "CONFIRMED",
    });

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      assigned: result.assigned,
      worker: result.worker,
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
