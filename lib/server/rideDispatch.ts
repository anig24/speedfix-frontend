import "server-only";

import crypto from "crypto";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createBookingTimelineEvent,
  sortBookingTimeline,
  type BookingTimelineEvent,
} from "@/lib/bookingTracking";
import { serverDb } from "@/lib/firebase-server";
import {
  calculateDistanceKm,
  extractCoordinates,
  type Coordinates,
} from "@/lib/liveTracking";
import {
  calculateRideWaitingCharge,
  estimateRideFare,
  getCityCoordinateFallback,
  rideWaitingPolicy,
  type RideFareEstimate,
  type RideLocation,
  type RidePassenger,
  type RidePurpose,
  type RideStatus,
  type RideWaitingCharge,
} from "@/lib/rideService";

type RiderSource = "riders" | "fallback";

type AssignedRider = {
  id: string;
  source: RiderSource;
  uid: string | null;
  riderCode: string;
  name: string;
  phone: string;
  city: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number | null;
  liveLocationLabel: string;
  liveCoordinates: Coordinates | null;
  distanceKm: number | null;
};

type RideTimelineEvent = {
  id: string;
  title: string;
  description: string;
  status: RideStatus;
  at: string;
  actorType: "system" | "rider" | "customer" | "operations";
  actorName?: string | null;
  locationLabel?: string | null;
};

