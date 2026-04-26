export type BookingTimelineKey =
  | "BOOKED"
  | "PAYMENT_CONFIRMED"
  | "PAY_LATER_SELECTED"
  | "TECHNICIAN_PENDING"
  | "TECHNICIAN_ASSIGNED"
  | "LOCATION_SHARED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type BookingTimelineEvent = {
  id: string;
  key: BookingTimelineKey;
  title: string;
  description: string;
  status: string;
  at: string;
  actorType?: "system" | "technician" | "operations" | "customer";
  actorName?: string | null;
  locationLabel?: string | null;
};

type EventOverrides = Partial<
  Omit<BookingTimelineEvent, "id" | "key" | "title" | "description" | "status" | "at">
> & {
  title?: string;
  description?: string;
  status?: string;
  at?: string;
};

const eventPresets: Record<
  BookingTimelineKey,
  { title: string; description: string; status: string }
> = {
  BOOKED: {
    title: "Booking placed",
    description: "Your service request has been created successfully.",
    status: "PENDING",
  },
  PAYMENT_CONFIRMED: {
    title: "Payment confirmed",
    description: "Your online payment has been verified.",
    status: "CONFIRMED",
  },
  PAY_LATER_SELECTED: {
    title: "Pay after service selected",
    description: "You chose to pay after the technician visit.",
    status: "PENDING",
  },
  TECHNICIAN_PENDING: {
    title: "Waiting for technician",
    description: "We are assigning the best available technician for this booking.",
    status: "PENDING",
  },
  TECHNICIAN_ASSIGNED: {
    title: "Technician assigned",
    description: "A technician has been assigned to your booking.",
    status: "CONFIRMED",
  },
  LOCATION_SHARED: {
    title: "Live location updated",
    description: "The technician has shared the latest live location.",
    status: "ON_THE_WAY",
  },
  ON_THE_WAY: {
    title: "Technician is on the way",
    description: "Your technician has started traveling to the service location.",
    status: "ON_THE_WAY",
  },
  ARRIVED: {
    title: "Technician arrived",
    description: "The assigned technician has reached the destination.",
    status: "ARRIVED",
  },
  IN_PROGRESS: {
    title: "Service in progress",
    description: "The technician is actively working on the service.",
    status: "IN_PROGRESS",
  },
  COMPLETED: {
    title: "Service completed",
    description: "The booking has been completed successfully.",
    status: "COMPLETED",
  },
  CANCELLED: {
    title: "Booking cancelled",
    description: "This booking has been cancelled.",
    status: "CANCELLED",
  },
};

export const customerTrackingSteps = [
  { key: "PENDING", label: "Booked" },
  { key: "CONFIRMED", label: "Assigned" },
  { key: "ON_THE_WAY", label: "On the way" },
  { key: "ARRIVED", label: "Arrived" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "COMPLETED", label: "Completed" },
] as const;

function createEventId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `evt_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

export function createBookingTimelineEvent(
  key: BookingTimelineKey,
  overrides: EventOverrides = {}
): BookingTimelineEvent {
  const preset = eventPresets[key];

  return {
    id: createEventId(),
    key,
    title: overrides.title || preset.title,
    description: overrides.description || preset.description,
    status: overrides.status || preset.status,
    at: overrides.at || new Date().toISOString(),
    actorType: overrides.actorType,
    actorName: overrides.actorName ?? null,
    locationLabel: overrides.locationLabel ?? null,
  };
}

export function sortBookingTimeline(events: BookingTimelineEvent[] = []) {
  return [...events].sort((a, b) => {
    return new Date(a.at).getTime() - new Date(b.at).getTime();
  });
}

export function getTrackingStepIndex(status: string) {
  const normalized = status.toUpperCase();
  const index = customerTrackingSteps.findIndex((step) => step.key === normalized);

  if (index >= 0) {
    return index;
  }

  if (normalized === "CANCELLED") {
    return 0;
  }

  return 0;
}

export function formatTrackingTimestamp(value?: string | null) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getStatusTone(status?: string | null) {
  const normalized = (status || "").toUpperCase();

  if (normalized === "COMPLETED") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized === "CANCELLED") {
    return "bg-rose-100 text-rose-700";
  }

  if (normalized === "IN_PROGRESS" || normalized === "ON_THE_WAY" || normalized === "ARRIVED") {
    return "bg-blue-100 text-blue-700";
  }

  if (normalized === "CONFIRMED") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-slate-100 text-slate-700";
}
