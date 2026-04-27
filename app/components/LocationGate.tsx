"use client";

import { useState } from "react";
import CitySection from "@/app/components/CitySection";
import { writeStoredCity, writeStoredLocation } from "@/lib/locationStorage";

export default function LocationGate({ onClose }: { onClose: () => void }) {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );

        const data = await res.json();
        const city = data.city || data.locality || "Unknown";

        writeStoredLocation(city, {
          latitude,
          longitude,
        });
        onClose();
      } catch {
        alert("Failed to detect location");
      }

      setLoading(false);
    });
  };

  const handlePincode = async () => {
    if (!pincode) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();

      if (data[0].Status === "Success") {
        const city = data[0].PostOffice[0].District;

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
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-20"
      onClick={onClose}
    >
      <div
        className="bg-[#0F172A] w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP */}
        <div className="p-5 border-b border-white/10">

          <h2 className="text-lg text-white font-semibold mb-3 text-center">
            Select Location
          </h2>

          <button
            onClick={detectLocation}
            className="w-full bg-[#FF6A00] text-white py-2.5 rounded mb-3 text-sm"
          >
            {loading ? "Detecting..." : "📍 Use Current Location"}
          </button>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="flex-1 px-3 py-2 rounded text-black text-sm"
            />

            <button
              onClick={handlePincode}
              className="bg-white text-black px-4 rounded text-sm"
            >
              Go
            </button>
          </div>

        </div>

        {/* CITY LIST */}
        <div className="max-h-[300px] overflow-y-auto">
          <CitySection onSelect={onClose} />
        </div>

      </div>
    </div>
  );
}
