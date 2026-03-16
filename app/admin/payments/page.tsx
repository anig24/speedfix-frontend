"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  cityId: string;
  method: string;
  status: string;
  createdAt?: any;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "payments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Payment[];

        setPayments(list);
        setLoading(false);
      },
      (error) => {
        console.error("Payments fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold">Payment Transactions</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Payment ID</th>
              <th>Booking</th>
              <th>Customer</th>
              <th>City</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">{payment.id}</td>
                <td>{payment.bookingId}</td>
                <td>{payment.customerId}</td>
                <td>{payment.cityId}</td>
                <td>{payment.method}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "FAILED"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td>
                  {payment.createdAt?.toDate
                    ? payment.createdAt.toDate().toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && payments.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No payment transactions available.
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-gray-500">
            Loading payments...
          </div>
        )}
      </div>
    </div>
  );
}