export type RideDispatchClient = {
  rideId: string;
  rideCode: string;
  purpose: RidePurpose;
  sourceBookingId?: string | null;
  bookingCode?: string | null;
  status: RideStatus;
  city: string;
  passenger: RidePassenger;
  pickup: RideLocation;
  drop: RideLocation;
  assignedRider: AssignedRider | null;
  riderLiveLocation: {
    label: string;
    coordinates: Coordinates | null;
    updatedAt: string | null;
  } | null;
  pickupOtp?: string;
  otpVerifiedAt?: string | null;
  pickupArrivedAt?: string | null;
  pickupStartedAt?: string | null;
  droppedAt?: string | null;
  fareEstimate: RideFareEstimate;
  waiting: RideWaitingCharge;
  finalFare: number;
  timeline: RideTimelineEvent[];
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CreateRideInput = {
  purpose: RidePurpose;
  sourceBookingId?: string | null;
  bookingCode?: string | null;
  city: string;
  passenger: RidePassenger;
  pickup: RideLocation;
  drop: RideLocation;
  requestSource: string;
};

type WorkerTransferInput = {
  bookingId: string;
  bookingCode: string;
  bookingData: Record<string, unknown>;
  worker: {
    id: string;
    name: string | null;
    phone: string | null;
    city: string | null;
    liveLocationLabel: string | null;
    liveCoordinates: Coordinates | null;
  };
  trackingTimeline: BookingTimelineEvent[];
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value: unknown) {
  return normalizeText(value).toUpperCase();
}

function normalizePhone(value: unknown) {
  return normalizeText(value).replace(/\D/g, "").slice(0, 10);
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(normalizeText(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function serializeTimestamp(value: unknown): string | null {
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

function serializeRecord(
  id: string,
  data: Record<string, unknown>
): Record<string, unknown> & { id: string } {
  return {
    id,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        serializeTimestamp(value) || value,
      ])
    ),
  };
}

function createRideCode(rideId: string) {
  return `SFX-RIDE-${rideId.slice(0, 8).toUpperCase()}`;
}

function createRideOtp() {
  return crypto.randomInt(1000, 9999).toString();
}

function createRideTimelineEvent(
  title: string,
  description: string,
  status: RideStatus,
  actorType: RideTimelineEvent["actorType"],
  actorName?: string | null,
  locationLabel?: string | null
): RideTimelineEvent {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    status,
    actorType,
    actorName: actorName || null,
    locationLabel: locationLabel || null,
    at: new Date().toISOString(),
  };
}

function normalizeRideLocation(
  value: unknown,
  fallback: {
    label: string;
    address?: string | null;
    city?: string | null;
    coordinates?: Coordinates | null;
    offset?: number;
  }
): RideLocation {
  const raw =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const city =
    normalizeText(raw.city) ||
    normalizeText(fallback.city) ||
    "Kolkata";
  const coordinates =
    extractCoordinates(raw.coordinates, raw, fallback.coordinates) ||
    getCityCoordinateFallback(city, fallback.offset || 0);

  return {
    label:
      normalizeText(raw.label) ||
      normalizeText(raw.name) ||
      fallback.label,
    address:
      normalizeText(raw.address) ||
      normalizeText(raw.addressLine) ||
      normalizeText(fallback.address) ||
      fallback.label,
    city,
    coordinates,
  };
}

function mapRiderCandidate(
  raw: Record<string, unknown> & { id: string },
  source: RiderSource,
  city: string,
  offset = 0
): AssignedRider {
  const liveCoordinates =
    extractCoordinates(
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
    ) || getCityCoordinateFallback(normalizeText(raw.city) || city, offset);

  return {
    id: raw.id,
    source,
    uid: normalizeText(raw.uid) || null,
    riderCode:
      normalizeText(raw.riderCode).toUpperCase() ||
      normalizeText(raw.workerCode).toUpperCase() ||
      `SFX-RDR-${raw.id.slice(0, 6).toUpperCase()}`,
    name:
      normalizeText(raw.fullName) ||
      normalizeText(raw.name) ||
      "SpeedFix bike rider",
    phone:
      normalizeText(raw.phone) ||
      normalizeText(raw.mobile) ||
      normalizeText(raw.phoneNumber) ||
      "+91-7439769525",
    city: normalizeText(raw.city) || city,
    vehicleType:
      normalizeText(raw.vehicleType) ||
      normalizeText(raw.vehicle) ||
      "Bike",
    vehicleNumber:
      normalizeText(raw.vehicleNumber) ||
      normalizeText(raw.bikeNumber) ||
      "SFX BIKE",
    rating: normalizeNumber(raw.rating),
    liveLocationLabel:
      normalizeText(raw.liveLocationLabel) ||
      normalizeText(raw.currentArea) ||
      normalizeText(raw.city) ||
      city,
    liveCoordinates,
    distanceKm: null,
  };
}

function getFallbackRiders(city: string): AssignedRider[] {
  const cityPrefix = normalizeText(city).slice(0, 3).toUpperCase() || "SFX";

  return [0, 1, 2].map((index) => ({
    id: `fallback-rider-${cityPrefix.toLowerCase()}-${index + 1}`,
    source: "fallback" as const,
    uid: null,
    riderCode: `SFX-RDR-${cityPrefix}-${index + 1}`,
    name: ["Aman", "Rohit", "Imran"][index] + " SpeedFix Rider",
    phone: ["+91-9000001001", "+91-9000001002", "+91-9000001003"][index],
    city,
    vehicleType: "Bike",
    vehicleNumber: `${cityPrefix} SF ${1021 + index}`,
    rating: 4.8 - index * 0.1,
    liveLocationLabel: `${city} rider zone ${index + 1}`,
    liveCoordinates: getCityCoordinateFallback(city, (index + 1) * 0.01),
    distanceKm: null,
  }));
}

function isAssignableRider(raw: Record<string, unknown>) {
  if (raw.available === false || raw.active === false || raw.verified === false) {
    return false;
  }

  const role = normalizeUpper(raw.role);
  const vehicleType = normalizeUpper(raw.vehicleType || raw.vehicle);
  const service = normalizeUpper(raw.service);

  return (
    !role ||
    role.includes("RIDER") ||
    service.includes("RIDE") ||
    vehicleType.includes("BIKE") ||
    vehicleType.includes("TWO")
  );
}

async function findAssignableRider(city: string, pickup: RideLocation) {
  const snapshot = await getDocs(collection(serverDb, "riders")).catch(() => null);
  const records =
    snapshot?.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Record<string, unknown>),
    })) || [];

  const activeRiders = records
    .filter(isAssignableRider)
    .map((record, index) => mapRiderCandidate(record, "riders", city, index * 0.01));

  const candidates = activeRiders.length ? activeRiders : getFallbackRiders(city);

  return candidates
    .map((rider) => {
      const distanceKm =
        pickup.coordinates && rider.liveCoordinates
          ? calculateDistanceKm(pickup.coordinates, rider.liveCoordinates)
          : null;

      return {
        ...rider,
        distanceKm: distanceKm === null ? null : Number(distanceKm.toFixed(1)),
      };
    })
    .sort((left, right) => {
      const leftCityScore =
        normalizeUpper(left.city) === normalizeUpper(city) ? 0 : 1;
      const rightCityScore =
        normalizeUpper(right.city) === normalizeUpper(city) ? 0 : 1;

      if (leftCityScore !== rightCityScore) {
        return leftCityScore - rightCityScore;
      }

      if (left.distanceKm === null) {
        return 1;
      }

      if (right.distanceKm === null) {
        return -1;
      }

      return left.distanceKm - right.distanceKm;
    })[0] || null;
}

