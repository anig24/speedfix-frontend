"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface City {
  id: string;
  name: string;
  state: string;
  pincodes: string[];
  isActive: boolean;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [stateName, setStateName] = useState("");

  const [allPincodes, setAllPincodes] = useState<string[]>([]);
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([]);
  const [searchPin, setSearchPin] = useState("");

  const [page, setPage] = useState(1);
  const PIN_PER_PAGE = 10;

  /* ------------------ Real-time Listener ------------------ */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cities"), (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as City[];

      setCities(list);
    });

    return () => unsub();
  }, []);

  /* ------------------ CITY AUTO DETECT ------------------ */
  useEffect(() => {
    if (cityInput.length < 3) return;

    const delay = setTimeout(async () => {
      const res = await fetch(`/api/pincode?city=${cityInput}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const offices = data[0].PostOffice;

        const uniquePins = [
          ...new Set(offices.map((po: any) => po.Pincode)),
        ];

        setStateName(offices[0].State);
        setAllPincodes(uniquePins);
        setSelectedPincodes([]);
        setPage(1);
      }
    }, 600);

    return () => clearTimeout(delay);
  }, [cityInput]);

  /* ------------------ PINCODE AUTO DETECT ------------------ */
  useEffect(() => {
    if (pincodeInput.length !== 6) return;

    const delay = setTimeout(async () => {
      const res = await fetch(`/api/pincode?pincode=${pincodeInput}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const offices = data[0].PostOffice;

        const uniquePins = [
          ...new Set(offices.map((po: any) => po.Pincode)),
        ];

        setCityInput(offices[0].District);
        setStateName(offices[0].State);
        setAllPincodes(uniquePins);
        setSelectedPincodes([]);
        setPage(1);
      }
    }, 600);

    return () => clearTimeout(delay);
  }, [pincodeInput]);

  /* ------------------ Pagination Logic ------------------ */
  const filteredPins = allPincodes.filter((pin) =>
    pin.includes(searchPin)
  );

  const totalPages = Math.ceil(filteredPins.length / PIN_PER_PAGE);

  const paginatedPins = filteredPins.slice(
    (page - 1) * PIN_PER_PAGE,
    page * PIN_PER_PAGE
  );

  /* ------------------ Selection Logic ------------------ */
  const togglePin = (pin: string) => {
    if (selectedPincodes.includes(pin)) {
      setSelectedPincodes(
        selectedPincodes.filter((p) => p !== pin)
      );
    } else {
      setSelectedPincodes([...selectedPincodes, pin]);
    }
  };

  const checkAllCurrentPage = () => {
    const newSelected = [
      ...new Set([...selectedPincodes, ...paginatedPins]),
    ];
    setSelectedPincodes(newSelected);
  };

  const uncheckAllCurrentPage = () => {
    const remaining = selectedPincodes.filter(
      (pin) => !paginatedPins.includes(pin)
    );
    setSelectedPincodes(remaining);
  };

  /* ------------------ Add City ------------------ */
  const handleAddCity = async () => {
    if (!cityInput || !stateName) return;

    await addDoc(collection(db, "cities"), {
      name: cityInput,
      state: stateName,
      pincodes: selectedPincodes,
      isActive: true,
      createdAt: serverTimestamp(),
    });

    setCityInput("");
    setPincodeInput("");
    setStateName("");
    setAllPincodes([]);
    setSelectedPincodes([]);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-8">

      <h2 className="text-2xl font-bold">
        Cities Management
      </h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Enter City"
            className="border px-4 py-2 rounded-lg"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Pincode"
            className="border px-4 py-2 rounded-lg"
            value={pincodeInput}
            onChange={(e) => setPincodeInput(e.target.value)}
          />

          <input
            type="text"
            value={stateName}
            readOnly
            className="border px-4 py-2 rounded-lg bg-gray-100"
          />
        </div>

        {/* Pincode Section */}
        {allPincodes.length > 0 && (
          <div className="space-y-4">

            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search pincode..."
                className="border px-3 py-1 rounded text-sm w-64"
                value={searchPin}
                onChange={(e) => {
                  setSearchPin(e.target.value);
                  setPage(1);
                }}
              />

              <button
                onClick={checkAllCurrentPage}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded"
              >
                Check All
              </button>

              <button
                onClick={uncheckAllCurrentPage}
                className="text-xs bg-red-600 text-white px-3 py-1 rounded"
              >
                Uncheck All
              </button>
            </div>

            <div className="border rounded-lg p-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              {paginatedPins.map((pin) => (
                <label
                  key={pin}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPincodes.includes(pin)}
                    onChange={() => togglePin(pin)}
                  />
                  {pin}
                </label>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center text-sm">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        )}

        <button
          onClick={handleAddCity}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Add City
        </button>

      </div>
    </div>
  );
}