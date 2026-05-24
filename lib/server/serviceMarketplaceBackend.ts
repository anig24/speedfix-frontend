import "server-only";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
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
import { createTrackedBooking } from "@/lib/server/bookingLifecycle";
import { getRideDispatchesForBookings } from "@/lib/server/rideDispatch";
import { extractCoordinates } from "@/lib/liveTracking";
import {
  getServiceBySlug,
  operatingCities,
  serviceCatalog,
} from "@/lib/serviceCatalog";

const GST_RATE = 0.18;
const PLATFORM_FEE = 29;

type MarketplaceItem = Record<string, unknown> & {
  quantity?: number;
  packagePrice?: number;
  addons?: Array<{ name?: string; price?: number }>;
  serviceSlug?: string;
  serviceName?: string;
  subcategorySlug?: string;
  subcategoryName?: string;
  packageName?: string;
};

type MarketplaceBookingInput = {
  bookingData: Record<string, unknown>;
  status?: string;
  paymentStatus?: string;
  paymentId?: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value: unknown) {
  return normalizeText(value).toUpperCase();
}

function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(normalizeText(value));
  return Number.isFinite(parsed) ? parsed : fallback;
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

async function getRecentCollection(
  collectionName: string,
  max = 80
): Promise<Array<Record<string, unknown> & { id: string }>> {
  const snapshot = await getDocs(
    query(collection(serverDb, collectionName), orderBy("createdAt", "desc"), limit(max))
  ).catch(async () => {
    return getDocs(query(collection(serverDb, collectionName), limit(max))).catch(
      () => null
    );
  });

  if (!snapshot) {
    return [];
  }

  return snapshot.docs.map((item) =>
    serializeRecord(item.id, item.data() as Record<string, unknown>)
  );
}

function getServiceSla(serviceSlug: string) {
  const normalized = normalizeText(serviceSlug);

  if (normalized.includes("cleaning") || normalized.includes("renovation")) {
    return {
      assignmentMinutes: 45,
      arrivalWindow: "Same-day planned slot",
      fulfillmentWindow: "2 to 8 hours",
      priority: "SCHEDULED",
    };
  }

  if (
    normalized.includes("electrician") ||
    normalized.includes("plumbing") ||
    normalized.includes("ac")
  ) {
    return {
      assignmentMinutes: 15,
      arrivalWindow: "60 to 120 minutes",
      fulfillmentWindow: "30 to 120 minutes",
      priority: "URGENT_READY",
    };
  }

  return {
    assignmentMinutes: 30,
    arrivalWindow: "Next available slot",
    fulfillmentWindow: "As per selected package",
    priority: "STANDARD",
  };
}

function buildSlots() {
  const windows = [
    { label: "Morning", time: "08:00 - 11:00" },
    { label: "Afternoon", time: "12:00 - 15:00" },
    { label: "Evening", time: "16:00 - 20:00" },
  ];

  return Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);

    return windows.map((window, windowIndex) => ({
      id: `${date.toISOString().slice(0, 10)}-${window.label.toLowerCase()}`,
      date: date.toISOString().slice(0, 10),
      label: window.label,
      time: window.time,
      capacity: Math.max(2, 9 - dayIndex - windowIndex),
    }));
  }).flat();
}

function getOperatingModel() {
  return {
    flow: [
      "Category discovery",
      "Package and add-on quote",
      "Slot and address capture",
      "Payment or pay-after-service",
      "Provider skill and geo matching",
      "Dispatch, live location, and ETA",
      "Job card, proof, and quality gate",
      "Invoice, feedback, recovery, and revisit",
    ],
    providerControls: [
      "Skill tags",
      "City and pincode coverage",
      "KYC and availability",
      "Distance-based assignment",
      "Current job lock",
      "Payout readiness",
    ],
    customerControls: [
      "Transparent quote",
      "Preferred slot",
      "Live tracking",
      "Support handoff",
      "Revisit and refund route",
    ],
    opsControls: [
      "City command queue",
      "Unassigned booking watch",
      "SLA breach monitor",
      "Recovery case desk",
      "Payment and refund ledger",
    ],
  };
}

