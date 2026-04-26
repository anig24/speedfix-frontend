import "server-only";

import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  BookingTimelineEvent,
  createBookingTimelineEvent,
} from "@/lib/bookingTracking";
import { serverDb } from "@/lib/firebase-server";

type WorkerSource = "workers" | "employees";

type AssignedWorker = {
  id: string;
  source: WorkerSource;
  uid: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  service: string | null;
  avatar: string | null;
  rating: number | null;
  liveLocationLabel: string | null;
};

type BookingPayload = Record<string, unknown> & {
  service: string;
  serviceName?: string;
  city?: string;
  paymentStatus?: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value: unknown) {
  return normalizeText(value).toUpperCase();
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter(Boolean);
  }

  const single = normalizeText(value);
  return single ? [single] : [];
}

function matchesService(candidate: Record<string, unknown>, service: string) {
  const requested = normalizeUpper(service);
  const direct = normalizeUpper(candidate.service);

  if (direct && direct === requested) {
    return true;
  }

  return toStringArray(candidate.services).some(
    (item) => normalizeUpper(item) === requested
  );
}

function matchesCity(candidate: Record<string, unknown>, city: string) {
  const requested = normalizeUpper(city);

  if (!requested) {
    return true;
  }

  const direct = normalizeUpper(candidate.city);

  if (direct && direct === requested) {
    return true;
  }

  return toStringArray(candidate.cities).some(
    (item) => normalizeUpper(item) === requested
  );
}

function isAvailable(candidate: Record<string, unknown>) {
  if (candidate.available === false) {
    return false;
  }

  if (candidate.isAvailable === false) {
    return false;
  }

  if (candidate.active === false) {
    return false;
  }

  return true;
}

function mapWorkerCandidate(
  source: WorkerSource,
  raw: Record<string, unknown> & { id: string }
): AssignedWorker {
  return {
    id: raw.id,
    source,
    uid: normalizeText(raw.uid) || null,
    name: normalizeText(raw.name) || normalizeText(raw.fullName) || null,
    email: normalizeText(raw.email) || null,
    phone:
      normalizeText(raw.phone) ||
      normalizeText(raw.phoneNumber) ||
      normalizeText(raw.mobile) ||
      null,
    city: normalizeText(raw.city) || null,
    service: normalizeText(raw.service) || null,
    avatar: normalizeText(raw.avatar) || normalizeText(raw.photoURL) || null,
    rating: normalizeNumber(raw.rating),
    liveLocationLabel:
      normalizeText(raw.liveLocationLabel) ||
      normalizeText(raw.currentArea) ||
      normalizeText(raw.locationLabel) ||
      normalizeText(raw.city) ||
      null,
  };
}

async function findAssignableWorker(service: string, city: string) {
  const [workersSnapshot, employeesSnapshot] = await Promise.all([
    getDocs(collection(serverDb, "workers")),
    getDocs(collection(serverDb, "employees")),
  ]);

  const workers = workersSnapshot.docs.map((snapshot) => ({
    id: snapshot.id,
    ...snapshot.data(),
  })) as Array<Record<string, unknown> & { id: string }>;

  const employees = employeesSnapshot.docs
    .map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    }))
    .filter((employee) => normalizeUpper(employee.role) === "STAFF") as Array<
    Record<string, unknown> & { id: string }
  >;

  const candidates = [
    ...workers.map((item) => ({ source: "workers" as const, raw: item })),
    ...employees.map((item) => ({ source: "employees" as const, raw: item })),
  ]
    .filter((candidate) => isAvailable(candidate.raw))
    .map((candidate) => ({
      ...candidate,
      score:
        (matchesService(candidate.raw, service) ? 4 : 0) +
        (matchesCity(candidate.raw, city) ? 2 : 0) +
        (normalizeText(candidate.raw.name) ? 1 : 0),
    }))
    .sort((left, right) => right.score - left.score);

  const bestMatch = candidates.find((candidate) => candidate.score >= 4) || candidates[0];

  if (!bestMatch) {
    return null;
  }

  return mapWorkerCandidate(bestMatch.source, bestMatch.raw);
}

function buildInitialTimeline(
  booking: BookingPayload,
  worker: AssignedWorker | null,
  nowIso: string
) {
  const events: BookingTimelineEvent[] = [
    createBookingTimelineEvent("BOOKED", {
      at: nowIso,
      description: `${normalizeText(booking.serviceName) || "Service"} booking has been created.`,
      actorType: "system",
    }),
  ];

  if (normalizeUpper(booking.paymentStatus) === "PAID") {
    events.push(
      createBookingTimelineEvent("PAYMENT_CONFIRMED", {
        at: nowIso,
        actorType: "system",
      })
    );
  } else {
    events.push(
      createBookingTimelineEvent("PAY_LATER_SELECTED", {
        at: nowIso,
        actorType: "system",
      })
    );
  }

  if (worker) {
    events.push(
      createBookingTimelineEvent("TECHNICIAN_ASSIGNED", {
        at: nowIso,
        description: `${worker.name || "Your technician"} has been assigned to this booking.`,
        actorType: "operations",
        actorName: worker.name,
        locationLabel: worker.liveLocationLabel || worker.city,
      })
    );
  } else {
    events.push(
      createBookingTimelineEvent("TECHNICIAN_PENDING", {
        at: nowIso,
        actorType: "operations",
      })
    );
  }

  return events;
}

export async function createTrackedBooking(bookingData: BookingPayload) {
  const nowIso = new Date().toISOString();
  const worker = await findAssignableWorker(
    normalizeText(bookingData.service),
    normalizeText(bookingData.city)
  );
  const timeline = buildInitialTimeline(bookingData, worker, nowIso);
  const bookingRef = doc(collection(serverDb, "bookings"));

  await setDoc(bookingRef, {
    ...bookingData,
    bookingId: bookingRef.id,
    bookingCode: `SFX-${bookingRef.id.slice(0, 8).toUpperCase()}`,
    status: worker ? "CONFIRMED" : "PENDING",
    assignedAt: worker ? nowIso : null,
    assignedWorkerId: worker?.id ?? null,
    assignedWorkerSource: worker?.source ?? null,
    assignedWorkerUid: worker?.uid ?? null,
    assignedWorkerName: worker?.name ?? null,
    assignedWorkerEmail: worker?.email ?? null,
    assignedWorkerPhone: worker?.phone ?? null,
    assignedWorkerCity: worker?.city ?? null,
    assignedWorkerService: worker?.service ?? null,
    assignedWorkerAvatar: worker?.avatar ?? null,
    assignedWorkerRating: worker?.rating ?? null,
    technicianId: worker?.id ?? null,
    technicianName: worker?.name ?? null,
    workerId: worker?.id ?? null,
    workerName: worker?.name ?? null,
    workerLiveLocation: worker
      ? {
          label: worker.liveLocationLabel || worker.city || normalizeText(bookingData.city) || "Assigned area",
          updatedAt: nowIso,
          source: "assignment",
        }
      : null,
    trackingTimeline: timeline,
    trackingLastUpdatedAt: nowIso,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (worker) {
    const collectionName = worker.source === "workers" ? "workers" : "employees";

    await updateDoc(doc(serverDb, collectionName, worker.id), {
      currentBookingId: bookingRef.id,
      lastAssignedAt: serverTimestamp(),
    }).catch(() => undefined);
  }

  return {
    bookingId: bookingRef.id,
    assigned: Boolean(worker),
    worker,
  };
}
