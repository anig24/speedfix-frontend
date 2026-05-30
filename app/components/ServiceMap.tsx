"use client";

import { LocateFixed, Satellite } from "lucide-react";
import { useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type ServiceMapProps = {
  coordinates: Coordinates | null;
  setCoordinates: (coordinates: Coordinates) => void;
};

function googleMapUrl(coordinates: Coordinates | null, satellite: boolean) {
  const mode = satellite ? "&t=k" : "";

  if (!coordinates) {
    return `https://www.google.com/maps?q=India&z=5&output=embed${mode}`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(
    `${coordinates.lat},${coordinates.lng}`
  )}&z=15&output=embed${mode}`;
}

export default function ServiceMap({
  coordinates,
  setCoordinates,
}: ServiceMapProps) {
  const [satellite, setSatellite] = useState(false);

  function useCurrentLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({
        lat: Number(position.coords.latitude.toFixed(6)),
        lng: Number(position.coords.longitude.toFixed(6)),
      });
    });
  }

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100">
      <iframe
        key={googleMapUrl(coordinates, satellite)}
        title="SpeedFix Google service map"
        src={googleMapUrl(coordinates, satellite)}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useCurrentLocation}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80"
        >
          <LocateFixed className="h-4 w-4 text-orange-600" />
          Auto detect
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