function buildRiderLocation(rider: AssignedRider | null, nowIso: string) {
  if (!rider) {
    return null;
  }

  return {
    label: rider.liveLocationLabel || rider.city,
    coordinates: rider.liveCoordinates,
    updatedAt: nowIso,
    source: "assignment",
  };
}

function publicRider(rider: AssignedRider | null) {
  return rider
    ? {
        id: rider.id,
        source: rider.source,
        uid: rider.uid,
        riderCode: rider.riderCode,
        name: rider.name,
        phone: rider.phone,
        city: rider.city,
        vehicleType: rider.vehicleType,
        vehicleNumber: rider.vehicleNumber,
        rating: rider.rating,
        liveLocationLabel: rider.liveLocationLabel,
        liveCoordinates: rider.liveCoordinates,
        distanceKm: rider.distanceKm,
      }
    : null;
}

function toRideClient(
  record: Record<string, unknown> & { id: string },
  includeOtp = false
): RideDispatchClient {
  const pickup = record.pickup as RideLocation;
  const drop = record.drop as RideLocation;
  const fareEstimate =
    (record.fareEstimate as RideFareEstimate | undefined) ||
    estimateRideFare(pickup?.coordinates, drop?.coordinates);
  const pickupArrivedAt = serializeTimestamp(record.pickupArrivedAt);
  const pickupStartedAt = serializeTimestamp(record.pickupStartedAt);
  const waiting = calculateRideWaitingCharge(pickupArrivedAt, pickupStartedAt);
  const storedWaiting = record.waiting as Partial<RideWaitingCharge> | undefined;
  const waitingCharge =
    typeof storedWaiting?.charge === "number" ? storedWaiting.charge : waiting.charge;
  const assignedRider = (record.assignedRider || null) as AssignedRider | null;

  return {
    rideId: normalizeText(record.rideId) || record.id,
    rideCode: normalizeText(record.rideCode) || createRideCode(record.id),
    purpose: (normalizeText(record.purpose) || "CUSTOMER_RIDE") as RidePurpose,
    sourceBookingId: normalizeText(record.sourceBookingId) || null,
    bookingCode: normalizeText(record.bookingCode) || null,
    status: (normalizeText(record.status) || "REQUESTED") as RideStatus,
    city: normalizeText(record.city),
    passenger: record.passenger as RidePassenger,
    pickup,
    drop,
    assignedRider,
    riderLiveLocation:
      record.riderLiveLocation &&
      typeof record.riderLiveLocation === "object"
        ? {
            label: normalizeText(
              (record.riderLiveLocation as Record<string, unknown>).label
            ),
            coordinates: extractCoordinates(
              (record.riderLiveLocation as Record<string, unknown>).coordinates
            ),
            updatedAt: serializeTimestamp(
              (record.riderLiveLocation as Record<string, unknown>).updatedAt
            ),
          }
        : null,
    ...(includeOtp ? { pickupOtp: normalizeText(record.pickupOtp) } : {}),
    otpVerifiedAt: serializeTimestamp(record.otpVerifiedAt),
    pickupArrivedAt,
    pickupStartedAt,
    droppedAt: serializeTimestamp(record.droppedAt),
    fareEstimate,
    waiting: {
      ...waiting,
      ...storedWaiting,
      charge: waitingCharge,
    },
    finalFare:
      normalizeNumber(record.finalFare) ||
      fareEstimate.estimatedFare + waitingCharge,
    timeline: Array.isArray(record.timeline)
      ? (record.timeline as RideTimelineEvent[])
      : [],
    createdAt: serializeTimestamp(record.createdAt),
    updatedAt: serializeTimestamp(record.updatedAt),
  };
}

