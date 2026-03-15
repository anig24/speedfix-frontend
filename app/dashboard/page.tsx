"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6 animate-fadeIn">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-orange-300 animate-ping opacity-30"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back 👋</p>

      <div className="bg-gray-100 rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
        <p>No bookings yet.</p>
      </div>
    </div>
  );
}
