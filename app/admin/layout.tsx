"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Technicians", path: "/admin/technicians" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Cities", path: "/admin/cities" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Support", path: "/admin/support" },
    { name: "Audit", path: "/admin/audit" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1F3B] text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">SpeedFix Admin</h2>

        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === item.path
                ? "bg-orange-500"
                : "hover:bg-white/10"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="bg-white shadow px-8 py-4 flex justify-between">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <div>Welcome, Admin</div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}