import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Navbar from "./components/Navbar";
import TawkChatWidget from "./components/TawkChatWidget";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "SpeedFix | Premium Home Services",
  description:
    "Book premium home services with transparent packages, subcategories, cart checkout, and secure payments.",
};

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
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
];

const customerLinks = [
  { label: "All services", href: "/services" },
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
      <body className="antialiased">
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
          <Navbar />
          <TawkChatWidget />

          <main className="min-h-screen pt-16">{children}</main>

          <footer className="border-t border-white/10 bg-[#07111f] text-white">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr] lg:px-8">
              <div className="max-w-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-semibold tracking-tight">
                    <span className="text-white">Speed</span>
                    <span className="text-[#FF6A00]">Fix</span>
                  </span>
                  <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                    WELCOME30
                  </span>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  Premium home services with clearer category discovery,
                  clickable subcategories, cart-first booking, and secure
                  checkout.
                </p>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    First booking offer
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    30% off on your first booking with coupon `WELCOME30`
                  </p>
                </div>
              </div>

              <FooterColumn title="Popular Tasks" links={serviceLinks} />
              <FooterColumn title="Company" links={companyLinks} />
              <FooterColumn title="Customers" links={customerLinks} />
            </div>

            <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-500 lg:px-8">
              © Copyright {new Date().getFullYear()} SpeedFix.co.in. All rights reserved.
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
