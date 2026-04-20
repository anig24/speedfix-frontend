import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import Link from "next/link";
import Script from "next/script";

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
      <body className="bg-[#0F172A] text-white antialiased">

        {/* reCAPTCHA (safe load) */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}

        {/* Razorpay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <Providers>
          <Navbar />

          {/* MAIN */}
          <main className="pt-[60px] min-h-screen">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="bg-[#0B1220] border-t border-white/10 mt-32">

            <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-4 gap-14">

              {/* BRAND */}
              <div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">
                  <span className="text-white">Speed</span>
                  <span className="text-[#FF6A00]">Fix</span>
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  Smart, fast & verified home services platform.
                  Trusted professionals at your doorstep.
                </p>
              </div>

              {/* SERVICES */}
              <div>
                <h4 className="text-white font-semibold mb-6">
                  Services
                </h4>

                <ul className="space-y-3 text-sm text-gray-400">
                  {[
                    { name: "Electrician", link: "/services/electrician" },
                    { name: "Plumbing", link: "/services/plumbing" },
                    { name: "AC Service", link: "/services/ac-service" },
                    { name: "Home Cleaning", link: "/services/cleaning" },
                    { name: "Appliance Repair", link: "/services/appliance-repair" },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        className="hover:text-[#FF6A00] transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* COMPANY */}
              <div>
                <h4 className="text-white font-semibold mb-6">
                  Company
                </h4>

                <ul className="space-y-3 text-sm text-gray-400">
                  {[
                    { name: "About Us", link: "/about" },
                    { name: "Careers", link: "/careers" },
                    { name: "Blog", link: "/blog" },
                    { name: "Partner With Us", link: "/partner" },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        className="hover:text-[#FF6A00] transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SUPPORT */}
              <div>
                <h4 className="text-white font-semibold mb-6">
                  Support
                </h4>

                <ul className="space-y-3 text-sm text-gray-400">
                  {[
                    { name: "Help Center", link: "/help" },
                    { name: "Safety Policy", link: "/safety" },
                    { name: "Cancellation Policy", link: "/cancellation-policy" },
                    { name: "Contact Us", link: "/contact" },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        className="hover:text-[#FF6A00] transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* BOTTOM */}
            <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} SpeedFix.co.in — All Rights Reserved.
            </div>

          </footer>

        </Providers>
      </body>
    </html>
  );
}