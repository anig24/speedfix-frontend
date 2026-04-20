"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const roles = [
  "FOUNDER",
  "BUSINESS_HEAD",
  "STATE_CLUSTER_MANAGER",
  "CITY_CLUSTER_MANAGER",
  "HEAD_HR",
  "HR",
  "JR_HR",
  "HR_INTERN",
  "HEAD_ADMIN",
  "ADMIN",
  "HEAD_AUDITOR",
  "AUDITOR",
  "HEAD_ACCOUNTANT",
  "ACCOUNTANT",
  "JR_ACCOUNTANT",
  "TECHNICIAN",
  "CLEANER",
  "MAID",
  "CSA_L1",
  "CSA_L2",
  "CSA_L3",
  "CUSTOMER"
];

export default function FounderUserManagement() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const changeRole = async (uid: string, newRole: string) => {
    await updateDoc(doc(db, "users", uid), {
      role: newRole
    });
  };

  const toggleStatus = async (uid: string, currentStatus: string) => {
    await updateDoc(doc(db, "users", uid), {
      status: currentStatus === "active" ? "suspended" : "active"
    });
  };

  const deleteUser = async (uid: string) => {
    await deleteDoc(doc(db, "users", uid));
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">User & Role Management</h2>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Change Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">

                <td className="p-3">{user.email}</td>

                <td className="p-3 font-semibold">{user.role}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="p-3">
                  <select
                    className="border p-1 rounded"
                    onChange={(e) =>
                      changeRole(user.id, e.target.value)
                    }
                    defaultValue={user.role}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      toggleStatus(user.id, user.status)
                    }
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Toggle Status
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}