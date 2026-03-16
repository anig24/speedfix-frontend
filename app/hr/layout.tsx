"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/hr" },
    { name: "Employee Management", path: "/hr/employees" },
    { name: "Recruitment", path: "/hr/recruitment" },
    { name: "Attendance", path: "/hr/attendance" },
    { name: "Payroll", path: "/hr/payroll" },
    { name: "Reports & Analytics", path: "/hr/reports" },
    { name: "Settings", path: "/hr/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          SpeedFix HR
        </h2>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">HR Management Panel</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">HR Admin</span>
            <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}