function mapCatalogService(service: (typeof serviceCatalog)[number], city: string) {
  const citySupported = !city || operatingCities.includes(city);
  const sla = getServiceSla(service.slug);

  return {
    slug: service.slug,
    name: service.name,
    tagline: service.tagline,
    description: service.description,
    image: service.image,
    basePrice: service.basePrice,
    rating: service.rating,
    reviews: service.reviews,
    jobsCompleted: service.jobsCompleted,
    responseTime: service.responseTime,
    coverage: service.coverage,
    packages: service.packages,
    addons: service.addons,
    subcategories: service.subcategories,
    marketplace: {
      citySupported,
      sla,
      qualityGates: [
        "Before work checklist",
        "Technician status update",
        "Customer confirmation",
        "Completion proof",
      ],
      dispatchModel: "Skill, city, availability, distance, and active-job lock",
    },
  };
}

export function buildMarketplaceQuote(payload: Record<string, unknown>) {
  const items = Array.isArray(payload.items)
    ? (payload.items as MarketplaceItem[])
    : [];
  const discountAmount = normalizeNumber(payload.discountAmount);
  const explicitAmount = normalizeNumber(payload.amount);

  const lineItems = items.map((item) => {
    const quantity = Math.max(1, normalizeNumber(item.quantity, 1));
    const packagePrice = normalizeNumber(item.packagePrice);
    const addonTotal = Array.isArray(item.addons)
      ? item.addons.reduce((sum, addon) => sum + normalizeNumber(addon.price), 0)
      : 0;
    const unitTotal = packagePrice + addonTotal;

    return {
      serviceSlug: normalizeText(item.serviceSlug),
      serviceName: normalizeText(item.serviceName),
      subcategorySlug: normalizeText(item.subcategorySlug),
      subcategoryName: normalizeText(item.subcategoryName),
      packageName: normalizeText(item.packageName),
      quantity,
      unitTotal,
      total: unitTotal * quantity,
    };
  });

  const subtotal =
    lineItems.reduce((sum, item) => sum + item.total, 0) || explicitAmount;
  const platformFee = subtotal > 0 ? PLATFORM_FEE : 0;
  const gst = Math.round(Math.max(subtotal - discountAmount, 0) * GST_RATE);
  const payable = Math.max(subtotal - discountAmount + platformFee + gst, 0);

  return {
    currency: "INR",
    lineItems,
    subtotal,
    discountAmount,
    platformFee,
    gst,
    payable,
    currentCheckoutAmount: explicitAmount || Math.max(subtotal - discountAmount, 0),
    pricingControls: [
      "Package price locked before dispatch",
      "Add-on total itemized",
      "Discount captured with audit fields",
      "Taxes and platform fee visible in marketplace quote API",
    ],
  };
}

