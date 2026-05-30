"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  Clock3,
  Headset,
  IndianRupee,
  KeyRound,
  LoaderCircle,
  MapPinned,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { formatTrackingTimestamp, getStatusTone } from "@/lib/bookingTracking";
import { readJsonResponse } from "@/lib/readJsonResponse";
import { getRideStatusTone, rideStatusLabels } from "@/lib/rideService";

const WorkerTrackingMap = dynamic(
  () => import("@/app/components/WorkerTrackingMap"),
  { ssr: false }
);

const operatingSteps = [
  { label: "Booking placed", icon: CheckCircle2 },
  { label: "Provider match", icon: Search },
  { label: "ETA and route", icon: Truck },
  { label: "Quality proof", icon: ShieldCheck },
  { label: "Support recovery", icon: Headset },
];

function formatRideStatus(status) {
  return rideStatusLabels[status] || status || "Searching rider";
}

export default function TrackPage() {
  const [bookingId, setBookingId] = useState("");
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const booking = timeline?.booking || null;
  const events = useMemo(() => timeline?.timeline || [], [timeline]);
  const workerRide = booking?.workerRide || null;

  const loadTimeline = useCallback(async (nextBookingId) => {
    const id = nextBookingId.trim();

    if (!id) {
      setMessage("Enter a booking ID to load live tracking.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/marketplace/bookings/${encodeURIComponent(id)}/timeline`
      );
      const result = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(result.error || "Unable to load this booking.");
      }

      setTimeline(result.timeline);
      localStorage.setItem("speedfix_latest_booking_id", id);
    } catch (error) {
      setTimeline(null);
      setMessage(
        error instanceof Error ? error.message : "Unable to load tracking."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("bookingId") || "";
    const fromStorage = localStorage.getItem("speedfix_latest_booking_id") || "";
    const nextBookingId = fromUrl || fromStorage;

    setBookingId(nextBookingId);

    if (nextBookingId) {
      loadTimeline(nextBookingId);
    }
  }, [loadTimeline]);

  return (
    <div className="min-h-screen bg-[#07111f] px-6 py-14 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">
              Live booking command
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              Track service, provider, ETA, and recovery
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300">
              This page now reads from the marketplace backend timeline. It is
              designed for a managed home-service flow: booking, provider
              matching, dispatch, quality proof, and support recovery.
            </p>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={bookingId}
                  onChange={(event) => setBookingId(event.target.value)}
                  placeholder="Enter booking ID"
                  className="min-h-12 flex-1 rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => loadTimeline(bookingId)}
                  disabled={loading}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-70"
                >
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Load tracking
                </button>
              </div>
              {message && (
                <p className="mt-4 rounded-[1.2rem] bg-white/8 px-4 py-3 text-sm text-slate-200">
                  {message}
                </p>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-0 dashboard-grid opacity-10" />
            <div className="relative">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Current booking
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">
                    {booking?.serviceName || "Waiting for booking"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {booking?.bookingCode || bookingId || "No booking loaded"}
                  </p>
                </div>
                {booking?.status && (
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusTone(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                )}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-5">
                {operatingSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.label}
                      className="rounded-[1.35rem] border border-white/10 bg-white/[0.07] p-4"
                      animate={{ y: [0, index % 2 ? 5 : -5, 0] }}
                      transition={{
                        duration: 3.2 + index * 0.18,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon className="h-5 w-5 text-orange-300" />
                      <p className="mt-3 text-xs font-semibold leading-5 text-slate-200">
                        {step.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Provider and ride
                  </p>
                  <div className="mt-5 space-y-4 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-orange-300" />
                      {booking?.assignedWorkerName || "Provider assignment pending"}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinned className="h-4 w-4 text-sky-300" />
                      {booking?.city || "City will appear after booking loads"}
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock3 className="h-4 w-4 text-emerald-300" />
                      {booking?.marketplaceWorkflow?.sla?.arrivalWindow ||
                        "ETA window will appear after matching"}
                    </div>
                    {workerRide && (
                      <>
                        <div className="flex items-center gap-3">
                          <Bike className="h-4 w-4 text-orange-300" />
                          {workerRide.assignedRider?.name || "Bike rider pending"} |{" "}
                          {workerRide.assignedRider?.vehicleNumber || "Vehicle pending"}
                        </div>
                        <div className="flex items-center gap-3">
                          <KeyRound className="h-4 w-4 text-emerald-300" />
                          Pickup OTP {workerRide.pickupOtp || "pending"}
                        </div>
                        <div className="flex items-center gap-3">
                          <IndianRupee className="h-4 w-4 text-sky-300" />
                          Rs. {workerRide.fareEstimate.perKmRate}/km
                          {workerRide.fareEstimate.peakHour
                            ? ` | peak +Rs. ${workerRide.fareEstimate.surgeAmount}`
                            : ""}
                        </div>
                        <span
                          className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${getRideStatusTone(
                            workerRide.status
                          )}`}
                        >
                          {formatRideStatus(workerRide.status)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Timeline
                  </p>
                  <div className="mt-5 space-y-3">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3"
                      >
                        <p className="font-semibold text-white">{event.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {event.description}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {formatTrackingTimestamp(event.at)}
                        </p>
                      </div>
                    ))}
                    {!events.length && (
                      <div className="rounded-[1.2rem] border border-dashed border-white/15 px-4 py-8 text-center text-sm text-slate-400">
                        Load a booking to see the live timeline.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {workerRide && (
                <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/50 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        SpeedFix bike live map
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {workerRide.rideCode} | waiting Rs.{" "}
                        {workerRide.waiting.charge}
                      </p>
                    </div>
                    <span className="rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white">
                      SpeedFix
                    </span>
                  </div>
                  <WorkerTrackingMap
                    customerCoordinates={workerRide.drop?.coordinates || null}
                    pickupCoordinates={workerRide.pickup?.coordinates || null}
                    dropCoordinates={workerRide.drop?.coordinates || null}
                    riderCoordinates={
                      workerRide.riderLiveLocation?.coordinates ||
                      workerRide.assignedRider?.liveCoordinates ||
                      null
                    }
                    riderLabel={workerRide.assignedRider?.name}
                    riderVehicleNumber={workerRide.assignedRider?.vehicleNumber}
                    rideCode={workerRide.rideCode}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
