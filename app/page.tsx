"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FormEvent, useDeferredValue, useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import LocationGate from "@/app/components/LocationGate";
import { operatingCities, serviceCatalog } from "@/lib/serviceCatalog";

type LeadForm = {
  service: string;
  name: string;
  phone: string;
  city: string;
  pincode: string;
  address: string;
  preferredDate: string;
  preferredSlot: string;
  propertyType: string;
  issueSummary: string;
};

const slots = [
  "08:00 AM - 11:00 AM",
  "11:00 AM - 02:00 PM",
  "02:00 PM - 05:00 PM",
  "05:00 PM - 08:00 PM",
  "Flexible",
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

export default function HomePage() {
  const [showLocationGate, setShowLocationGate] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
    bookingId?: string;
  }>({ type: "idle", message: "" });
  const [form, setForm] = useState<LeadForm>({
    service: serviceCatalog[0].slug,
    name: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
    preferredDate: tomorrow(),
    preferredSlot: slots[1],
    propertyType: "Apartment",
    issueSummary: "",
  });

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const selectedService =
    serviceCatalog.find((service) => service.slug === form.service) ??
    serviceCatalog[0];
  const today = new Date().toISOString().split("T")[0];
  const filteredServices = serviceCatalog.filter((service) => {
    if (!deferredQuery) return true;
    return [service.name, service.tagline, service.description, ...service.searchTerms]
      .join(" ")
      .toLowerCase()
      .includes(deferredQuery);
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      city: current.city || localStorage.getItem("city") || "",
      pincode: current.pincode || localStorage.getItem("pincode") || "",
    }));
  }, []);

  const update = <K extends keyof LeadForm>(key: K, value: LeadForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const syncLocation = () => {
    update("city", localStorage.getItem("city") || "");
    update("pincode", localStorage.getItem("pincode") || "");
    setShowLocationGate(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Creating your request..." });

    try {
      if (form.city) localStorage.setItem("city", form.city);
      if (form.pincode) localStorage.setItem("pincode", form.pincode);

      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Unable to create request.");

      setStatus({
        type: "success",
        message: `${result.serviceName} request created and saved to the bookings pipeline.`,
        bookingId: result.bookingId,
      });
      setForm((current) => ({
        ...current,
        name: "",
        phone: "",
        address: "",
        issueSummary: "",
      }));
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to create request.",
      });
    }
  };

  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.12),_transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div {...reveal} className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700">
                <Sparkles className="h-4 w-4 text-orange-500" />
                Marketplace-style home services with real booking intake
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                  SpeedFix home services
                </p>
                <h1 className="display-font max-w-3xl text-5xl leading-tight text-slate-950 md:text-6xl">
                  A proper service homepage for {form.city || "your city"} with
                  Urban Company style discovery and a stronger lead backend.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Browse trusted categories, see pricing entry points, and send
                  a structured request that lands in Firestore with city, slot,
                  priority and service details.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="#lead-form" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Book a service <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400">
                  Explore all services <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["12,000+", "jobs completed"],
                  ["4.8/5", "average rating"],
                  ["90 min", "fastest response"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <p className="text-2xl font-semibold text-slate-950">{value}</p>
                    <p className="mt-1 text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Most booked categories this week</p>
                    <p className="text-sm text-slate-500">Tap a chip to prefill the booking form.</p>
                  </div>
                  <button type="button" onClick={() => setShowLocationGate(true)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {form.city || "Choose location"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {serviceCatalog.map((service) => (
                    <button
                      key={service.slug}
                      type="button"
                      onClick={() => {
                        update("service", service.slug);
                        setStatus({ type: "idle", message: "" });
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        form.service === service.slug ? "bg-slate-950 text-white" : "bg-[#f7f2eb] text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal} id="lead-form" className="lg:sticky lg:top-24">
              <div className="rounded-[2rem] bg-slate-950 p-1 shadow-[0_40px_120px_rgba(15,23,42,0.24)]">
                <div className="rounded-[1.85rem] bg-white p-6 sm:p-7">
                  <div className="mb-5 rounded-[1.6rem] bg-[#fff5ea] p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                        <Image src={selectedService.image} alt={selectedService.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">Selected service</p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-950">{selectedService.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">Starts at Rs. {selectedService.basePrice} | {selectedService.responseTime}</p>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Service</label>
                      <select value={form.service} onChange={(event) => update("service", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                        {serviceCatalog.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                        <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Mobile number</label>
                        <input value={form.phone} onChange={(event) => update("phone", event.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={10} placeholder="10 digit mobile" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1fr_0.8fr]">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
                        <input value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Bengaluru" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Pincode</label>
                        <div className="flex gap-2">
                          <input value={form.pincode} onChange={(event) => update("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="560001" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                          <button type="button" onClick={() => setShowLocationGate(true)} className="rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300">Locate</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Property type</label>
                        <select value={form.propertyType} onChange={(event) => update("propertyType", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                          {["Apartment", "Villa", "Office", "Shop"].map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Preferred slot</label>
                        <select value={form.preferredSlot} onChange={(event) => update("preferredSlot", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                          {slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Preferred date</label>
                        <input type="date" min={today} value={form.preferredDate} onChange={(event) => update("preferredDate", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                      </div>
                      <div className="flex items-end">
                        <div className="flex w-full items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4 text-orange-500" />
                          Lead is stored with slot and priority
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Full service address</label>
                      <textarea value={form.address} onChange={(event) => update("address", event.target.value)} rows={3} placeholder="Flat, street, landmark and area" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Tell us the issue</label>
                      <textarea value={form.issueSummary} onChange={(event) => update("issueSummary", event.target.value)} rows={3} placeholder="Example: kitchen sink is leaking under the cabinet" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                    </div>

                    <button type="submit" disabled={status.type === "loading"} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                      {status.type === "loading" ? "Creating request..." : "Create booking request"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  {status.type !== "idle" && (
                    <div className={`mt-4 rounded-[1.5rem] px-4 py-3 text-sm ${
                      status.type === "success" ? "bg-emerald-50 text-emerald-700" : status.type === "error" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
                    }`}>
                      <p>{status.message}</p>
                      {status.bookingId && <p className="mt-1 font-medium">Request ID: {status.bookingId}</p>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div {...reveal} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Popular categories</p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">Built like a real service marketplace, not just a brochure.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Search categories, compare entry pricing and jump into detail pages that now work across the catalog.</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cleaning, AC, leak, fan..." className="w-full rounded-full border border-slate-300 bg-white px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <motion.article key={service.slug} {...reveal} className={`overflow-hidden rounded-[2rem] border bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition ${form.service === service.slug ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200"}`}>
              <div className="relative h-56 overflow-hidden">
                <Image src={service.image} alt={service.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700">
                  <Wrench className="h-4 w-4 text-orange-500" />
                  {service.coverage}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950">{service.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.tagline}</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">Rs. {service.basePrice}+</div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-orange-400 text-orange-400" />{service.rating}</span>
                  <span>{service.reviews}</span>
                  <span>{service.jobsCompleted}</span>
                </div>
                <div className="mt-5 space-y-2">
                  {service.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-2 text-sm text-slate-600">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {highlight}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => update("service", service.slug)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Select service <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
                    View details <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div {...reveal} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Service flow</p>
            <h2 className="mt-3 display-font text-4xl">The homepage now feeds an actual operations pipeline.</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">Requests from the hero form are stored as structured booking leads with service, city, slot, source, status and urgency so admin and operations pages can work with them.</p>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Choose a category", "Customer selects service, slot, address and issue details from the home page."],
              ["Lead gets qualified", "The new API validates inputs and creates a consistent booking lead in Firestore."],
              ["Ops can route faster", "Each lead carries service, city and priority data that helps assignment."],
              ["Track from one place", "Data stays in the bookings collection so current admin screens can pick it up."],
            ].map(([title, text], index) => (
              <motion.div key={title} {...reveal} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">{index + 1}</div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div {...reveal}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Why this works better</p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">Clean discovery on the front, reliable routing on the back.</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">This gives you the polished consumer feel of an Urban Company-style landing page while moving the backend closer to a managed lead funnel.</p>
            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold text-slate-900">Active operating cities</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {operatingCities.map((city) => <span key={city} className="rounded-full bg-[#f7f2eb] px-4 py-2 text-sm text-slate-700">{city}</span>)}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                Icon: ShieldCheck,
                title: "Verified professionals",
                text: "Background-checked service partners and a managed request flow.",
              },
              {
                Icon: Clock3,
                title: "Structured slots",
                text: "Morning, afternoon and evening windows with clearer customer intent.",
              },
              {
                Icon: BadgeCheck,
                title: "Standardized pricing",
                text: "Shared service catalog keeps pricing cards and requests aligned.",
              },
              {
                Icon: Sparkles,
                title: "Better conversion quality",
                text: "More complete inputs mean fewer calls just to understand the job.",
              },
            ].map(({ Icon, title, text }) => (
              <motion.div key={title} {...reveal} className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.05)]">
                <div className="inline-flex rounded-2xl bg-[#fff5ea] p-3 text-orange-500"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div {...reveal} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Customer stories</p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">A stronger homepage earns better requests.</h2>
          </motion.div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              ["The booking card felt clear, the electrician arrived on time, and I could stop calling five vendors for one issue.", "Aditi Sharma", "Whitefield, Bengaluru"],
              ["We used SpeedFix for move-out cleaning and fan installation in the same week. The service flow felt organized instead of chaotic.", "Rohan Mehta", "Powai, Mumbai"],
              ["Once I described the problem in the request form, the technician already knew what to bring. That saved a full extra visit.", "Neha Kapoor", "Gachibowli, Hyderabad"],
            ].map(([quote, name, city]) => (
              <motion.blockquote key={name} {...reveal} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <p className="text-base leading-8 text-slate-700">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-950">{name}</p>
                  <p className="text-sm text-slate-500">{city}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div {...reveal} className="rounded-[2.25rem] bg-slate-950 px-8 py-10 text-white shadow-[0_40px_120px_rgba(15,23,42,0.2)] md:px-12 md:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Ready to launch</p>
              <h2 className="mt-3 display-font text-4xl">This homepage is now built to convert instead of just existing.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Use the booking card for NoBroker-style intake logic, or browse the full service catalog for package-level detail.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="#lead-form" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Start a request <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40">
                Browse all services <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {showLocationGate && <LocationGate onClose={syncLocation} />}
    </div>
  );
}
