"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [techniciansCount, setTechniciansCount] = useState(0);
  const [citiesCount, setCitiesCount] = useState(0);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsersCount(snap.size);
    });

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snap) => {
      setBookingsCount(snap.size);
    });

    const unsubTechnicians = onSnapshot(collection(db, "technicians"), (snap) => {
      setTechniciansCount(snap.size);
    });

    const unsubCities = onSnapshot(collection(db, "cities"), (snap) => {
      setCitiesCount(snap.size);
    });

    return () => {
      unsubUsers();
      unsubBookings();
      unsubTechnicians();
      unsubCities();
    };
  }, []);

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold">Company Overview</h2>

      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total Users" value={usersCount} />
        <Card title="Total Bookings" value={bookingsCount} />
        <Card title="Total Technicians" value={techniciansCount} />
        <Card title="Active Cities" value={citiesCount} />
      </div>

    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}