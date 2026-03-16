"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  cityId: string;
  technicianId?: string;
  status: string;
  createdAt?: any;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

        setBookings(list);
        setLoading(false);
      },
      (error) => {
        console.error("Booking fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold">Bookings Management</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Booking ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>City</th>
              <th>Technician</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">{booking.id}</td>
                <td>{booking.customerId}</td>
                <td>{booking.serviceId}</td>
                <td>{booking.cityId}</td>
                <td>{booking.technicianId || "Unassigned"}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : booking.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td>
                  {booking.createdAt?.toDate
                    ? booking.createdAt.toDate().toLocaleString()
                    : "-"}
                </td>

                <td>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={booking.status}
                    onChange={(e) =>
                      updateStatus(booking.id, e.target.value)
                    }
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && bookings.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No bookings available.
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-gray-500">
            Loading bookings...
          </div>
        )}
      </div>

    </div>
  );
}