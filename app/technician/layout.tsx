import type { ReactNode } from "react";

export default function TechnicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="min-h-screen flex flex-col">
          
          {/* Header */}
          <header className="bg-blue-600 text-white p-4 shadow-md">
            <h1 className="text-xl font-bold">
              Technician Dashboard
            </h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-200 text-center p-3 text-sm">
            © {new Date().getFullYear()} SpeedFix Pvt Ltd. All rights reserved.
          </footer>

        </div>
      </body>
    </html>
  );
}