export function buildMarketplaceCatalog(input: {
  city?: string | null;
  pincode?: string | null;
  query?: string | null;
}) {
  const city = normalizeText(input.city);
  const search = normalizeText(input.query).toLowerCase();
  const pincode = normalizeText(input.pincode);
  const services = serviceCatalog.filter((service) => {
    if (!search) {
      return true;
    }

    const haystack = [
      service.name,
      service.tagline,
      service.description,
      service.coverage,
      service.offer,
      ...service.searchTerms,
      ...service.subcategories.flatMap((subcategory) => [
        subcategory.name,
        subcategory.tagline,
        subcategory.description,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });

  return {
    city: city || null,
    pincode: pincode || null,
    operatingCities,
    operatingModel: getOperatingModel(),
    slots: buildSlots(),
    categories: services.map((service) => mapCatalogService(service, city)),
    summary: {
      categories: services.length,
      subcategories: services.reduce(
        (sum, service) => sum + service.subcategories.length,
        0
      ),
      citySupported: !city || operatingCities.includes(city),
    },
  };
}

function validateBookingPayload(bookingData: Record<string, unknown>) {
  const service = normalizeText(bookingData.service);
  const customerName = normalizeText(bookingData.customerName);
  const customerPhone = normalizeText(bookingData.customerPhone);
  const address = normalizeText(bookingData.address);

  if (!service || !customerName || !customerPhone || !address) {
    return "Service, customer name, phone, and address are required.";
  }

  return null;
}

function buildMarketplaceWorkflow(bookingData: Record<string, unknown>) {
  const serviceSlug = normalizeText(bookingData.service);
  const service = getServiceBySlug(serviceSlug);
  const quote = buildMarketplaceQuote(bookingData);
  const requestedSlot =
    normalizeText(bookingData.requestedSlot) ||
    normalizeText(bookingData.slot) ||
    "Next available";

  return {
    model: "SERVICE_MARKETPLACE",
    flowVersion: "2026.05",
    serviceSlug,
    serviceName: normalizeText(bookingData.serviceName) || service?.name || serviceSlug,
    requestedSlot,
    sla: getServiceSla(serviceSlug),
    quote,
    lanes: {
      customer: "DISCOVER_BOOK_PAY_TRACK_RECOVER",
      provider: "MATCH_ACCEPT_ROUTE_EXECUTE_CLOSE",
      operations: "CITY_COMMAND_SLA_QA_RECOVERY",
      finance: "PAYMENT_SETTLEMENT_REFUND",
    },
    controls: getOperatingModel(),
  };
}

export async function createMarketplaceBooking(input: MarketplaceBookingInput) {
  const validationError = validateBookingPayload(input.bookingData);

  if (validationError) {
    return { error: validationError };
  }

  const workflow = buildMarketplaceWorkflow(input.bookingData);
  const bookingData = {
    ...input.bookingData,
    service: workflow.serviceSlug,
    serviceName: workflow.serviceName,
    city: normalizeText(input.bookingData.city),
    customerLocation: extractCoordinates(input.bookingData.customerLocation),
    paymentId:
      input.paymentId || normalizeText(input.bookingData.paymentId) || null,
    paymentStatus:
      input.paymentStatus ||
      normalizeText(input.bookingData.paymentStatus) ||
      "PENDING",
    status: input.status || normalizeText(input.bookingData.status) || "PENDING",
    marketplaceWorkflow: workflow,
    bookingChannel: "speedfix-marketplace",
    fulfillmentModel: "managed-marketplace",
    customerLifecycleStage: "BOOKED",
    providerAllocationStatus: "MATCHING",
    opsEscalationLevel: "NORMAL",
    qualityGateStatus: "PENDING",
  };

  const result = await createTrackedBooking(bookingData);
  const nowIso = new Date().toISOString();

  await Promise.all([
    setDoc(doc(serverDb, "marketplaceOrders", result.bookingId), {
      bookingId: result.bookingId,
      bookingCode: `SFX-${result.bookingId.slice(0, 8).toUpperCase()}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      customerName: normalizeText(input.bookingData.customerName),
      customerPhone: normalizeText(input.bookingData.customerPhone),
      city: normalizeText(input.bookingData.city),
      pincode: normalizeText(input.bookingData.pincode),
      service: workflow.serviceSlug,
      serviceName: workflow.serviceName,
      paymentStatus: bookingData.paymentStatus,
      assigned: result.assigned,
      assignedWorkerId: result.worker?.id || null,
      workflow,
    }),
    setDoc(doc(serverDb, "marketplaceOpsQueue", result.bookingId), {
      bookingId: result.bookingId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      queue: result.assigned ? "DISPATCH_READY" : "PROVIDER_MATCHING",
      priority: workflow.sla.priority,
      status: result.assigned ? "ASSIGNED" : "UNASSIGNED",
      city: normalizeText(input.bookingData.city),
      service: workflow.serviceSlug,
      owner: result.assigned ? "field-dispatch" : "city-ops",
      nextAction: result.assigned
        ? "Track worker confirmation and ETA."
        : "Find verified provider or escalate city capacity.",
      slaDueAt: nowIso,
    }),
  ]);

  if (!result.assigned) {
    await setDoc(doc(serverDb, "customerSupportCases", result.bookingId), {
      bookingId: result.bookingId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      type: "AUTO_RECOVERY",
      status: "OPEN",
      priority: "HIGH",
      reason: "Provider assignment pending after booking creation.",
      owner: "customer-experience",
      customerName: normalizeText(input.bookingData.customerName),
      customerPhone: normalizeText(input.bookingData.customerPhone),
      city: normalizeText(input.bookingData.city),
    });
  }

  return {
    ...result,
    workflow,
  };
}

export async function getMarketplaceBookingTimeline(bookingId: string) {
  const normalizedBookingId = normalizeText(bookingId);

  if (!normalizedBookingId) {
    return null;
  }

  const directSnapshot = await getDoc(
    doc(serverDb, "bookings", normalizedBookingId)
  );
  const bookingSnapshot = directSnapshot.exists()
    ? directSnapshot
    : (
        await getDocs(
          query(
            collection(serverDb, "bookings"),
            where("bookingCode", "==", normalizedBookingId.toUpperCase()),
            limit(1)
          )
        ).catch(() => null)
      )?.docs[0] || null;

  if (!bookingSnapshot) {
    return null;
  }

  const booking = serializeRecord(
    bookingSnapshot.id,
    bookingSnapshot.data() as Record<string, unknown>
  );
  const timeline = Array.isArray(booking.trackingTimeline)
    ? sortBookingTimeline(booking.trackingTimeline as BookingTimelineEvent[])
    : [];
  const workerRide =
    (await getRideDispatchesForBookings([booking.id], false))[0] ||
    booking.workerRide ||
    null;

  return {
    booking: {
      id: booking.id,
      bookingCode: booking.bookingCode,
      status: booking.status,
      serviceName: booking.serviceName || booking.service,
      city: booking.city,
      customerName: booking.customerName,
      assignedWorkerName: booking.assignedWorkerName || booking.workerName,
      workerLiveLocation: booking.workerLiveLocation || null,
      workerRide,
      marketplaceWorkflow: booking.marketplaceWorkflow || null,
    },
    timeline,
    nextActions: [
      "Track ETA and technician status",
      "Open support case if SLA is at risk",
      "Collect completion proof after service",
      "Route revisit or refund if recovery is needed",
    ],
  };
}

export async function buildMarketplaceOperationsDashboard() {
  const [bookings, workers, opsQueue, supportCases] = await Promise.all([
    getRecentCollection("bookings", 160),
    getRecentCollection("workers", 160),
    getRecentCollection("marketplaceOpsQueue", 160),
    getRecentCollection("customerSupportCases", 120),
  ]);

  const activeBookings = bookings.filter((booking) => {
    const status = normalizeUpper(booking.status);
    return status && !["COMPLETED", "CANCELLED"].includes(status);
  });

  return {
    operatingModel: getOperatingModel(),
    summary: {
      bookings: bookings.length,
      activeBookings: activeBookings.length,
      unassigned: opsQueue.filter((item) => normalizeUpper(item.status) === "UNASSIGNED").length,
      assigned: opsQueue.filter((item) => normalizeUpper(item.status) === "ASSIGNED").length,
      supportCases: supportCases.filter(
        (item) => normalizeUpper(item.status) !== "CLOSED"
      ).length,
      activeWorkers: workers.filter((worker) => worker.active !== false).length,
      verifiedWorkers: workers.filter((worker) => worker.verified === true).length,
    },
    lanes: {
      intake: bookings.slice(0, 12),
      providerMatching: opsQueue
        .filter((item) => normalizeUpper(item.queue) === "PROVIDER_MATCHING")
        .slice(0, 12),
      dispatchReady: opsQueue
        .filter((item) => normalizeUpper(item.queue) === "DISPATCH_READY")
        .slice(0, 12),
      recovery: supportCases.slice(0, 12),
    },
  };
}

export async function createMarketplaceRecoveryCase(
  payload: Record<string, unknown>
) {
  const bookingId = normalizeText(payload.bookingId);
  const phone = normalizeText(payload.customerPhone);
  const reason = normalizeText(payload.reason);

  if (!bookingId && !phone) {
    return {
      error: "Booking ID or customer phone is required for support recovery.",
    };
  }

  const recoveryRef = doc(collection(serverDb, "customerSupportCases"));
  const event = createBookingTimelineEvent("TECHNICIAN_PENDING", {
    title: "Support recovery opened",
    description: reason || "Customer support case has been created.",
    actorType: "operations",
  });

  await setDoc(recoveryRef, {
    bookingId: bookingId || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    type: normalizeText(payload.type) || "CUSTOMER_RECOVERY",
    status: "OPEN",
    priority: normalizeUpper(payload.priority) || "MEDIUM",
    reason: reason || "Customer requested support.",
    customerName: normalizeText(payload.customerName),
    customerPhone: phone,
    owner: "customer-experience",
    timeline: [event],
  });

  if (bookingId) {
    await updateDoc(doc(serverDb, "marketplaceOpsQueue", bookingId), {
      queue: "CUSTOMER_RECOVERY",
      status: "SUPPORT_OPEN",
      owner: "customer-experience",
      nextAction: "Call customer, confirm issue, and route revisit/refund if needed.",
      updatedAt: serverTimestamp(),
    }).catch(() => undefined);
  }

  return {
    supportCaseId: recoveryRef.id,
    status: "OPEN",
  };
}
