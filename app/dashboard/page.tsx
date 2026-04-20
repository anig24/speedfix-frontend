"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { getUserRole } from "@/lib/getUserRole";
import StatsCard from "./components/StatsCard";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    employees: 0,
    jobs: 0,
    revenue: 0,
    cities: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getUserRole(user.uid);
      setUserData(data);

      // 🔥 USERS COUNT
      const usersSnap = await getDocs(collection(db, "users"));

      // 🔥 BOOKINGS
      const bookingSnap = await getDocs(collection(db, "bookings"));

      let totalRevenue = 0;
      let cities = new Set();

      bookingSnap.forEach((doc) => {
        const b = doc.data();

        totalRevenue += b.amount || 0;
        if (b.city) cities.add(b.city);
      });

      setStats({
        employees: usersSnap.size,
        jobs: bookingSnap.size,
        revenue: totalRevenue,
        cities: cities.size,
      });
    };

    loadDashboard();
  }, []);

  if (!userData) return <div className="text-white p-10">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl mb-6">
        Welcome {userData.name} ({userData.role})
      </h2>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="Total Employees" value={stats.employees} />
        <StatsCard title="Active Jobs" value={stats.jobs} />
        <StatsCard title="Revenue" value={`₹${stats.revenue}`} />
        <StatsCard title="Cities" value={stats.cities} />
      </div>
    </div>
  );
}