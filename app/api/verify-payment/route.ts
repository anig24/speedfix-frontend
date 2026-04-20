import crypto from "crypto";
import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";

const assignWorker = async (service: string) => {
  const snapshot = await getDocs(collection(serverDb, "workers"));

  const workers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<Record<string, unknown> & { id: string }>;

  const available = workers.find(
    (worker) => worker.service === service && worker.available === true
  );

  return available || null;
};

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

    const worker = await assignWorker(bookingData.service);

    const finalBooking = {
      ...bookingData,
      paymentId: razorpay_payment_id,
      status: worker ? "CONFIRMED" : "PENDING",
      technicianId: worker?.id ?? null,
      technicianName: typeof worker?.name === "string" ? worker.name : null,
      workerId: worker?.id ?? null,
      workerName: typeof worker?.name === "string" ? worker.name : null,
      riderId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(serverDb, "bookings"), finalBooking);

    return NextResponse.json({
      success: true,
      assigned: Boolean(worker),
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
