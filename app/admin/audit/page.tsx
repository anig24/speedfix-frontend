"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Audit {
  id: string;
  action: string;
  userId: string;
  createdAt?: any;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<Audit[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "audit_logs"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Audit[];
      setLogs(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Audit Logs</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Action</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-4">{l.action}</td>
                <td>{l.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No audit logs available.
          </div>
        )}
      </div>
    </div>
  );
}