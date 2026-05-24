"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bike,
  Clock3,
  IndianRupee,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import {
  estimateRideFare,
  getRideStatusTone,
  rideFarePolicy,
  rideStatusLabels,
  rideWaitingPolicy,
  type RideDispatchClient,
} from "@/lib/rideService";
import { readStoredCity, readStoredCoordinates } from "@/lib/locationStorage";

const WorkerTrackingMap = dynamic(
  () => import("@/app/components/WorkerTrackingMap"),
  { ssr: false }
);

const emptyRideForm = {
  passengerName: "",
  passengerPhone: "",
  city: "",
  pickupLabel: "Current pickup",
  pickupAddress: "",
  dropLabel: "Drop location",
  dropAddress: "",
};

function formatStatus(value?: string | null) {
  if (!value) {
    return "Searching rider";
  }

  return rideStatusLabels[value as keyof typeof rideStatusLabels] || value;
}

export default function RidesPage() {
  const [form, setForm] = useState(emptyRideForm);
  const [pickupCoordinates, setPickupCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [ride, setRide] = useState<RideDispatchClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadRide = useCallback(async (rideId: string) => {
    if (!rideId) {
      return;
    }

    try {
      const response = await fetch(`/api/rides/${encodeURIComponent(rideId)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load ride.");
      }

      setRide(result.ride);
      window.localStorage.setItem("speedfix_latest_ride_id", result.ride.rideId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load ride.");
    }
  }, []);

  useEffect(() => {
    const city = readStoredCity();
    const coordinates = readStoredCoordinates();

    setPickupCoordinates(coordinates);
    setForm((current) => ({
      ...current,
      city: city || current.city || "Kolkata",
    }));

    const params = new URLSearchParams(window.location.search);
    const rideId =
      params.get("rideId") ||
      window.localStorage.getItem("speedfix_latest_ride_id") ||
      "";

    if (rideId) {
      loadRide(rideId);
    }
  }, [loadRide]);

  const previewFare = useMemo(() => {
    return estimateRideFare(pickupCoordinates, null);
  }, [pickupCoordinates]);

  useEffect(() => {
    if (!ride?.rideId) {
      return;
    }

    const interval = window.setInterval(() => {
      loadRide(ride.rideId);
    }, 12000);

    return () => window.clearInterval(interval);
  }, [loadRide, ride?.rideId]);

  function updateForm(field: keyof typeof emptyRideForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function capturePickup() {
    if (!navigator.geolocation) {
      setMessage("Location capture is not available in this browser.");
      return;
    }

    setMessage("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickupCoordinates({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
        setMessage("Pickup location captured.");
      },
      () => setMessage("Location permission was not granted."),
      {
        enableHighAccuracy: true,
        timeout: 12000,
      }
    );
  }

  async function requestRide() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passengerName: form.passengerName,
          passengerPhone: form.passengerPhone,
          city: form.city,
          pickup: {
            label: form.pickupLabel,
            address: form.pickupAddress,
            city: form.city,
            coordinates: pickupCoordinates,
          },
          drop: {
            label: form.dropLabel,
            address: form.dropAddress,
            city: form.city,
          },
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to request ride.");
      }

      setRide(result.ride);
      window.localStorage.setItem("speedfix_latest_ride_id", result.ride.rideId);
      setMessage("Bike ride requested.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to request ride.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="public-shell min-h-screen text-slate-900">
      <section className="border-b border-slate-200/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-[#fff2df] px-4 py-2 text-sm font-semibold text-orange-800">
              <Bike className="h-4 w-4" />
              SpeedFix Bike
            </div>
            <h1 className="mt-5 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
              Bike rides for customers and field teams
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Per-kilometer pricing, peak-hour surge, OTP pickup, live rider
              tracking, and waiting charges after the first 3 minutes.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <FareTile
                icon={<IndianRupee className="h-5 w-5" />}
                label="Rate"
                value={`Rs. ${rideFarePolicy.perKmRate}/km`}
              />
              <FareTile
                icon={<Clock3 className="h-5 w-5" />}
                label="Peak"
                value={`${rideFarePolicy.peakMultiplier}x`}
              />
              <FareTile
                icon={<ShieldCheck className="h-5 w-5" />}
                label="OTP"
                value="Required"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Name"
                value={form.passengerName}
                onChange={(value) => updateForm("passengerName", value)}
                placeholder="Passenger name"
              />
              <Field
                label="Phone"
                value={form.passengerPhone}
                onChange={(value) =>
                  updateForm("passengerPhone", value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile"
              />
              <Field
                label="City"
                value={form.city}
                onChange={(value) => updateForm("city", value)}
                placeholder="Kolkata"
              />
              <Field
                label="Pickup"
                value={form.pickupAddress}
                onChange={(value) => updateForm("pickupAddress", value)}
                placeholder="Flat, street, pickup point"
              />
              <Field
                label="Drop"
                value={form.dropAddress}
                onChange={(value) => updateForm("dropAddress", value)}
                placeholder="Drop address"
              />
              <Field
                label="Drop label"
                value={form.dropLabel}
                onChange={(value) => updateForm("dropLabel", value)}
                placeholder="Office, home, station"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
              <button
                type="button"
                onClick={capturePickup}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                <LocateFixed className="h-4 w-4" />
                Capture pickup
              </button>
              <div className="rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Estimate: Rs. {previewFare.estimatedFare} | Rs.{" "}
                {previewFare.perKmRate}/km
                {previewFare.peakHour ? ` | Peak +Rs. ${previewFare.surgeAmount}` : ""}
              </div>
            </div>

            <button
              type="button"
              onClick={requestRide}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              Request bike ride
            </button>

            {message && (
              <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {message}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Current ride
            </p>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {ride?.rideCode || "No ride requested"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {ride?.assignedRider?.name || "Rider assignment will appear here"}
                </p>
              </div>
              {ride?.status && (
                <span className={`rounded-full px-3 py-2 text-xs font-semibold ${getRideStatusTone(ride.status)}`}>
                  {formatStatus(ride.status)}
                </span>
              )}
            </div>

            {ride && (
              <div className="mt-5 grid gap-3 text-sm text-slate-700">
                <InfoLine label="Vehicle" value={ride.assignedRider?.vehicleNumber || "Pending"} />
                <InfoLine label="Pickup OTP" value={ride.pickupOtp || "Hidden"} />
                <InfoLine label="Distance fare" value={`Rs. ${ride.fareEstimate.distanceFare} (${ride.fareEstimate.distanceKm} km)`} />
                <InfoLine label="Peak surge" value={ride.fareEstimate.peakHour ? `Rs. ${ride.fareEstimate.surgeAmount}` : "Not active"} />
                <InfoLine label="Waiting charge" value={`Rs. ${ride.waiting.charge}`} />
                <InfoLine label="Final estimate" value={`Rs. ${ride.finalFare}`} />
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Pricing policy
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <InfoLine dark label="Base fare" value={`Rs. ${rideFarePolicy.baseFare}`} />
              <InfoLine dark label="Distance rate" value={`Rs. ${rideFarePolicy.perKmRate}/km`} />
              <InfoLine dark label="Peak windows" value="8-11 AM, 5-9 PM" />
              <InfoLine dark label="Waiting" value={`${rideWaitingPolicy.freeMinutes} min free, then Rs. ${rideWaitingPolicy.chargePerExtraMinute}/min`} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
            <div>
              <p className="text-sm font-semibold text-slate-950">Live tracking</p>
              <p className="mt-1 text-sm text-slate-500">
                SpeedFix bike marker appears with the company banner.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold text-orange-800">
              <MapPin className="h-4 w-4" />
              {ride?.city || form.city || "Kolkata"}
            </span>
          </div>

          <WorkerTrackingMap
            pickupCoordinates={ride?.pickup.coordinates || pickupCoordinates}
            dropCoordinates={ride?.drop.coordinates || null}
            riderCoordinates={
              ride?.riderLiveLocation?.coordinates ||
              ride?.assignedRider?.liveCoordinates ||
              null
            }
            riderLabel={ride?.assignedRider?.name}
            riderVehicleNumber={ride?.assignedRider?.vehicleNumber}
            rideCode={ride?.rideCode}
          />
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

function FareTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2 text-orange-600">{icon}</div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function InfoLine({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={dark ? "text-slate-400" : "text-slate-500"}>{label}</span>
      <span className={dark ? "font-semibold text-white" : "font-semibold text-slate-950"}>
        {value}
      </span>
    </div>
  );
}
