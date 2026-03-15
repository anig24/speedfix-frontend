import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "SpeedFix - Smart Home Services",
  description: "Book trusted home services near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Providers>

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <div className="pt-[48px]">
            {children}
          </div>

          {/* Footer */}
          <footer className="bg-gray-950 text-gray-400 pt-16 pb-10 mt-24">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-4">Services</h4>
                <ul className="space-y-3">
                  <li>Electrician</li>
                  <li>Plumbing</li>
                  <li>AC Service</li>
                  <li>Home Cleaning</li>
                  <li>Appliance Repair</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Blog</li>
                  <li>Partner With Us</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  <li>Help Center</li>
                  <li>Safety</li>
                  <li>Cancellation Policy</li>
                  <li>Contact Us</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                <p>Email: support@speedfix.co.in</p>
                <p className="mt-2">Phone: +91 7439769525</p>
                <p className="mt-2">India</p>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
              © 2026 SpeedFix.co.in. All rights reserved.
            </div>
          </footer>

        </Providers>
      </body>
    </html>
  );
}
