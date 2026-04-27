"use client";

import { useState } from "react";
import { readStoredCity, writeStoredCity } from "@/lib/locationStorage";

export default function CitySection({ onSelect }: { onSelect?: () => void }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(
    readStoredCity() || null
  );

  const cities = [
    { name: "Mumbai", image: "/cities/mumbai.png" },
    { name: "Delhi", image: "/cities/delhi.png" },
    { name: "Bangalore", image: "/cities/bangalore.png" },
    { name: "Kolkata", image: "/cities/kolkata.png" },
    { name: "Chennai", image: "/cities/chennai.png" },
    { name: "Hyderabad", image: "/cities/hyderabad.png" },
  ];

const handleSelect = (city: string) => {
  setSelectedCity(city);
  writeStoredCity(city);

  if (onSelect) onSelect();

  window.location.reload(); // 
};

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      {cities.map((city) => {
        const isActive = selectedCity === city.name;

        return (
          <div
            key={city.name}
            onClick={() => handleSelect(city.name)}
            className={`cursor-pointer rounded-lg p-4 text-center transition
              ${
                isActive
                  ? "bg-[#FF6A00]/20 border border-[#FF6A00]"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
          >
            <img
              src={city.image}
              alt={city.name}
              className="h-16 mx-auto mb-2 object-contain"
            />

            <p
              className={`text-sm font-medium ${
                isActive ? "text-[#FF6A00]" : "text-white"
              }`}
            >
              {city.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
