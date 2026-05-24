"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  Bike,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LocateFixed,
  MapPinned,
  Navigation,
  Phone,
  type LucideIcon,
} from "lucide-react";
import {
  getRideStatusTone,
  rideStatusLabels,
  type RideDispatchClient,
} from "@/lib/rideService";

const WorkerTrackingMap = dynamic(
  () => import("@/app/components/WorkerTrackingMap"),
  { ssr: false }
);

type RiderDashboard = {
  rider: {
    riderCode: string;
    phone: string;
  };
  rides: RideDispatchClient[];
};

function formatRideStatus(status?: string | null) {
  return status
    ? rideStatusLabels[status as keyof typeof rideStatusLabels] || status
    : "Searching rider";
}

const rideActions: Array<{
  action: string;
  label: string;
  icon: LucideIcon;
}> = [
  { action: "SHARE_LOCATION", label: "Share location", icon: MapPinned },
  { action: "ARRIVE_PICKUP", label: "Arrived pickup", icon: Bike },
  { action: "VERIFY_PICKUP_OTP", label: "Verify OTP", icon: KeyRound },
  { action: "START_RIDE", label: "Start ride", icon: Navigation },
  { action: "COMPLETE_RIDE", label: "Complete ride", icon: CheckCircle2 },
];

export default function RidersPage() {
  const [access, setAccess] = useState({ riderCode: "", phone: "" });
  const [dashboard, setDashboard] = useState<RiderDashboard | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const activeRide = useMemo(() => {
    return (
      dashboard?.rides.find(
        (ride) => !["DROPPED", "CANCELLED"].includes(ride.status)
      ) ||
      dashboard?.rides[0] ||
      null
    );
  }, [dashboard]);

  async function loadDashboard() {
    setLoading("dashboard");
    setMessage("");

    try {
      const response = await fetch("/api/riders/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(access),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load rider dashboard.");
      }

      setDashboard(result);
      setMessage("Rider dashboard loaded.");
    } catch (error) {
      setDashboard(null);
      setMessage(error instanceof Error ? error.message : "Unable to load rider dashboard.");
    } finally {
      setLoading("");
    }
  }

  function captureLocation() {
    if (!navigator.geolocation) {
      setMessage("Location capture is not available in this browser.");
      return;
    }

    setLoading("location");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
        setMessage("Rider location captured.");
        setLoading("");
      },
      () => {
        setMessage("Location permission was not granted.");
        setLoading("");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
      }
    );
  }

  async function runRideAction(action: string) {
    if (!activeRide) {
      return;
    }

    setLoading(action);
    setMessage("");

    try {
      const response = await fetch(`/api/rides/${activeRide.rideId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          riderCode: access.riderCode,
          phone: access.phone,
          action,
          otp,
          location: {
            label: activeRide.assignedRider?.liveLocationLabel || activeRide.city,
            city: activeRide.city,
            coordinates: location,
          },
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update ride.");
      }

      setDashboard((current) =>
        current
          ? {
              ...current,
              rides: current.rides.map((ride) =>
                ride.rideId === result.ride.rideId ? result.ride : ride
              ),
            }
          : current
      );
      setMessage("Ride status updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update ride.");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="public-shell min-h-screen text-slate-900">
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-[#fff2df] px-4 py-2 text-sm font-semibold text-orange-800">
              <Bike className="h-4 w-4" />
              SpeedFix Rider
            </div>
            <h1 className="mt-5 display-font text-5xl leading-tight text-slate-950">
              Bike rider pickup dashboard
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Assigned riders receive pickup, drop, OTP, live tracking, waiting
              charge, and completion controls in one place.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="grid gap-3">
              <Field
                label="Rider code"
                value={access.riderCode}
                placeholder="SFX-RDR-KOL-1"
                onChange={(value) =>
                  setAccess((current) => ({
                    ...current,
                    riderCode: value.toUpperCase(),
                  }))
                }
              />
              <Field
                label="Phone"
                value={access.phone}
                placeholder="Registered mobile"
                onChange={(value) =>
                  setAccess((current) => ({
                    ...current,
                    phone: value.replace(/\D/g, "").slice(0, 10),
                  }))
                }
              />
            </div>
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading === "dashboard"}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading === "dashboard" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              Open rider dashboard
            </button>
            {message && (
              <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Assigned ride
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {activeRide?.rideCode || "No active ride"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {activeRide
                    ? `${activeRide.passenger.name} | ${activeRide.passenger.phone}`
                    : "Ride details appear after rider login."}
                </p>
              </div>
              {activeRide && (
                <span className={`rounded-full px-3 py-2 text-xs font-semibold ${getRideStatusTone(activeRide.status)}`}>
                  {formatRideStatus(activeRide.status)}
                </span>
              )}
            </div>

            {activeRide && (
              <>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <RideInfo title="Pickup" value={`${activeRide.pickup.label} | ${activeRide.pickup.address}`} />
                  <RideInfo title="Drop" value={`${activeRide.drop.label} | ${activeRide.drop.address}`} />
                  <RideInfo title="Fare" value={`Rs. ${activeRide.finalFare} | Rs. ${activeRide.fareEstimate.perKmRate}/km`} />
                  <RideInfo title="Waiting" value={`Rs. ${activeRide.waiting.charge}`} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Field
                    label="Pickup OTP"
                    value={otp}
                    placeholder="Enter customer OTP"
                    onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 4))}
                  />
                  <button
                    type="button"
                    onClick={captureLocation}
                    disabled={loading === "location"}
                    className="self-end inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-400 disabled:opacity-60"
                  >
                    <LocateFixed className="h-4 w-4" />
                    Location
                  </button>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {rideActions.map(({ action, label, icon: Icon }) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => runRideAction(action)}
                      disabled={loading === action}
                      className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-300 disabled:opacity-60"
                    >
                      <Icon className="h-4 w-4 text-orange-500" />
                      <p className="mt-3 text-sm font-semibold text-slate-950">
                        {label}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <WorkerTrackingMap
              pickupCoordinates={activeRide?.pickup.coordinates || null}
              dropCoordinates={activeRide?.drop.coordinates || null}
              riderCoordinates={
                location ||
                activeRide?.riderLiveLocation?.coordinates ||
                activeRide?.assignedRider?.liveCoordinates ||
                null
              }
              riderLabel={activeRide?.assignedRider?.name}
              riderVehicleNumber={activeRide?.assignedRider?.vehicleNumber}
              rideCode={activeRide?.rideCode}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function RideInfo({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{value}</p>
    </div>
  );
}
