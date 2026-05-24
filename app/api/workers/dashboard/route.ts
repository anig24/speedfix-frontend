import { NextResponse } from "next/server";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { sortBookingTimeline, type BookingTimelineEvent } from "@/lib/bookingTracking";
import { serverDb } from "@/lib/firebase-server";
import { extractCoordinates } from "@/lib/liveTracking";
import { getRideDispatchesForBookings } from "@/lib/server/rideDispatch";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: unknown) {
  return normalizeText(value).replace(/\D/g, "").slice(0, 10);
}

function normalizeTimestamp(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return null;
}

function sortBookingsByLatest(
  left: Record<string, unknown>,
  right: Record<string, unknown>
) {
  const leftValue =
    normalizeTimestamp(left.updatedAt) ||
    normalizeTimestamp(left.createdAt) ||
    normalizeTimestamp(left.assignedAt) ||
    "";
  const rightValue =
    normalizeTimestamp(right.updatedAt) ||
    normalizeTimestamp(right.createdAt) ||
    normalizeTimestamp(right.assignedAt) ||
    "";

  return new Date(rightValue).getTime() - new Date(leftValue).getTime();
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const workerCode = normalizeText(payload.workerCode).toUpperCase();
    const phone = normalizePhone(payload.phone);

    if (!workerCode || !phone) {
      return NextResponse.json(
        { error: "Enter worker ID/reference and registered phone number." },
        { status: 400 }
      );
    }

    const workerSnapshot = await getDocs(
      query(collection(serverDb, "workers"), where("workerCode", "==", workerCode), limit(1))
    );

    const workerDoc = workerSnapshot.docs[0];

    if (!workerDoc) {
      return NextResponse.json(
        { error: "No worker profile was found for this worker ID." },
        { status: 404 }
      );
    }

    const workerData = workerDoc.data() as Record<string, unknown>;

    if (normalizePhone(workerData.phone) !== phone) {
      return NextResponse.json(
        { error: "Registered phone number did not match this worker profile." },
        { status: 403 }
      );
    }

    const bookingsSnapshot = await getDocs(
      query(collection(serverDb, "bookings"), where("assignedWorkerId", "==", workerDoc.id))
    );

    const bookingRecords = bookingsSnapshot.docs
      .map((snapshot): Record<string, unknown> & { id: string } => ({
        id: snapshot.id,
        ...(snapshot.data() as Record<string, unknown>),
      }))
      .sort(sortBookingsByLatest);
    const rideDispatches = await getRideDispatchesForBookings(
      bookingRecords.map((booking) => booking.id),
      true
    );
    const rideByBookingId = new Map(
      rideDispatches.map((ride) => [ride.sourceBookingId, ride])
    );

    const bookings = bookingRecords.map((booking) => {
        const timeline = Array.isArray(booking.trackingTimeline)
          ? sortBookingTimeline(booking.trackingTimeline as BookingTimelineEvent[])
          : [];
        const workerRide =
          rideByBookingId.get(booking.id) ||
          (typeof booking.workerRide === "object" && booking.workerRide !== null
            ? booking.workerRide
            : null);

        return {
          bookingId: booking.id,
          bookingCode: normalizeText(booking.bookingCode) || `SFX-${booking.id.slice(0, 8).toUpperCase()}`,
          service: normalizeText(booking.serviceName) || normalizeText(booking.service),
          status: normalizeText(booking.status) || "PENDING",
          paymentStatus: normalizeText(booking.paymentStatus) || "PENDING",
          customerName:
            normalizeText(booking.customerName) ||
            normalizeText(booking.fullName) ||
            normalizeText(booking.name) ||
            "Customer",
          customerPhone:
            normalizeText(booking.customerPhone) ||
            normalizeText(booking.phone) ||
            normalizeText(booking.mobile),
          address: normalizeText(booking.address) || normalizeText(booking.fullAddress),
          city: normalizeText(booking.city) || normalizeText(booking.cityLabel),
          preferredDate:
            normalizeText(booking.date) ||
            normalizeText(booking.preferredDate) ||
            null,
          preferredSlot:
            normalizeText(booking.slot) ||
            normalizeText(booking.preferredSlot) ||
            null,
          assignedAt: normalizeTimestamp(booking.assignedAt) || normalizeTimestamp(booking.createdAt),
          updatedAt: normalizeTimestamp(booking.updatedAt),
          customerLocation: extractCoordinates(booking.customerLocation),
          workerLiveLocation:
            typeof booking.workerLiveLocation === "object" && booking.workerLiveLocation !== null
              ? {
                  label: normalizeText(
                    (booking.workerLiveLocation as Record<string, unknown>).label
                  ),
                  coordinates: extractCoordinates(
                    (booking.workerLiveLocation as Record<string, unknown>).coordinates
                  ),
                  updatedAt: normalizeTimestamp(
                    (booking.workerLiveLocation as Record<string, unknown>).updatedAt
                  ),
                }
              : null,
          workerRide,
          timeline,
        };
      });

    return NextResponse.json({
      success: true,
      worker: {
        workerId: workerDoc.id,
        workerCode: normalizeText(workerData.workerCode),
        referenceNumber: normalizeText(workerData.referenceNumber),
        fullName: normalizeText(workerData.fullName) || normalizeText(workerData.name),
        phone: normalizeText(workerData.phone),
        email: normalizeText(workerData.email) || null,
        city: normalizeText(workerData.city),
        service: normalizeText(workerData.service),
        services: Array.isArray(workerData.services) ? workerData.services : [],
        verificationStatus: normalizeText(workerData.verificationStatus) || "PENDING_REVIEW",
        onboardingStatus: normalizeText(workerData.onboardingStatus) || "SUBMITTED",
        available: workerData.available !== false,
        active: Boolean(workerData.active),
        verified: Boolean(workerData.verified),
        currentArea: normalizeText(workerData.currentArea) || normalizeText(workerData.liveLocationLabel),
        currentBookingId: normalizeText(workerData.currentBookingId) || null,
        liveCoordinates: extractCoordinates(workerData.liveCoordinates),
        bank: typeof workerData.bank === "object" && workerData.bank !== null
          ? {
              bankName: normalizeText((workerData.bank as Record<string, unknown>).bankName),
              accountHolderName: normalizeText(
                (workerData.bank as Record<string, unknown>).accountHolderName
              ),
              accountNumberMasked: normalizeText(
                (workerData.bank as Record<string, unknown>).accountNumberMasked
              ),
              ifsc: normalizeText((workerData.bank as Record<string, unknown>).ifsc),
              branch: normalizeText((workerData.bank as Record<string, unknown>).branch),
              city: normalizeText((workerData.bank as Record<string, unknown>).city),
              state: normalizeText((workerData.bank as Record<string, unknown>).state),
              verificationStatus: normalizeText(
                (workerData.bank as Record<string, unknown>).verificationStatus
              ),
            }
          : null,
      },
      bookings,
    });
  } catch (error) {
    console.error("WORKER_DASHBOARD_ERROR", error);

    return NextResponse.json(
      { error: "Unable to load worker dashboard right now." },
      { status: 500 }
    );
  }
}
