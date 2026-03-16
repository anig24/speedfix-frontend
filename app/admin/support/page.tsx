"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Ticket {
  id: string;
  bookingId: string;
  status: string;
  issue: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "support_tickets"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ticket[];
      setTickets(data);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Support Center</h2>

      {tickets.map((t) => (
        <div key={t.id} className="bg-white p-4 rounded-xl shadow mb-4">
          <p className="font-semibold">{t.issue}</p>
          <p className="text-sm text-gray-500">
            Booking: {t.bookingId}
          </p>
          <p className="text-sm">{t.status}</p>
        </div>
      ))}

      {tickets.length === 0 && (
        <div className="text-gray-500">No tickets available.</div>
      )}
    </div>
  );
}