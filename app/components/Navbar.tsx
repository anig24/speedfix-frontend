"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0B2A4A]/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-8 h-[48px] flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-base font-semibold tracking-wide text-white"
        >
          <span className="font-medium">Speed</span>
          <span className="text-orange-500 font-semibold">Fix</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
          <Link href="/services" className="hover:text-orange-400 transition">
            Services
          </Link>

          <Link href="/about" className="hover:text-orange-400 transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-orange-400 transition">
            Contact
          </Link>

          <Link
            href="/login"
            className="bg-orange-500 px-4 py-1 rounded-md text-xs font-semibold hover:bg-orange-600 transition"
          >
            Login / Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}