async function createRideDispatch(input: CreateRideInput, includeOtp = true) {
  const nowIso = new Date().toISOString();
  const rideRef = doc(collection(serverDb, "rideDispatches"));
  const rideCode = createRideCode(rideRef.id);
  const rider = await findAssignableRider(input.city, input.pickup);
  const status: RideStatus = rider ? "RIDER_ASSIGNED" : "REQUESTED";
  const fareEstimate = estimateRideFare(
    input.pickup.coordinates,
    input.drop.coordinates
  );
  const pickupOtp = createRideOtp();
  const timeline: RideTimelineEvent[] = [
    createRideTimelineEvent(
      "Ride requested",
      `${input.passenger.name || "Passenger"} ride request was created.`,
      "REQUESTED",
      "system",
      null,
      input.pickup.label
    ),
  ];

  if (rider) {
    timeline.push(
      createRideTimelineEvent(
        "Rider assigned",
        `${rider.name} has received pickup and drop details.`,
        "RIDER_ASSIGNED",
        "operations",
        rider.name,
        rider.liveLocationLabel
      )
    );
  }

  const record = {
    rideId: rideRef.id,
    rideCode,
    purpose: input.purpose,
    sourceBookingId: input.sourceBookingId || null,
    bookingCode: input.bookingCode || null,
    requestSource: input.requestSource,
    status,
    city: input.city,
    passenger: input.passenger,
    pickup: input.pickup,
    drop: input.drop,
    assignedRider: publicRider(rider),
    assignedRiderId: rider?.id || null,
    assignedRiderCode: rider?.riderCode || null,
    assignedRiderName: rider?.name || null,
    assignedRiderPhone: rider?.phone || null,
    assignedRiderVehicleNumber: rider?.vehicleNumber || null,
    assignedRiderVehicleType: rider?.vehicleType || null,
    riderLiveLocation: buildRiderLocation(rider, nowIso),
    pickupOtp,
    otpVerifiedAt: null,
    pickupArrivedAt: null,
    pickupStartedAt: null,
    droppedAt: null,
    fareEstimate,
    waitingPolicy: rideWaitingPolicy,
    waiting: calculateRideWaitingCharge(null, null),
    finalFare: fareEstimate.estimatedFare,
    timeline,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(rideRef, record);

  if (rider?.source === "riders") {
    await updateDoc(doc(serverDb, "riders", rider.id), {
      currentRideId: rideRef.id,
      lastAssignedAt: serverTimestamp(),
    }).catch(() => undefined);
  }

  if (rider?.uid) {
    await setDoc(doc(collection(serverDb, "notifications", rider.uid, "items")), {
      message: `${rideCode}: pickup ${input.pickup.label}, drop ${input.drop.label}.`,
      rideId: rideRef.id,
      createdAt: serverTimestamp(),
    }).catch(() => undefined);
  }

  return toRideClient(
    {
      id: rideRef.id,
      ...record,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    includeOtp
  );
}

export async function createWorkerTransferRide(input: WorkerTransferInput) {
  const city =
    normalizeText(input.bookingData.city) ||
    normalizeText(input.worker.city) ||
    "Kolkata";
  const customerCoordinates = extractCoordinates(input.bookingData.customerLocation);
  const pickup = normalizeRideLocation(
    {
      label:
        input.worker.liveLocationLabel ||
        `${input.worker.name || "Worker"} pickup point`,
      address:
        input.worker.liveLocationLabel ||
        normalizeText(input.worker.city) ||
        city,
      city,
      coordinates: input.worker.liveCoordinates,
    },
    {
      label: `${input.worker.name || "Assigned worker"} pickup point`,
      city,
      coordinates: input.worker.liveCoordinates,
      offset: 0.01,
    }
  );
  const drop = normalizeRideLocation(
    {
      label: "Assigned service location",
      address: normalizeText(input.bookingData.address),
      city,
      coordinates: customerCoordinates,
    },
    {
      label: "Assigned service location",
      address: normalizeText(input.bookingData.address),
      city,
      coordinates: customerCoordinates,
      offset: 0.035,
    }
  );
  const ride = await createRideDispatch(
    {
      purpose: "WORKER_TRANSFER",
      sourceBookingId: input.bookingId,
      bookingCode: input.bookingCode,
      city,
      passenger: {
        type: "worker",
        name: input.worker.name || "Assigned worker",
        phone: input.worker.phone || "",
        workerId: input.worker.id,
      },
      pickup,
      drop,
      requestSource: "worker-assignment",
    },
    false
  );
  const event = createBookingTimelineEvent(
    ride.assignedRider ? "RIDER_ASSIGNED" : "RIDE_REQUESTED",
    {
      title: ride.assignedRider ? "Bike rider assigned" : "Bike rider requested",
      description: ride.assignedRider
        ? `${ride.assignedRider.name} will pick up ${ride.passenger.name} and drop them at the assigned service location.`
        : "A bike rider request has been created for worker pickup and drop.",
      actorType: "operations",
      actorName: ride.assignedRider?.name || null,
      locationLabel: ride.pickup.label,
      status: "CONFIRMED",
    }
  );

  await updateDoc(doc(serverDb, "bookings", input.bookingId), {
    workerRideDispatchId: ride.rideId,
    rideDispatchStatus: ride.status,
    rideServiceRequired: true,
    workerRide: {
      rideId: ride.rideId,
      rideCode: ride.rideCode,
      status: ride.status,
      pickup: ride.pickup,
      drop: ride.drop,
      assignedRider: ride.assignedRider,
      riderLiveLocation: ride.riderLiveLocation,
      fareEstimate: ride.fareEstimate,
      waiting: ride.waiting,
      finalFare: ride.finalFare,
    },
    trackingTimeline: sortBookingTimeline([...input.trackingTimeline, event]),
    trackingLastUpdatedAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  });

  return ride;
}

export async function createCustomerRide(payload: Record<string, unknown>) {
  const passengerName =
    normalizeText(payload.passengerName) ||
    normalizeText(payload.customerName) ||
    normalizeText(payload.name);
  const passengerPhone =
    normalizeText(payload.passengerPhone) ||
    normalizeText(payload.customerPhone) ||
    normalizeText(payload.phone);
  const city =
    normalizeText(payload.city) ||
    normalizeText((payload.pickup as Record<string, unknown> | undefined)?.city) ||
    "Kolkata";

  if (!passengerName || !normalizePhone(passengerPhone)) {
    return {
      error: "Passenger name and phone are required.",
      statusCode: 400,
    };
  }

  const pickup = normalizeRideLocation(payload.pickup, {
    label: "Pickup location",
    city,
    offset: 0,
  });
  const drop = normalizeRideLocation(payload.drop, {
    label: "Drop location",
    city,
    offset: 0.04,
  });

  if (!pickup.address || !drop.address) {
    return {
      error: "Pickup and drop location are required.",
      statusCode: 400,
    };
  }

  const ride = await createRideDispatch({
    purpose: "CUSTOMER_RIDE",
    city,
    passenger: {
      type: "customer",
      name: passengerName,
      phone: normalizePhone(passengerPhone),
    },
    pickup,
    drop,
    requestSource: "customer-ride",
  });

  return { ride };
}

export async function getRideDispatch(rideIdOrCode: string, includeOtp = false) {
  const normalized = normalizeText(rideIdOrCode);

  if (!normalized) {
    return null;
  }

  const directSnapshot = await getDoc(doc(serverDb, "rideDispatches", normalized));
  const rideSnapshot = directSnapshot.exists()
    ? directSnapshot
    : (
        await getDocs(
          query(
            collection(serverDb, "rideDispatches"),
            where("rideCode", "==", normalized.toUpperCase()),
            limit(1)
          )
        ).catch(() => null)
      )?.docs[0] || null;

  if (!rideSnapshot) {
    return null;
  }

  return toRideClient(
    serializeRecord(
      rideSnapshot.id,
      rideSnapshot.data() as Record<string, unknown>
    ),
    includeOtp
  );
}

export async function getRideDispatchesForBookings(
  bookingIds: string[],
  includeOtp = false
) {
  const uniqueBookingIds = Array.from(new Set(bookingIds.filter(Boolean)));

  if (!uniqueBookingIds.length) {
    return [];
  }

  const chunks = Array.from(
    { length: Math.ceil(uniqueBookingIds.length / 10) },
    (_, index) => uniqueBookingIds.slice(index * 10, index * 10 + 10)
  );
  const snapshots = await Promise.all(
    chunks.map((chunk) =>
      getDocs(
        query(
          collection(serverDb, "rideDispatches"),
          where("sourceBookingId", "in", chunk)
        )
      ).catch(() => null)
    )
  );

  return snapshots
    .flatMap((snapshot) => snapshot?.docs || [])
    .map((rideDoc) =>
      toRideClient(
        serializeRecord(rideDoc.id, rideDoc.data() as Record<string, unknown>),
        includeOtp
      )
    )
    .filter((ride) => ride.purpose === "WORKER_TRANSFER");
}

export async function updateRideDispatch(
  rideIdOrCode: string,
  payload: Record<string, unknown>
) {
  const ride = await getRideDispatch(rideIdOrCode, true);

  if (!ride) {
    return { error: "Ride was not found.", statusCode: 404 };
  }

  const action = normalizeUpper(payload.action);
  const nowIso = new Date().toISOString();
  const riderCode = normalizeUpper(payload.riderCode);
  const phone = normalizePhone(payload.phone);
  const assignedRiderCode = normalizeUpper(ride.assignedRider?.riderCode);
  const assignedRiderPhone = normalizePhone(ride.assignedRider?.phone);

  if (riderCode && assignedRiderCode && riderCode !== assignedRiderCode) {
    return { error: "Rider code does not match this ride.", statusCode: 403 };
  }

  if (phone && assignedRiderPhone && phone !== assignedRiderPhone) {
    return { error: "Rider phone does not match this ride.", statusCode: 403 };
  }

  const updates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  const timeline = Array.isArray(ride.timeline) ? [...ride.timeline] : [];
  let nextStatus = ride.status;
  let eventTitle = "";
  let eventDescription = "";

  if (action === "SHARE_LOCATION") {
    const location = normalizeRideLocation(payload.location, {
      label: ride.assignedRider?.liveLocationLabel || ride.city,
      city: ride.city,
      coordinates: ride.riderLiveLocation?.coordinates,
      offset: 0.02,
    });

    updates.riderLiveLocation = {
      label: location.label,
      coordinates: location.coordinates,
      updatedAt: nowIso,
      source: "rider-update",
    };
    eventTitle = "Rider location updated";
    eventDescription = `${ride.assignedRider?.name || "Rider"} shared live location.`;
  } else if (action === "ARRIVE_PICKUP") {
    nextStatus = "RIDER_ARRIVED_PICKUP";
    updates.status = nextStatus;
    updates.pickupArrivedAt = nowIso;
    eventTitle = "Rider arrived at pickup";
    eventDescription = `${ride.assignedRider?.name || "Rider"} reached ${ride.pickup.label}.`;
  } else if (action === "VERIFY_PICKUP_OTP") {
    const otp = normalizeText(payload.otp);

    if (!otp || otp !== ride.pickupOtp) {
      return { error: "Pickup OTP did not match.", statusCode: 400 };
    }

    nextStatus = "OTP_VERIFIED";
    const waiting = calculateRideWaitingCharge(ride.pickupArrivedAt, nowIso);
    updates.status = nextStatus;
    updates.otpVerifiedAt = nowIso;
    updates.pickupStartedAt = nowIso;
    updates.waiting = waiting;
    updates.finalFare = ride.fareEstimate.estimatedFare + waiting.charge;
    eventTitle = "Pickup OTP verified";
    eventDescription = "Passenger pickup was verified with OTP.";
  } else if (action === "START_RIDE") {
    nextStatus = "IN_TRANSIT";
    const pickupStartedAt = ride.pickupStartedAt || nowIso;
    const waiting = calculateRideWaitingCharge(
      ride.pickupArrivedAt,
      pickupStartedAt
    );
    updates.status = nextStatus;
    updates.pickupStartedAt = pickupStartedAt;
    updates.waiting = waiting;
    updates.finalFare = ride.fareEstimate.estimatedFare + waiting.charge;
    eventTitle = "Ride started";
    eventDescription = `${ride.passenger.name} is on the way to ${ride.drop.label}.`;
  } else if (action === "COMPLETE_RIDE") {
    nextStatus = "DROPPED";
    const waiting = calculateRideWaitingCharge(
      ride.pickupArrivedAt,
      ride.pickupStartedAt || nowIso
    );
    updates.status = nextStatus;
    updates.droppedAt = nowIso;
    updates.waiting = waiting;
    updates.finalFare = ride.fareEstimate.estimatedFare + waiting.charge;
    eventTitle = "Ride completed";
    eventDescription = `${ride.passenger.name} was dropped at ${ride.drop.label}.`;
  } else if (action === "CANCEL") {
    nextStatus = "CANCELLED";
    updates.status = nextStatus;
    eventTitle = "Ride cancelled";
    eventDescription = "Ride dispatch was cancelled.";
  } else {
    return { error: "Unsupported ride action.", statusCode: 400 };
  }

  if (eventTitle) {
    timeline.push(
      createRideTimelineEvent(
        eventTitle,
        eventDescription,
        nextStatus,
        "rider",
        ride.assignedRider?.name || null,
        ride.riderLiveLocation?.label || ride.pickup.label
      )
    );
    updates.timeline = timeline;
  }

  const rideRef = doc(serverDb, "rideDispatches", ride.rideId);
  await updateDoc(rideRef, updates);

  if (ride.sourceBookingId) {
    await updateDoc(doc(serverDb, "bookings", ride.sourceBookingId), {
      rideDispatchStatus: nextStatus,
      "workerRide.status": nextStatus,
      "workerRide.waiting": updates.waiting || ride.waiting,
      "workerRide.finalFare": updates.finalFare || ride.finalFare,
      updatedAt: serverTimestamp(),
    }).catch(() => undefined);
  }

  if (nextStatus === "DROPPED" && ride.assignedRider?.source === "riders") {
    await updateDoc(doc(serverDb, "riders", ride.assignedRider.id), {
      currentRideId: null,
      lastCompletedRideAt: serverTimestamp(),
    }).catch(() => undefined);
  }

  return {
    ride: await getRideDispatch(ride.rideId, true),
  };
}
