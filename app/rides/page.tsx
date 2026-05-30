"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bike,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Navigation,
  Search,
  X,
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

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationSuggestion = {
  id: string;
  label: string;
  address: string;
  coordinates: Coordinates;
};

type NominatimResult = {
  place_id?: number;
  display_name?: string;
  name?: string;
  lat?: string;
  lon?: string;
};

type GoogleGeocodeResult = {
  place_id?: string;
  formatted_address?: string;
  address_components?: Array<{
    long_name?: string;
    types?: string[];
  }>;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
};

const googleMapsApiKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  "";

function formatStatus(value?: string | null) {
  if (!value) {
    return "Searching rider";
  }

  return rideStatusLabels[value as keyof typeof rideStatusLabels] || value;
}

function parseCoordinate(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function compactAddress(value: string) {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.slice(0, 4).join(", ");
}

function googlePlaceLabel(item: GoogleGeocodeResult) {
  const landmark = item.address_components?.find((component) =>
    component.types?.some((type) =>
      ["premise", "point_of_interest", "establishment", "route"].includes(type)
    )
  );

  return landmark?.long_name || compactAddress(item.formatted_address || "");
}

async function searchMapLocations(query: string, city: string) {
  const searchText = [query, city, "India"].filter(Boolean).join(", ");

  if (googleMapsApiKey) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        searchText
      )}&region=in&key=${encodeURIComponent(googleMapsApiKey)}`
    );
    const payload = (await response.json().catch(() => ({}))) as {
      results?: GoogleGeocodeResult[];
    };
    const googleResults = (payload.results || [])
      .map((item) => {
        const latitude = item.geometry?.location?.lat;
        const longitude = item.geometry?.location?.lng;
        const address = item.formatted_address || "";

        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number" ||
          !address
        ) {
          return null;
        }

        return {
          id: item.place_id || `${latitude}-${longitude}`,
          label: googlePlaceLabel(item),
          address: compactAddress(address),
          coordinates: { latitude, longitude },
        };
      })
      .filter((item): item is LocationSuggestion => Boolean(item));

    if (googleResults.length) {
      return googleResults;
    }
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=in&q=${encodeURIComponent(searchText)}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  const data = (await response.json().catch(() => [])) as NominatimResult[];

  return data
    .map((item) => {
      const latitude = parseCoordinate(item.lat);
      const longitude = parseCoordinate(item.lon);
      const address = item.display_name || "";

      if (latitude === null || longitude === null || !address) {
        return null;
      }

      return {
        id: String(item.place_id || `${latitude}-${longitude}`),
        label: item.name || compactAddress(address),
        address: compactAddress(address),
        coordinates: { latitude, longitude },
      };
    })
    .filter((item): item is LocationSuggestion => Boolean(item));
}

export default function RidesPage() {
  const [form, setForm] = useState(emptyRideForm);
  const [pickupCoordinates, setPickupCoordinates] = useState<Coordinates | null>(null);
  const [dropCoordinates, setDropCoordinates] = useState<Coordinates | null>(null);
  const [ride, setRide] = useState<RideDispatchClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

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
    return estimateRideFare(pickupCoordinates, dropCoordinates);
  }, [dropCoordinates, pickupCoordinates]);

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
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        };
        setPickupCoordinates(coordinates);
        setForm((current) => ({
          ...current,
          pickupLabel: "Current location",
          pickupAddress:
            current.pickupAddress ||
            `Current location (${coordinates.latitude}, ${coordinates.longitude})`,
        }));
        setMessage("Pickup location auto-detected.");
        setDetectingLocation(false);
      },
      () => {
        setMessage("Location permission was not granted.");
        setDetectingLocation(false);
      },
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
            coordinates: dropCoordinates,
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
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-700">
              <Bike className="h-4 w-4" />
              SpeedFix Mobility
            </div>
            <h1 className="mt-5 text-5xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Premium bike pickup, mapped in real time.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Search pickup and drop points, use your current location, and
              watch the ride route on a clear street map.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
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
              <div className="sm:col-span-2">
                <LocationSearchField
                  label="Pickup location"
                  value={form.pickupAddress}
                  placeholder="Search pickup address or landmark"
                  onChange={(value) => updateForm("pickupAddress", value)}
                  onSelect={(suggestion) => {
                    updateForm("pickupAddress", suggestion.address);
                    updateForm("pickupLabel", suggestion.label);
                    setPickupCoordinates(suggestion.coordinates);
                  }}
                  onPreview={(suggestion) => {
                    updateForm("pickupLabel", suggestion.label);
                    setPickupCoordinates(suggestion.coordinates);
                  }}
                  city={form.city}
                  tone="pickup"
                />
              </div>
              <div className="sm:col-span-2">
                <LocationSearchField
                  label="Drop location"
                  value={form.dropAddress}
                  placeholder="Search drop address or landmark"
                  onChange={(value) => updateForm("dropAddress", value)}
                  onSelect={(suggestion) => {
                    updateForm("dropAddress", suggestion.address);
                    updateForm("dropLabel", suggestion.label);
                    setDropCoordinates(suggestion.coordinates);
                  }}
                  onPreview={(suggestion) => {
                    updateForm("dropLabel", suggestion.label);
                    setDropCoordinates(suggestion.coordinates);
                  }}
                  city={form.city}
                  tone="drop"
                />
              </div>
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
                {detectingLocation ? "Detecting..." : "Use current location"}
              </button>
              <div className="rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Estimate: Rs. {previewFare.estimatedFare} | Rs.{" "}
                {previewFare.perKmRate}/km
                {previewFare.distanceKm ? ` | ${previewFare.distanceKm} km` : ""}
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

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
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
            dropCoordinates={ride?.drop.coordinates || dropCoordinates}
            pickupAddress={ride?.pickup.address || form.pickupAddress}
            dropAddress={ride?.drop.address || form.dropAddress}
            riderCoordinates={
              ride?.riderLiveLocation?.coordinates ||
              ride?.assignedRider?.liveCoordinates ||
              null
            }
            riderLabel={ride?.assignedRider?.name}
            riderVehicleNumber={ride?.assignedRider?.vehicleNumber}
            rideCode={ride?.rideCode}
            fallbackLocationLabel={`${ride?.city || form.city || "Bengaluru"}, India`}
            onAutoDetect={(coordinates) => {
              setPickupCoordinates(coordinates);
              setForm((current) => ({
                ...current,
                pickupLabel: "Current location",
                pickupAddress:
                  current.pickupAddress ||
                  `Current location (${coordinates.latitude}, ${coordinates.longitude})`,
              }));
            }}
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

function LocationSearchField({
  label,
  value,
  placeholder,
  onChange,
  onSelect,
  onPreview,
  city,
  tone,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: LocationSuggestion) => void;
  onPreview?: (suggestion: LocationSuggestion) => void;
  city: string;
  tone: "pickup" | "drop";
}) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const onPreviewRef = useRef(onPreview);

  useEffect(() => {
    onPreviewRef.current = onPreview;
  }, [onPreview]);

  useEffect(() => {
    const query = value.trim();

    if (query.length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setSearching(true);

      try {
        const nextSuggestions = await searchMapLocations(query, city);

        if (cancelled) return;

        setSuggestions(nextSuggestions);
        if (nextSuggestions[0]) {
          onPreviewRef.current?.(nextSuggestions[0]);
        }
        setOpen(true);
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [city, value]);

  return (
    <div className="relative">
      <label className="block">
        <span className="text-sm font-semibold text-slate-900">{label}</span>
        <div className="relative mt-2">
          <span
            className={`absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${
              tone === "pickup" ? "bg-sky-500" : "bg-emerald-500"
            }`}
          />
          <Search className="absolute left-9 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-16 pr-11 text-sm font-semibold text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setSuggestions([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label={`Clear ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </label>

      {open && (searching || suggestions.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-[500] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          {searching && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Searching map...
            </div>
          )}
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => {
                onSelect(suggestion);
                setOpen(false);
              }}
              className="block w-full border-t border-slate-100 px-4 py-3 text-left transition first:border-t-0 hover:bg-slate-50"
            >
              <p className="text-sm font-extrabold text-slate-950">
                {suggestion.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {suggestion.address}
              </p>
            </button>
          ))}
        </div>
      )}
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
