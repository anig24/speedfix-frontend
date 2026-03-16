"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useState } from "react";
import {
  FaSnowflake,
  FaFaucet,
  FaBolt,
  FaBroom,
  FaTools,
} from "react-icons/fa";
import CitySection from "./components/CitySection";

export default function Home() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSecureRedirect = async () => {
    setError("");
    setLoading(true);

    try {
      if (!executeRecaptcha) {
        setError("Security verification not ready. Please refresh.");
        setLoading(false);
        return;
      }

      const token = await executeRecaptcha("homepage_booking");

      const verify = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!verify.ok) {
        setError("Security verification failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/services");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <main>
      
{/* HERO SECTION */}
<section className="relative min-h-[85vh] flex items-center overflow-hidden">

  {/* Background Image FULL WIDTH */}
  <img
    src="/hero.png"
    alt="SpeedFix Services"
    className="absolute inset-0 w-full h-full object-cover object-center"
  />

  {/* Content on top of image */}
  <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
    <div className="grid md:grid-cols-2 items-center">

      {/* LEFT SIDE CONTENT */}
      <div className="text-left">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-[#0B1F3B]">
          Trusted Technician
          <br />
          & Cleaning Specialist
          <br />
          <span className="text-orange-500">
            at Your Home
          </span>
        </h1>

        {/* Service Icons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 max-w-xl">
          <Link href="/services/ac-service" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-orange-500 transition">
              <FaSnowflake className="text-xl text-blue-500 group-hover:text-white" />
            </div>
            <span className="font-medium text-gray-900">AC Service</span>
          </Link>

          <Link href="/services/plumbing" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-orange-500 transition">
              <FaFaucet className="text-xl text-blue-600 group-hover:text-white" />
            </div>
            <span className="font-medium text-gray-900">Plumbing</span>
          </Link>

          <Link href="/services/electrician" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-orange-500 transition">
              <FaBolt className="text-xl text-blue-600 group-hover:text-white" />
            </div>
            <span className="font-medium text-gray-900">Electrical</span>
          </Link>

          <Link href="/services/cleaning" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-orange-500 transition">
              <FaBroom className="text-xl text-purple-500 group-hover:text-white" />
            </div>
            <span className="font-medium text-gray-900">Home Cleaning</span>
          </Link>

          <Link href="/services/appliance-repair" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-orange-500 transition">
              <FaTools className="text-xl text-indigo-500 group-hover:text-white" />
            </div>
            <span className="font-medium text-gray-900">Appliance Repair</span>
          </Link>
        </div>


{/* Buttons */}
<div className="flex gap-5">
  <button
    onClick={() => router.push("/services")}
    className="px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition shadow-md hover:scale-105 active:scale-95 duration-200"
  >
    Book a Service
  </button>

  <button
    onClick={() => router.push("/login")}
    className="px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition shadow-md hover:scale-105 active:scale-95 duration-200"
  >
    Instant Booking
  </button>
</div>

      </div>

      {/* RIGHT SIDE EMPTY (image is full background) */}
      <div></div>

    </div>
  </div>
</section>

      {/* POPULAR SERVICES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0B1F3B] mb-12">
            Popular Services
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Link href="/services/cleaning" className="p-10 rounded-2xl border hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#0B1F3B] mb-3">
                Deep Cleaning
              </h3>
              <p className="text-gray-600 text-sm">
                Complete home cleaning by trained professionals.
              </p>
            </Link>

            <Link href="/services/electrician" className="p-10 rounded-2xl border hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#0B1F3B] mb-3">
                Electrical Repairs
              </h3>
              <p className="text-gray-600 text-sm">
                Switches, wiring and maintenance services.
              </p>
            </Link>

            <Link href="/services/ac-service" className="p-10 rounded-2xl border hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#0B1F3B] mb-3">
                AC Service
              </h3>
              <p className="text-gray-600 text-sm">
                Installation & yearly maintenance.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <CitySection />

      {/* FINAL CTA */}
      <section className="py-28 bg-[#0B1F3B] text-white text-center">
        <h2 className="text-4xl font-bold mb-8">
          Ready to Book Your Service?
        </h2>

        <button
          onClick={handleSecureRedirect}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-orange-500 px-10 py-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaTools className="text-lg animate-float" />
              Securing...
            </>
          ) : (
            "Book Now"
          )}
        </button>
      </section>
    </main>
  );
}