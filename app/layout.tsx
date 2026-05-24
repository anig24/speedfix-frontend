import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Manrope } from "next/font/google";
import Script from "next/script";
import GlobalMotionSystem from "./components/GlobalMotionSystem";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import TawkChatWidget from "./components/TawkChatWidget";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "SpeedFix | Home Services",
  description:
    "Professional home services for repairs, cleaning, maintenance, and installations.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const serviceLinks = [
  {
    label: "Full home deep cleaning",
    href: "/services/cleaning/full-home-deep-cleaning",
  },
  {
    label: "Switchboard repairs",
    href: "/services/electrician/switchboard-repairs",
  },
  {
    label: "Leak repair",
    href: "/services/plumbing/leak-repair",
  },
  {
    label: "Split AC service",
    href: "/services/ac-service/split-ac-service",
  },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Workers", href: "/workers" },
  { label: "Riders", href: "/riders" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
];

const customerLinks = [
  { label: "All services", href: "/services" },
  { label: "Bike rides", href: "/rides" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <Providers>
          <GlobalMotionSystem />
          <Navbar />
          <TawkChatWidget />

          <main className="relative z-10 min-h-screen pt-[76px]">
            <PageTransition>{children}</PageTransition>
          </main>

          <footer className="relative z-10 border-t border-slate-200 bg-[#07111f] text-white">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] lg:px-8">
              <div className="max-w-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-semibold tracking-tight">
                    <span className="text-white">Speed</span>
                    <span className="text-[#FF6A00]">Fix</span>
                  </span>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  Professional home services for repairs, cleaning, maintenance,
                  and installations through a structured category and booking flow.
                </p>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Customer support
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    support@speedfix.co.in
                  </p>
                  <p className="mt-1 text-sm text-slate-300">+91-7439769525</p>
                </div>
              </div>

              <FooterColumn title="Services" links={serviceLinks} />
              <FooterColumn title="Company" links={companyLinks} />
              <FooterColumn title="Customers" links={customerLinks} />
            </div>

            <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-500 lg:px-8">
              {"©"} {new Date().getFullYear()} SpeedFix.co.in. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </h2>
      <div className="mt-5 space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block text-sm text-slate-300 transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
