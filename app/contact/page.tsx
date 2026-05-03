"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { operatingCities } from "@/lib/serviceCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const contactCards = [
  {
    title: "Customer support",
    value: "support@speedfix.co.in",
    href: "mailto:support@speedfix.co.in",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+91-7439769525",
    href: "tel:+917439769525",
    icon: Phone,
  },
  {
    title: "Service coverage",
    value: "Major metro service zones",
    href: "/services",
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <div className="public-shell text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="public-hero-glow absolute inset-x-0 top-0 h-[28rem]" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <motion.div {...reveal} className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Contact
            </p>
            <h1 className="mt-4 display-font text-5xl text-slate-950 md:text-6xl">
              Contact SpeedFix
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Reach out for service help, booking questions, pricing
              clarifications, or post-booking customer support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {contactCards.map(({ title, value, href, icon: Icon }) => (
            <motion.a
              key={title}
              {...reveal}
              href={href}
              className="surface-panel lift-card rounded-[2rem] border border-slate-200 p-6"
            >
              <div className="inline-flex rounded-2xl bg-[#fff2df] p-3 text-orange-500">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{value}</p>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <motion.div
            {...reveal}
            className="surface-panel rounded-[2rem] border border-slate-200 p-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Operating cities
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {operatingCities.map((city) => (
                <span
                  key={city}
                  className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700"
                >
                  {city}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...reveal}
            className="dark-panel rounded-[2rem] p-6 text-white"
          >
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-orange-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold">Need to book now?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Browse services, select the right subcategory, add to cart, and
              complete checkout with a cleaner premium booking flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Browse services
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                View cart
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
