"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FounderDepartmentControl() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [newDept, setNewDept] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    const unsubDept = onSnapshot(collection(db, "departments"), (snap) => {
      setDepartments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubDept();
      unsubUsers();
    };
  }, []);

  const createDepartment = async () => {
    if (!newDept) return;

    await addDoc(collection(db, "departments"), {
      departmentName: newDept,
      headUserId: "",
      state: stateName,
      city: cityName,
      status: "active",
      createdAt: serverTimestamp(),
    });

    setNewDept("");
    setStateName("");
    setCityName("");
  };

  const assignHead = async (deptId: string, userId: string) => {
    await updateDoc(doc(db, "departments", deptId), {
      headUserId: userId,
    });
  };

  const toggleStatus = async (deptId: string, currentStatus: string) => {
    await updateDoc(doc(db, "departments", deptId), {
      status: currentStatus === "active" ? "inactive" : "active",
    });
  };

  const deleteDepartment = async (deptId: string) => {
    await deleteDoc(doc(db, "departments", deptId));
  };

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold">Department Control Panel</h2>

      {/* CREATE SECTION */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="font-semibold">Create New Department</h3>

        <input
          type="text"
          placeholder="Department Name"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="State"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="City"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={createDepartment}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Department
        </button>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Head</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => {
              const headUser = users.find(
                (u) => u.id === dept.headUserId
              );

              return (
                <tr key={dept.id} className="border-b">

                  <td className="p-3 font-semibold">
                    {dept.departmentName}
                  </td>

                  <td className="p-3">{dept.state}</td>
                  <td className="p-3">{dept.city}</td>

                  <td className="p-3">
                    <select
                      className="border p-1 rounded"
                      value={dept.headUserId || ""}
                      onChange={(e) =>
                        assignHead(dept.id, e.target.value)
                      }
                    >
                      <option value="">Select Head</option>
                      {users
                        .filter((u) => u.role !== "CUSTOMER")
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.email} ({u.role})
                          </option>
                        ))}
                    </select>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        dept.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() =>
                        toggleStatus(dept.id, dept.status)
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() =>
                        deleteDepartment(dept.id)
                      }
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}