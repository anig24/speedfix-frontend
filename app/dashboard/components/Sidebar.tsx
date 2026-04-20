"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const r = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    setRole(r || "");
  }, []);

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Employees", path: "/dashboard/employees" },
    { name: "Operations", path: "/dashboard/operations" },
    { name: "Finance", path: "/dashboard/finance" },
    { name: "Reports", path: "/dashboard/reports" },
  ];

  return (
    <div className="w-[240px] bg-[#020617] border-r border-white/10 p-4">
      <h2 className="text-xl font-bold mb-6">
        <span className="text-white">Speed</span>
        <span className="text-[#FF6A00]">Fix</span>
      </h2>

      <div className="flex flex-col gap-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="p-3 rounded-lg hover:bg-[#FF6A00]/20 transition"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 text-xs text-gray-400">
        Role: {role}
      </div>
    </div>
  );
}