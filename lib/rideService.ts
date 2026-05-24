import { calculateDistanceKm, type Coordinates } from "@/lib/liveTracking";

export type RidePurpose = "CUSTOMER_RIDE" | "WORKER_TRANSFER";

export type RideStatus =
  | "REQUESTED"
  | "RIDER_ASSIGNED"
  | "RIDER_ARRIVED_PICKUP"
  | "OTP_VERIFIED"
  | "IN_TRANSIT"
  | "DROPPED"
  | "CANCELLED";

export type RideLocation = {
  label: string;
  address: string;
  city: string;
  coordinates: Coordinates | null;
};

export type RidePassenger = {
  type: "customer" | "worker";
  name: string;
  phone: string;
  workerId?: string | null;
};

export type RideFareEstimate = {
  currency: "INR";
  pricingMode: "PER_KM_WITH_PEAK_SURGE";
  baseFare: number;
  perKmRate: number;
  distanceKm: number;
  distanceFare: number;
  platformFee: number;
  peakHour: boolean;
  peakMultiplier: number;
  surgeAmount: number;
  estimatedFare: number;
};

export type RideWaitingCharge = {
  freeMinutes: number;
  chargePerExtraMinute: number;
  waitedMinutes: number;
  chargeableMinutes: number;
  charge: number;
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
  assignedRider: {
    id: string;
    source: string;
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
  } | null;
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
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    status: RideStatus;
    at: string;
    actorType: "system" | "rider" | "customer" | "operations";
    actorName?: string | null;
    locationLabel?: string | null;
  }>;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export const rideWaitingPolicy = {
  freeMinutes: 3,
  chargePerExtraMinute: 1,
} as const;

export const rideFarePolicy = {
  baseFare: 25,
  perKmRate: 10,
  platformFee: 5,
  minimumFare: 39,
  peakMultiplier: 1.35,
  peakWindows: [
    { startHour: 8, endHour: 11, label: "Morning peak" },
    { startHour: 17, endHour: 21, label: "Evening peak" },
  ],
} as const;

export const rideStatusLabels: Record<RideStatus, string> = {
  REQUESTED: "Searching rider",
  RIDER_ASSIGNED: "Rider assigned",
  RIDER_ARRIVED_PICKUP: "Rider at pickup",
  OTP_VERIFIED: "OTP verified",
  IN_TRANSIT: "Ride in progress",
  DROPPED: "Dropped",
  CANCELLED: "Cancelled",
};

const cityCoordinateFallbacks: Record<string, Coordinates> = {
  bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  kolkata: { latitude: 22.5726, longitude: 88.3639 },
  mumbai: { latitude: 19.076, longitude: 72.8777 },
  "delhi ncr": { latitude: 28.6139, longitude: 77.209 },
  hyderabad: { latitude: 17.385, longitude: 78.4867 },
  chennai: { latitude: 13.0827, longitude: 80.2707 },
  pune: { latitude: 18.5204, longitude: 73.8567 },
};

function normalizeCity(city?: string | null) {
  return (city || "").trim().toLowerCase();
}

export function getCityCoordinateFallback(city?: string | null, offset = 0): Coordinates {
  const base =
    cityCoordinateFallbacks[normalizeCity(city)] ||
    cityCoordinateFallbacks.kolkata;

  return {
    latitude: Number((base.latitude + offset).toFixed(6)),
    longitude: Number((base.longitude + offset).toFixed(6)),
  };
}

export function getRideDistanceKm(
  pickup?: Coordinates | null,
  drop?: Coordinates | null,
  fallbackKm = 4.2
) {
  if (!pickup || !drop) {
    return fallbackKm;
  }

  const distance = calculateDistanceKm(pickup, drop);
  return Number(Math.max(distance, 1).toFixed(1));
}

export function isRidePeakHour(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });
  const hour = Number(formatter.format(date));

  if (!Number.isFinite(hour)) {
    return false;
  }

  return rideFarePolicy.peakWindows.some(
    (window) => hour >= window.startHour && hour < window.endHour
  );
}

export function estimateRideFare(
  pickup?: Coordinates | null,
  drop?: Coordinates | null,
  fallbackKm = 4.2,
  requestedAt = new Date()
): RideFareEstimate {
  const distanceKm = getRideDistanceKm(pickup, drop, fallbackKm);
  const peakHour = isRidePeakHour(requestedAt);
  const peakMultiplier = peakHour ? rideFarePolicy.peakMultiplier : 1;
  const distanceFare = Math.round(distanceKm * rideFarePolicy.perKmRate);
  const subtotal =
    rideFarePolicy.baseFare + distanceFare + rideFarePolicy.platformFee;
  const surgedTotal = Math.round(subtotal * peakMultiplier);
  const surgeAmount = Math.max(0, surgedTotal - subtotal);
  const estimatedFare = Math.max(rideFarePolicy.minimumFare, surgedTotal);

  return {
    currency: "INR",
    pricingMode: "PER_KM_WITH_PEAK_SURGE",
    baseFare: rideFarePolicy.baseFare,
    perKmRate: rideFarePolicy.perKmRate,
    distanceKm,
    distanceFare,
    platformFee: rideFarePolicy.platformFee,
    peakHour,
    peakMultiplier,
    surgeAmount,
    estimatedFare,
  };
}

export function calculateRideWaitingCharge(
  pickupArrivedAt?: string | null,
  pickupStartedAt?: string | null,
  now = new Date()
): RideWaitingCharge {
  const arrivedAt = pickupArrivedAt ? new Date(pickupArrivedAt) : null;
  const startedAt = pickupStartedAt ? new Date(pickupStartedAt) : now;

  if (
    !arrivedAt ||
    Number.isNaN(arrivedAt.getTime()) ||
    Number.isNaN(startedAt.getTime()) ||
    startedAt.getTime() < arrivedAt.getTime()
  ) {
    return {
      freeMinutes: rideWaitingPolicy.freeMinutes,
      chargePerExtraMinute: rideWaitingPolicy.chargePerExtraMinute,
      waitedMinutes: 0,
      chargeableMinutes: 0,
      charge: 0,
    };
  }

  const waitedMinutes = Math.max(
    0,
    Math.ceil((startedAt.getTime() - arrivedAt.getTime()) / 60000)
  );
  const chargeableMinutes = Math.max(
    0,
    waitedMinutes - rideWaitingPolicy.freeMinutes
  );

  return {
    freeMinutes: rideWaitingPolicy.freeMinutes,
    chargePerExtraMinute: rideWaitingPolicy.chargePerExtraMinute,
    waitedMinutes,
    chargeableMinutes,
    charge: chargeableMinutes * rideWaitingPolicy.chargePerExtraMinute,
  };
}

export function getRideStatusTone(status?: string | null) {
  const normalized = (status || "").toUpperCase();

  if (normalized === "DROPPED") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized === "CANCELLED") {
    return "bg-rose-100 text-rose-700";
  }

  if (
    normalized === "IN_TRANSIT" ||
    normalized === "OTP_VERIFIED" ||
    normalized === "RIDER_ARRIVED_PICKUP"
  ) {
    return "bg-blue-100 text-blue-700";
  }

  if (normalized === "RIDER_ASSIGNED") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-slate-100 text-slate-700";
}
