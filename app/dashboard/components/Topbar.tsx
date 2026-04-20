"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUser({ name });
  }, []);

  return (
    <div className="h-[60px] border-b border-white/10 flex items-center justify-between px-6">

      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">

        {/* 🔔 NOTIFICATION */}
        <div className="relative">
          <Bell className="cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded">
            2
          </span>
        </div>

        {/* 👤 USER */}
        <div className="bg-[#FF6A00] w-8 h-8 rounded-full flex items-center justify-center">
          {user?.name?.[0] || "U"}
        </div>
      </div>
    </div>
  );
}