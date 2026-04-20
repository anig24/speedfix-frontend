import type { ReactNode } from "react";

export default function TechnicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-slate-900">
      <header className="bg-blue-600 p-4 text-white shadow-md">
        <h1 className="text-xl font-bold">Technician Dashboard</h1>
      </header>

      <main className="p-6">{children}</main>

      <footer className="bg-gray-200 p-3 text-center text-sm">
        Copyright {new Date().getFullYear()} SpeedFix Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
}
