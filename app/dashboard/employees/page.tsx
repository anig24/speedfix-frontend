"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    city: "",
  });

  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ name: "", email: "", role: "", city: "" });
    setEditId(null);
  };

  // 🔥 REAL-TIME LIST
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snap) => {
      const data: any[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setEmployees(data);
    });

    return () => unsub();
  }, []);

  // ➕ ADD / UPDATE
  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert("Fill all");

    if (editId) {
      await updateDoc(doc(db, "employees", editId), form);
    } else {
      await addDoc(collection(db, "employees"), {
        ...form,
        createdAt: new Date(),
      });
    }

    resetForm();
  };

  // ✏️ EDIT
  const handleEdit = (emp: any) => {
    const { id, ...formData } = emp;
    setForm(formData);
    setEditId(id);
  };

  // ❌ DELETE
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "employees", id));
  };

  return (
    <div>
      <h2 className="text-2xl mb-6">Employee Management</h2>

      {/* FORM */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="input"
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="input"
        />

        <button onClick={handleSubmit} className="btn col-span-4">
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#020617] rounded-xl overflow-hidden">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="grid grid-cols-5 p-4 border-b border-white/10"
          >
            <span>{emp.name}</span>
            <span>{emp.email}</span>
            <span>{emp.role}</span>
            <span>{emp.city}</span>

            <div className="flex gap-3">
              <button onClick={() => handleEdit(emp)}>Edit</button>
              <button onClick={() => handleDelete(emp.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}