"use client";
import { useState } from "react";

type AddressResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function AddressInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressResult[]>([]);

  const searchAddress = async (value: string) => {
    setQuery(value);

    if (value.length < 3) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${value}&format=json`
    );

    const data = (await res.json()) as AddressResult[];
    setResults(data);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => searchAddress(e.target.value)}
        placeholder="Enter your location"
        className="border p-2 w-full"
      />

      {results.length > 0 && (
        <ul className="border mt-2 bg-white">
          {results.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(item.display_name);
                setResults([]);
                console.log("Lat:", item.lat, "Lng:", item.lon);
              }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
