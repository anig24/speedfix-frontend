"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AnalyticsPage() {
  const [allowed, setAllowed] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;

      const role = snap.data().role;

      if (role === "FOUNDER" || role === "BUSINESS_HEAD") {
        setAllowed(true);

        const unsub = onSnapshot(collection(db, "bookings"), (snapshot) => {
          let total = 0;
          snapshot.docs.forEach((doc) => {
            total += doc.data().amount || 0;
          });
          setRevenue(total);
        });

        return () => unsub();
      }

      setAllowed(false);
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (!allowed) {
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-lg">
        Access Denied. Financial data is restricted.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Financial Analytics</h2>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Total Revenue</p>
        <h3 className="text-3xl font-bold mt-2">
          ₹ {revenue.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}