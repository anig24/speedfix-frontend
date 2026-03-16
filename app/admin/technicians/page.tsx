"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Technician {
  id: string;
  name: string;
  phone: string;
  cityId: string;
  status: string;
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "technicians"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Technician[];

        setTechnicians(list);
      }
    );

    return () => unsub();
  }, []);

  const approveTechnician = async (id: string) => {
    await updateDoc(doc(db, "technicians", id), {
      status: "APPROVED",
    });
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Technician Management</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {technicians.map((tech) => (
              <tr key={tech.id} className="border-t">
                <td className="p-4">{tech.name}</td>
                <td>{tech.phone}</td>
                <td>{tech.cityId}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      tech.status === "APPROVED"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {tech.status}
                  </span>
                </td>
                <td>
                  {tech.status !== "APPROVED" && (
                    <button
                      onClick={() => approveTechnician(tech.id)}
                      className="bg-orange-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {technicians.length === 0 && (
          <div className="p-6 text-gray-500 text-center">
            No technicians registered yet.
          </div>
        )}
      </div>

    </div>
  );
}