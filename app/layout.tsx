import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpeedFix - Smart Home Services",
  description: "Professional home services delivered by verified experts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">

        {/* Top Branding Bar */}
        <div className="bg-[#0B1F3A] py-3">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            
            <h1 className="text-xl font-bold tracking-wide">
              <span className="text-white">Speed</span>
              <span className="text-orange-500">Fix</span>
            </h1>

            {/* Optional Right Side (can remove later) */}
            <div className="text-sm text-gray-300">
              24x7 Live Chat Support
            </div>

          </div>
        </div>

        {/* Main Page Content */}
        <main>{children}</main>

      </body>
    </html>
  );
}