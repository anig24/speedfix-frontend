"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import GlobalMotionSystem from "@/app/components/GlobalMotionSystem";
import Navbar from "@/app/components/Navbar";
import PageTransition from "@/app/components/PageTransition";

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
  { label: "Profile settings", href: "/customer/settings" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

const internalPrefixes = [
  "/corporate",
  "/agent",
  "/admin",
  "/dashboard",
  "/support",
  "/workspace",
];

function isInternalPath(pathname: string | null) {
  return internalPrefixes.some((prefix) => pathname?.startsWith(prefix));
}

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const internal = isInternalPath(pathname);

  if (internal) {
    return <main className="relative z-10 min-h-screen">{children}</main>;
  }

  return (
    <>
      <GlobalMotionSystem />
      <Navbar />

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
          &copy; {new Date().getFullYear()} SpeedFix.co.in. All rights reserved.
        </div>
      </footer>
    </>
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
