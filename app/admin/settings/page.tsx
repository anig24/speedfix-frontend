"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setRole(snap.data().role);
      }
    };

    fetchRole();
  }, []);

  if (!role) {
    return <div className="p-8">Loading...</div>;
  }

  if (role !== "FOUNDER") {
    return (
      <div className="p-8 bg-yellow-100 text-yellow-700 rounded-lg">
        Only Founder has access to system-level configuration.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings (Founder Only)</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <div>
          <label className="block text-sm font-medium mb-2">
            Platform Email
          </label>
          <input
            type="email"
            className="border px-4 py-2 rounded-lg w-full"
            defaultValue="founder@speedfix.co.in"
          />
        </div>

        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg">
          Update System Configuration
        </button>

      </div>
    </div>
  );
}