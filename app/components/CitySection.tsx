"use client";

import Image from "next/image";
import { useState } from "react";
import {
  normalizeCityLabel,
  readStoredCity,
  writeStoredCity,
} from "@/lib/locationStorage";

export default function CitySection({ onSelect }: { onSelect?: () => void }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(
    readStoredCity() || null
  );

  const cities = [
    { name: "Mumbai", image: "/cities/mumbai.png" },
    { name: "Delhi NCR", image: "/cities/delhi.png" },
    { name: "Bengaluru", image: "/cities/bangalore.png" },
    { name: "Kolkata", image: "/cities/kolkata.png" },
    { name: "Chennai", image: "/cities/chennai.png" },
    { name: "Hyderabad", image: "/cities/hyderabad.png" },
    { name: "Pune", image: "/cities/mumbai.png" },
  ];

  const handleSelect = (city: string) => {
    const normalizedCity = normalizeCityLabel(city);
    setSelectedCity(normalizedCity);
    writeStoredCity(normalizedCity);

    onSelect?.();
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
      {cities.map((city) => {
        const isActive = selectedCity === city.name;

        return (
          <button
            key={city.name}
            type="button"
            onClick={() => handleSelect(city.name)}
            className={`group overflow-hidden rounded-[1.35rem] border p-4 text-left transition ${
              isActive
                ? "border-orange-400/50 bg-orange-500/10 shadow-[0_12px_30px_rgba(255,106,0,0.16)]"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            <div className="relative h-20 overflow-hidden rounded-[1rem] border border-white/10 bg-white/10">
              <Image
              src={city.image}
              alt={city.name}
              fill
              sizes="(max-width: 640px) 50vw, 140px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/10 to-transparent" />
            </div>

            <p
              className={`mt-3 text-sm font-semibold ${
                isActive ? "text-orange-300" : "text-white"
              }`}
            >
              {city.name}
            </p>
            <p className="mt-1 text-xs text-white/55">
              {isActive ? "Selected for booking" : "Tap to set active city"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
