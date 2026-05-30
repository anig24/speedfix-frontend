"use client";

import { LocateFixed, Satellite } from "lucide-react";
import { useState } from "react";
import { type Coordinates } from "@/lib/liveTracking";

type WorkerTrackingMapProps = {
  customerCoordinates?: Coordinates | null;
  workerCoordinates?: Coordinates | null;
  workerLabel?: string | null;
  pickupCoordinates?: Coordinates | null;
  dropCoordinates?: Coordinates | null;
  pickupAddress?: string | null;
  dropAddress?: string | null;
  riderCoordinates?: Coordinates | null;
  riderLabel?: string | null;
  riderVehicleNumber?: string | null;
  rideCode?: string | null;
  fallbackLocationLabel?: string | null;
  onAutoDetect?: (coordinates: Coordinates) => void;
};

function coordinateText(coordinates: Coordinates) {
  return `${coordinates.latitude},${coordinates.longitude}`;
}

function googleMapUrl(input: {
  pickupCoordinates?: Coordinates | null;
  dropCoordinates?: Coordinates | null;
  pickupAddress?: string | null;
  dropAddress?: string | null;
  riderCoordinates?: Coordinates | null;
  workerCoordinates?: Coordinates | null;
  customerCoordinates?: Coordinates | null;
  detectedCoordinates?: Coordinates | null;
  fallbackLocationLabel?: string | null;
  satellite?: boolean;
}) {
  const {
    pickupCoordinates,
    dropCoordinates,
    pickupAddress,
    dropAddress,
    riderCoordinates,
    workerCoordinates,
    customerCoordinates,
    detectedCoordinates,
    fallbackLocationLabel,
    satellite = false,
  } = input;
  const mode = satellite ? "&t=k" : "";
  const cleanPickupAddress = pickupAddress?.trim();
  const cleanDropAddress = dropAddress?.trim();

  if (pickupCoordinates && dropCoordinates) {
    return `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(
      coordinateText(pickupCoordinates)
    )}&daddr=${encodeURIComponent(
      coordinateText(dropCoordinates)
    )}&travelmode=driving${mode}`;
  }

  if (cleanPickupAddress && cleanDropAddress) {
    return `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(
      cleanPickupAddress
    )}&daddr=${encodeURIComponent(cleanDropAddress)}&travelmode=driving${mode}`;
  }

  const addressFocus = cleanPickupAddress || cleanDropAddress;

  if (addressFocus) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      addressFocus
    )}&z=15&output=embed${mode}`;
  }

  const focus =
    riderCoordinates ||
    workerCoordinates ||
    pickupCoordinates ||
    detectedCoordinates ||
    customerCoordinates ||
    dropCoordinates;

  if (focus) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      coordinateText(focus)
    )}&z=15&output=embed${mode}`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(
    fallbackLocationLabel || "Bengaluru, India"
  )}&z=12&output=embed${mode}`;
}

export default function WorkerTrackingMap({
  customerCoordinates,
  workerCoordinates,
  pickupCoordinates,
  dropCoordinates,
  pickupAddress,
  dropAddress,
  riderCoordinates,
  fallbackLocationLabel,
  onAutoDetect,
}: WorkerTrackingMapProps) {
  const [satellite, setSatellite] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectedCoordinates, setDetectedCoordinates] = useState<Coordinates | null>(null);
  const mapUrl = googleMapUrl({
    pickupCoordinates,
    dropCoordinates,
    pickupAddress,
    dropAddress,
    riderCoordinates,
    workerCoordinates,
    customerCoordinates,
    detectedCoordinates,
    fallbackLocationLabel,
    satellite,
  });

  function autoDetectLocation() {
    if (!navigator.geolocation) return;

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        };
        setDetectedCoordinates(coordinates);
        onAutoDetect?.(coordinates);
        setDetecting(false);
      },
      () => setDetecting(false),
      {
        enableHighAccuracy: true,
        timeout: 12000,
      }
    );
  }

  return (
    <div className="relative h-[420px] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100 shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
      <iframe
        key={mapUrl}
        title="SpeedFix Google Map"
        src={mapUrl}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={autoDetectLocation}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80"
        >
          <LocateFixed className="h-4 w-4 text-orange-600" />
          {detecting ? "Detecting" : "Auto detect"}
        </button>
        <button
          type="button"
          onClick={() => setSatellite((current) => !current)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-extrabold shadow-[0_14px_34px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 ${
            satellite ? "bg-slate-950 text-white" : "bg-white text-slate-950"
          }`}
        >
          <Satellite className="h-4 w-4 text-orange-500" />
          Satellite
        </button>
      </div>
    </div>
  );
}
