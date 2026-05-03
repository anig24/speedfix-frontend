"use client";

import { useState } from "react";
import CitySection from "@/app/components/CitySection";
import {
  detectAndStoreCurrentCity,
  normalizeCityLabel,
  writeStoredCity,
} from "@/lib/locationStorage";

export default function LocationGate({ onClose }: { onClose: () => void }) {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    setLoading(true);

    detectAndStoreCurrentCity()
      .then(() => {
        onClose();
      })
      .catch(() => {
        alert("Failed to detect location");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePincode = async () => {
    if (!pincode) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0].Status === "Success") {
        const city = normalizeCityLabel(data[0].PostOffice[0].District);

        writeStoredCity(city);
        localStorage.setItem("pincode", pincode);
        onClose();
      } else {
        alert("Invalid pincode");
      }
    } catch {
      alert("Error fetching pincode");
    }

    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#0b1528] shadow-[0_30px_80px_rgba(2,10,24,0.48)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-white/10 p-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Location access
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold text-white">
            Set your service city
          </h2>
          <p className="mt-2 text-center text-sm leading-6 text-white/60">
            Allow location access for auto-detection, search by pincode, or
            select a city manually.
          </p>

          <button
            onClick={detectLocation}
            className="pulse-border mt-5 w-full rounded-full bg-[#FF6A00] py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {loading ? "Detecting..." : "Use Current Location"}
          </button>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Enter pincode"
              value={pincode}
              onChange={(event) => setPincode(event.target.value)}
              className="flex-1 rounded-full border border-white/10 bg-white/95 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
            />

            <button
              onClick={handlePincode}
              className="rounded-full bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Go
            </button>
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          <CitySection onSelect={onClose} />
        </div>
      </div>
    </div>
  );
}
