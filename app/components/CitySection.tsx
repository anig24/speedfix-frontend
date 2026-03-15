"use client";

import { useEffect, useState } from "react";

export default function CitySection() {
  const [detectedCity, setDetectedCity] = useState("Detecting...");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.state ||
            "Your City";

          setDetectedCity(city);
        } catch {
          setDetectedCity("Location unavailable");
        }
      });
    } else {
      setDetectedCity("Geolocation not supported");
    }
  }, []);

  const cities = [
    { name: "Mumbai", image: "/cities/mumbai.png" },
    { name: "Delhi", image: "/cities/delhi.png" },
    { name: "bangalore", image: "/cities/bangalore.png" },
    { name: "Kolkata", image: "/cities/kolkata.png" },
    { name: "Chennai", image: "/cities/chennai.png" },
    { name: "hyderabad", image: "/cities/hyderabad.png" },
  ];

  return (

<section className="py-32 bg-gradient-to-b from-white to-gray-50">
    <div className="max-w-7xl mx-auto px-6">

      <h2 className="text-4xl font-bold text-[#0B1F3B] mb-6">
        Available in Top Cities
      </h2>

      <p className="text-gray-600 mb-16">
        📍 Delivering services in{" "}
        <span className="font-semibold text-orange-500">
          {detectedCity}
        </span>
      </p>

      <div className="grid md:grid-cols-3 gap-y-20 gap-x-16 items-end">

  {cities.map((city) => {
    const isActive = selectedCity === city.name;

    return (
      <div
        key={city.name}
        onClick={() => setSelectedCity(city.name)}
        className={`text-center cursor-pointer transition-all duration-300 rounded-2xl p-6
${isActive ? "bg-orange-50 border-2 border-orange-500 scale-105" : "hover:bg-orange-50"}`}
      >
        <img
          src={city.image}
          alt={city.name}
          className={`mx-auto h-52 object-contain transition duration-300 
          `}
        />

        <h3
          className={`mt-6 text-xl font-semibold transition 
          ${isActive ? "text-orange-600" : "text-[#0B1F3B]"}`}
        >
          {city.name}
        </h3>
      </div>
    );
  })}

</div>

    </div>
  </section>
);
}