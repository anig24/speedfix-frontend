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
import {
  calculateDistanceKm,
  extractCoordinates,
  type Coordinates,
} from "@/lib/liveTracking";
import { serverDb } from "@/lib/firebase-server";
import { createWorkerTransferRide } from "@/lib/server/rideDispatch";

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
  liveCoordinates: Coordinates | null;
};

type BookingPayload = Record<string, unknown> & {
  service: string;
  serviceName?: string;
  city?: string;
  paymentStatus?: string;
  customerLocation?: Coordinates | null;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value: unknown) {
  return normalizeText(value).toUpperCase();
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
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

function isVerifiedFieldWorker(
  source: WorkerSource,
  candidate: Record<string, unknown>
) {
  if (source === "employees") {
    return true;
  }

  const kyc = candidate.kyc as Record<string, unknown> | undefined;
  const verificationStatus = normalizeUpper(candidate.verificationStatus);
  const kycStatus = normalizeUpper(kyc?.status);

  return (
    candidate.verified === true ||
    verificationStatus === "VERIFIED" ||
    kycStatus === "VERIFIED"
  );
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
    liveCoordinates: extractCoordinates(
      raw.liveCoordinates,
      raw.currentCoordinates,
      raw.locationCoordinates,
      raw.coordinates,
      raw.geoPoint,
      {
        latitude: raw.latitude,
        longitude: raw.longitude,
      },
      {
        lat: raw.lat,
        lng: raw.lng,
      }
    ),
  };
}

function getDistanceScore(
  customerCoordinates: Coordinates | null,
  workerCoordinates: Coordinates | null
) {
  if (!customerCoordinates || !workerCoordinates) {
    return {
      score: 0,
      distanceKm: null as number | null,
    };
  }

  const distanceKm = calculateDistanceKm(customerCoordinates, workerCoordinates);

  if (distanceKm <= 5) {
    return { score: 4, distanceKm };
  }

  if (distanceKm <= 12) {
    return { score: 3, distanceKm };
  }

  if (distanceKm <= 25) {
    return { score: 2, distanceKm };
  }

  return { score: 1, distanceKm };
}

async function findAssignableWorker(
  service: string,
  city: string,
  customerCoordinates: Coordinates | null
) {
  const [workersSnapshot, employeesSnapshot] = await Promise.all([
    getDocs(collection(serverDb, "workers")),
    getDocs(collection(serverDb, "employees")),
  ]);

  const workers = workersSnapshot.docs.map((snapshot) => ({
    id: snapshot.id,
    ...(snapshot.data() as Record<string, unknown>),
  })) as Array<Record<string, unknown> & { id: string }>;

  const employees = employeesSnapshot.docs
    .map((snapshot) => ({
      id: snapshot.id,
      ...(snapshot.data() as Record<string, unknown>),
    })) as Array<Record<string, unknown> & { id: string }>;

  const candidates = [
    ...workers.map((item) => ({ source: "workers" as const, raw: item })),
    ...employees.map((item) => ({ source: "employees" as const, raw: item })),
  ]
    .filter(
      (candidate) =>
        isAvailable(candidate.raw) &&
        isVerifiedFieldWorker(candidate.source, candidate.raw)
    )
    .map((candidate) => ({
      ...candidate,
      worker: mapWorkerCandidate(candidate.source, candidate.raw),
      distance: getDistanceScore(
        customerCoordinates,
        mapWorkerCandidate(candidate.source, candidate.raw).liveCoordinates
      ),
    }))
    .map((candidate) => ({
      ...candidate,
      score:
        (matchesService(candidate.raw, service) ? 4 : 0) +
        (matchesCity(candidate.raw, city) ? 2 : 0) +
        candidate.distance.score +
        (normalizeText(candidate.raw.name) ? 1 : 0),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (left.distance.distanceKm === null) {
        return 1;
      }

      if (right.distance.distanceKm === null) {
        return -1;
      }

      return left.distance.distanceKm - right.distance.distanceKm;
    });

  const bestMatch = candidates.find((candidate) => candidate.score >= 4) || candidates[0];

  if (!bestMatch) {
    return null;
  }

  return bestMatch.worker;
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
  const customerCoordinates = extractCoordinates(bookingData.customerLocation);
  const worker = await findAssignableWorker(
    normalizeText(bookingData.service),
    normalizeText(bookingData.city),
    customerCoordinates
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
          coordinates: worker.liveCoordinates,
          updatedAt: nowIso,
          source: "assignment",
        }
      : null,
    customerLocation: customerCoordinates,
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

  const rideDispatch = worker
    ? await createWorkerTransferRide({
        bookingId: bookingRef.id,
        bookingCode: `SFX-${bookingRef.id.slice(0, 8).toUpperCase()}`,
        bookingData,
        worker: {
          id: worker.id,
          name: worker.name,
          phone: worker.phone,
          city: worker.city,
          liveLocationLabel: worker.liveLocationLabel,
          liveCoordinates: worker.liveCoordinates,
        },
        trackingTimeline: timeline,
      }).catch((error) => {
        console.error("WORKER_RIDE_DISPATCH_ERROR", error);
        return null;
      })
    : null;

  return {
    bookingId: bookingRef.id,
    assigned: Boolean(worker),
    worker,
    rideDispatch,
  };
}
