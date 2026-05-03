import { NextResponse } from "next/server";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createBookingTimelineEvent,
  sortBookingTimeline,
  type BookingTimelineEvent,
  type BookingTimelineKey,
} from "@/lib/bookingTracking";
import { serverDb } from "@/lib/firebase-server";
import { extractCoordinates } from "@/lib/liveTracking";
import { type WorkerDashboardActionKey } from "@/lib/workerPortal";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: unknown) {
  return normalizeText(value).replace(/\D/g, "").slice(0, 10);
}

const workerActionConfig: Record<
  WorkerDashboardActionKey,
  {
    eventKey: BookingTimelineKey;
    status: string | null;
    description: (workerName: string, note: string, locationLabel: string) => string;
  }
> = {
  ACCEPT: {
    eventKey: "WORKER_CONFIRMED",
    status: "CONFIRMED",
    description: (workerName, note) =>
      `${workerName || "Assigned worker"} accepted the appointment.${note ? ` ${note}` : ""}`,
  },
  SHARE_LOCATION: {
    eventKey: "LOCATION_SHARED",
    status: null,
    description: (workerName, note, locationLabel) =>
      `${workerName || "Assigned worker"} shared live location${
        locationLabel ? ` from ${locationLabel}` : ""
      }.${note ? ` ${note}` : ""}`,
  },
  ON_THE_WAY: {
    eventKey: "ON_THE_WAY",
    status: "ON_THE_WAY",
    description: (workerName, note, locationLabel) =>
      `${workerName || "Assigned worker"} is on the way${
        locationLabel ? ` from ${locationLabel}` : ""
      }.${note ? ` ${note}` : ""}`,
  },
  ARRIVED: {
    eventKey: "ARRIVED",
    status: "ARRIVED",
    description: (workerName, note) =>
      `${workerName || "Assigned worker"} reached the service location.${note ? ` ${note}` : ""}`,
  },
  IN_PROGRESS: {
    eventKey: "IN_PROGRESS",
    status: "IN_PROGRESS",
    description: (workerName, note) =>
      `${workerName || "Assigned worker"} started service work.${note ? ` ${note}` : ""}`,
  },
  COMPLETED: {
    eventKey: "COMPLETED",
    status: "COMPLETED",
    description: (workerName, note) =>
      `${workerName || "Assigned worker"} marked the booking completed.${note ? ` ${note}` : ""}`,
  },
};

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const workerCode = normalizeText(payload.workerCode).toUpperCase();
    const phone = normalizePhone(payload.phone);
    const bookingId = normalizeText(payload.bookingId);
    const action = normalizeText(payload.action).toUpperCase() as WorkerDashboardActionKey;
    const note = normalizeText(payload.note);
    const location = payload.location || {};
    const locationLabel =
      normalizeText(location.label) ||
      normalizeText(location.city) ||
      normalizeText(payload.locationLabel);
    const coordinates = extractCoordinates(location);

    if (!workerCode || !phone || !bookingId || !action || !workerActionConfig[action]) {
      return NextResponse.json(
        { error: "Worker access, booking ID, and action are required." },
        { status: 400 }
      );
    }

    const workerSnapshot = await getDocs(
      query(collection(serverDb, "workers"), where("workerCode", "==", workerCode), limit(1))
    );
    const workerDoc = workerSnapshot.docs[0];

    if (!workerDoc) {
      return NextResponse.json(
        { error: "Worker profile not found." },
        { status: 404 }
      );
    }

    const workerData = workerDoc.data() as Record<string, unknown>;

    if (normalizePhone(workerData.phone) !== phone) {
      return NextResponse.json(
        { error: "Phone verification failed for this worker profile." },
        { status: 403 }
      );
    }

    const bookingRef = doc(serverDb, "bookings", bookingId);
    const bookingSnapshot = await getDoc(bookingRef);

    if (!bookingSnapshot.exists()) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const bookingData = bookingSnapshot.data() as Record<string, unknown>;
    const assignedWorkerId = normalizeText(bookingData.assignedWorkerId);

    if (assignedWorkerId && assignedWorkerId !== workerDoc.id) {
      return NextResponse.json(
        { error: "This booking is not assigned to the current worker." },
        { status: 403 }
      );
    }

    const actionConfig = workerActionConfig[action];
    const nowIso = new Date().toISOString();
    const workerName =
      normalizeText(workerData.fullName) || normalizeText(workerData.name) || "Assigned worker";
    const currentTimeline = Array.isArray(bookingData.trackingTimeline)
      ? sortBookingTimeline(bookingData.trackingTimeline as BookingTimelineEvent[])
      : [];

    const nextEvent = createBookingTimelineEvent(actionConfig.eventKey, {
      at: nowIso,
      description: actionConfig.description(workerName, note, locationLabel),
      actorType: "technician",
      actorName: workerName,
      locationLabel: locationLabel || normalizeText(workerData.currentArea) || normalizeText(workerData.city),
      status: actionConfig.status || normalizeText(bookingData.status) || "CONFIRMED",
    });

    const nextTimeline = sortBookingTimeline([...currentTimeline, nextEvent]);
    const nextStatus = actionConfig.status || normalizeText(bookingData.status) || "CONFIRMED";

    const liveLocation =
      coordinates || locationLabel
        ? {
            label:
              locationLabel ||
              normalizeText(workerData.currentArea) ||
              normalizeText(workerData.city) ||
              normalizeText(bookingData.city) ||
              "Live worker location",
            coordinates: coordinates,
            updatedAt: nowIso,
            source: "worker-update",
          }
        : bookingData.workerLiveLocation || null;

    await updateDoc(bookingRef, {
      status: nextStatus,
      trackingTimeline: nextTimeline,
      trackingLastUpdatedAt: nowIso,
      updatedAt: serverTimestamp(),
      workerLiveLocation: liveLocation,
      ...(action === "COMPLETED"
        ? {
            completedAt: nowIso,
          }
        : {}),
    });

    await updateDoc(doc(serverDb, "workers", workerDoc.id), {
      currentBookingId: action === "COMPLETED" ? null : bookingId,
      currentArea:
        locationLabel || normalizeText(workerData.currentArea) || normalizeText(workerData.city),
      liveLocationLabel:
        locationLabel ||
        normalizeText(workerData.liveLocationLabel) ||
        normalizeText(workerData.city),
      ...(coordinates
        ? {
            liveCoordinates: coordinates,
          }
        : {}),
      lastUpdatedAt: serverTimestamp(),
    }).catch(() => undefined);

    return NextResponse.json({
      success: true,
      bookingId,
      status: nextStatus,
      lastEvent: nextEvent,
      workerLiveLocation: liveLocation,
    });
  } catch (error) {
    console.error("WORKER_BOOKING_UPDATE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to update worker booking status right now." },
      { status: 500 }
    );
  }
}
